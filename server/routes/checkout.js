import { Router } from 'express';
import { Preference } from 'mercadopago';
import { supabaseAdmin } from '../lib/supabase.js';
import { mpClient } from '../lib/mercadopago.js';

const router = Router();

// Definimos la URL base sin vueltas
const FRONTEND_URL = 'http://localhost:5173';

router.post('/', async (req, res) => {
  try {
    if (!supabaseAdmin || !mpClient) {
      return res.status(503).json({ error: 'Configuración incompleta.' });
    }

    const { items, email, name } = req.body;

    // 1. Verificación de Stock
    const productIds = items.map(i => i.id);
    const { data: products, error: fetchErr } = await supabaseAdmin
      .from('products')
      .select('*')
      .in('id', productIds);

    if (fetchErr) throw fetchErr;

    const orderItems = [];
    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: `Sin stock para ${item.name}` });
      }
      orderItems.push({
        id: product.id,
        title: product.name,
        unit_price: product.price,
        quantity: item.quantity,
        currency_id: 'ARS'
      });
    }

    const total = orderItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

    // 2. Crear orden en Supabase
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert({
        status: 'pending',
        items: orderItems,
        customer_email: email,
        customer_name: name,
        total
      })
      .select().single();

    if (orderErr) throw orderErr;

    // 3. Crear Preferencia de Mercado Pago
    const preference = new Preference(mpClient);

    // IMPORTANTE: Definimos las URLs de forma ultra-limpia aquí
    const successUrl = `${FRONTEND_URL}/?payment=success&order=${order.id}`;
    const failureUrl = `${FRONTEND_URL}/carrito/?payment=failure`;

    const response = await preference.create({
      body: {
        items: orderItems,
        payer: { email, name },
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: successUrl
        },
        auto_return: 'approved', // Esto obliga a que success funcione
        external_reference: order.id,
        // En localhost el webhook no va a avisar, pero lo dejamos para producción
        notification_url: `https://webhook.site/test`
      }
    });

    // 4. Actualizar orden
    await supabaseAdmin
      .from('orders')
      .update({ mp_preference_id: response.id })
      .eq('id', order.id);

    res.json({ init_point: response.init_point });

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Falla en el servidor de Cuyo Cebado.' });
  }
});

export default router;