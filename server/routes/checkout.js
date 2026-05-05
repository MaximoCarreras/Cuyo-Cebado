/**
 * Checkout Routes — Creates Mercado Pago preferences and orders.
 * POST /api/checkout — Verifies stock, creates order, returns MP checkout URL.
 * 
 * Flow: verify stock → create order (pending) → create MP preference → return URL [SF]
 */
import { Router } from 'express';
import { Preference } from 'mercadopago';
import { supabaseAdmin } from '../lib/supabase.js';
import { mpClient } from '../lib/mercadopago.js';

const router = Router();

/* Frontend URL for MP redirect callbacks [CMV] */
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * POST /api/checkout
 * Body: { items: [{id, quantity}], email, name }
 * Returns: { init_point, order_id }
 */
router.post('/', async (req, res) => {
  try {
    if (!supabaseAdmin || !mpClient) {
      return res.status(503).json({ 
        error: 'Supabase or Mercado Pago not configured' 
      });
    }

    const { items, email, name } = req.body;

    /* Validate input [IV] */
    if (!items?.length || !email || !name) {
      return res.status(400).json({ error: 'Missing required fields: items, email, name' });
    }

    /* Step 1: Verify stock for all items */
    const productIds = items.map(i => i.id);
    const { data: products, error: fetchErr } = await supabaseAdmin
      .from('products')
      .select('*')
      .in('id', productIds);

    if (fetchErr) throw fetchErr;

    /* Check each item has sufficient stock */
    const orderItems = [];
    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.id} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }
      orderItems.push({
        product_id: product.id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
      });
    }

    /* Calculate total */
    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    /* Step 2: Create order in Supabase (status: pending) */
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert({
        status: 'pending',
        items: orderItems,
        customer_email: email,
        customer_name: name,
        total,
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    /* Step 3: Create Mercado Pago preference */
    const preference = new Preference(mpClient);
    const mpPreference = await preference.create({
      body: {
        items: orderItems.map(item => ({
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: 'ARS',
        })),
        payer: {
          email,
          name,
        },
        /* Redirect URLs after payment */
        back_urls: {
          success: `${FRONTEND_URL}?payment=success&order=${order.id}`,
          failure: `${FRONTEND_URL}?payment=failure&order=${order.id}`,
          pending: `${FRONTEND_URL}?payment=pending&order=${order.id}`,
        },
        auto_return: 'approved',
        /* External reference to link MP payment with our order */
        external_reference: order.id,
        /* Webhook notification URL */
        notification_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/webhooks/mercadopago`,
      },
    });

    /* Step 4: Update order with MP preference ID */
    await supabaseAdmin
      .from('orders')
      .update({ mp_preference_id: mpPreference.id })
      .eq('id', order.id);

    /* Return checkout URL to frontend */
    res.json({
      init_point: mpPreference.init_point,
      order_id: order.id,
    });

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Checkout failed. Please try again.' });
  }
});

export default router;
