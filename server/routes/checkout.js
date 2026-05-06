/**
 * Checkout Routes — Cuyo Cebado
 * Flujo: verificar stock → crear orden (pending) → crear preferencia MP → retornar URL
 */
import { Router } from 'express';
import { Preference } from 'mercadopago';
import { supabaseAdmin } from '../lib/supabase.js';
import { mpClient } from '../lib/mercadopago.js';

const router = Router();

/* Aseguramos que la URL del frente sea absoluta */
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

router.post('/', async (req, res) => {
  try {
    if (!supabaseAdmin || !mpClient) {
      return res.status(503).json({
        error: 'Supabase o Mercado Pago no están configurados.'
      });
    }

    const { items, email, name } = req.body;

    if (!items?.length || !email || !name) {
      return res.status(400).json({ error: 'Faltan campos requeridos: items, email, name' });
    }

    /* Paso 1: Verificar stock real en Supabase */
    const productIds = items.map(i => i.id);
    const { data: products, error: fetchErr } = await supabaseAdmin
      .from('products')
      .select('*')
      .in('id', productIds);

    if (fetchErr) throw fetchErr;

    const orderItems = [];
    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      if (!product) {
        return res.status(400).json({ error: `Producto no encontrado: ${item.id}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Stock insuficiente para ${product.name}. Disponibles: ${product.stock}`
        });
      }
      orderItems.push({
        product_id: product.id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
      });
    }

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    /* Paso 2: Crear orden en Supabase (status: pending) */
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

    /* Paso 3: Crear Preferencia de Mercado Pago */
    const preference = new Preference(mpClient);

    // IMPORTANTE: Agregamos una "/" antes de los parámetros "?" en las back_urls
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
        back_urls: {
          success: `${FRONTEND_URL}/?payment=success&order=${order.id}`,
          failure: `${FRONTEND_URL}/carrito/?payment=failure&order=${order.id}`,
          pending: `${FRONTEND_URL}/carrito/?payment=pending&order=${order.id}`,
        },
        auto_return: 'approved',
        external_reference: order.id,
        // La notificación solo funcionará cuando el servidor esté online (no en localhost)
        notification_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/webhooks/mercadopago`,
      },
    });

    /* Paso 4: Actualizar la orden con el ID de la preferencia */
    await supabaseAdmin
      .from('orders')
      .update({ mp_preference_id: mpPreference.id })
      .eq('id', order.id);

    /* Devolvemos el init_point para que React redirija */
    res.json({
      init_point: mpPreference.init_point,
      order_id: order.id,
    });

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Hubo un error al procesar el checkout.' });
  }
});

export default router;