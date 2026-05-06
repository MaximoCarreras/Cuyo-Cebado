import { Router } from 'express';
import { Preference } from 'mercadopago';
import { supabaseAdmin } from '../lib/supabase.js';
import { mpClient } from '../lib/mercadopago.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    if (!supabaseAdmin || !mpClient) {
      return res.status(503).json({ error: 'Configuración incompleta.' });
    }

    const { items, email, name } = req.body;

    // 1. Verificar Stock en Supabase
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
        title: product.name,
        unit_price: Number(product.price),
        quantity: Number(item.quantity),
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

    const response = await preference.create({
      body: {
        items: orderItems,
        payer: { email, name },
        back_urls: {
          // URLs ultra-limpias (sin parámetros raros para que MP no se queje)
          success: "http://localhost:5173",
          failure: "http://localhost:5173/carrito",
          pending: "http://localhost:5173"
        },
        auto_return: "approved",
        external_reference: order.id,
        // Comentamos la notificación para evitar errores de validación en local
        // notification_url: "https://tu-url.com/webhook" 
      }
    });

    // 4. Actualizar orden con el ID de la preferencia
    await supabaseAdmin
      .from('orders')
      .update({ mp_preference_id: response.id })
      .eq('id', order.id);

    res.json({ init_point: response.init_point });

  } catch (err) {
    console.error('--- ERROR DETALLADO EN CHECKOUT ---');
    console.error(err);
    res.status(500).json({ error: 'Falla en el servidor de Cuyo Cebado.' });
  }
});

export default router;