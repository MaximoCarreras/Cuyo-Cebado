import { Router } from 'express';
import { Preference } from 'mercadopago';
import { supabaseAdmin } from '../lib/supabase.js';
import { mpClient } from '../lib/mercadopago.js';

const router = Router();

// Definimos la URL de forma estática para la prueba local
const FRONTEND_URL = 'http://localhost:5173';

router.post('/', async (req, res) => {
  try {
    if (!supabaseAdmin || !mpClient) {
      return res.status(503).json({ error: 'Falta configuración de Supabase/MP' });
    }

    const { items, email, name } = req.body;

    // 1. Verificar Stock
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
        return res.status(400).json({ error: `Stock insuficiente para ${item.name}` });
      }
      orderItems.push({
        id: product.id,
        title: product.name,
        unit_price: Number(product.price),
        quantity: Number(item.quantity),
        currency_id: 'ARS'
      });
    }

    const total = orderItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

    // 2. Crear Orden
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

    // 3. Crear Preferencia (CON URLS LIMPIAS)
    const preference = new Preference(mpClient);

    // Creamos los strings de las URLs antes de meterlos al objeto
    const success_url = `${FRONTEND_URL}/?payment=success&order=${order.id}`;
    const failure_url = `${FRONTEND_URL}/carrito`;

    const response = await preference.create({
      body: {
        items: orderItems.map(item => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: 'ARS'
        })),
        payer: { email, name },
        back_urls: {
          success: success_url,
          failure: failure_url,
          pending: success_url
        },
        auto_return: 'approved',
        external_reference: order.id,
        // Usamos una URL de prueba genérica para el webhook en local
        notification_url: 'https://webhook.site/cuyo-cebado-test'
      }
    });

    // 4. Actualizar Orden con el ID de preferencia
    await supabaseAdmin
      .from('orders')
      .update({ mp_preference_id: response.id })
      .eq('id', order.id);

    res.json({ init_point: response.init_point });

  } catch (err) {
    console.error('Checkout error detallado:', err);
    res.status(500).json({ error: 'Falla en el servidor. Revisá la terminal.' });
  }
});

export default router;