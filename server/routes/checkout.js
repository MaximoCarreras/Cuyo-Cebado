import { Router } from 'express';
import { Preference } from 'mercadopago';
import { supabaseAdmin } from '../lib/supabase.js';
import { mpClient } from '../lib/mercadopago.js';

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

router.post('/', async (req, res) => {
  try {
    if (!supabaseAdmin || !mpClient) {
      return res.status(503).json({
        error: 'Configuración de Supabase o MP ausente en el servidor.'
      });
    }

    // Recibimos los datos, incluyendo el descuento de puntos si el usuario lo aplicó
    const { items, email, name, shippingCost, discount } = req.body;

    const productIds = items.map(i => i.id);
    const { data: products, error: fetchErr } = await supabaseAdmin
      .from('products')
      .select('*')
      .in('id', productIds);

    if (fetchErr) throw fetchErr;

    const orderItems = [];
    let totalCalculado = 0;

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
      totalCalculado += Number(product.price) * Number(item.quantity);
    }

    if (shippingCost && Number(shippingCost) > 0) {
      orderItems.push({
        title: 'Costo de Envío',
        unit_price: Number(shippingCost),
        quantity: 1,
        currency_id: 'ARS'
      });
      totalCalculado += Number(shippingCost);
    }

    // Si el cliente aplicó puntos, enviamos el descuento a Mercado Pago
    if (discount && Number(discount) > 0) {
      orderItems.push({
        title: 'Descuento Cuyo Puntos ✨',
        unit_price: -Number(discount),
        quantity: 1,
        currency_id: 'ARS'
      });
      totalCalculado -= Number(discount);
    }

    // Buscamos la orden pendiente que el frontend acaba de crear para enganchar el ID
    const { data: recentOrder } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('customer_email', email)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let orderId = '';

    if (recentOrder) {
      orderId = recentOrder.id;
      // Actualizamos los montos de seguridad en la base de datos
      await supabaseAdmin.from('orders').update({ total: totalCalculado, items: orderItems }).eq('id', orderId);
    } else {
      // Fallback de seguridad por si no se encontró
      const { data: newOrder } = await supabaseAdmin.from('orders').insert({
        status: 'pending', items: orderItems, customer_email: email, customer_name: name, total: totalCalculado
      }).select().single();
      orderId = newOrder.id;
    }

    const preference = new Preference(mpClient);

    const response = await preference.create({
      body: {
        items: orderItems,
        payer: { email, name },
        back_urls: {
          success: `${FRONTEND_URL}/`,
          failure: `${FRONTEND_URL}/carrito`,
          pending: `${FRONTEND_URL}/`
        },
        auto_return: "approved",
        external_reference: orderId
      }
    });

    res.json({ init_point: response.init_point });

  } catch (err) {
    console.error('--- ERROR DETALLADO EN CHECKOUT ---');
    console.error(err);
    res.status(500).json({ error: 'Falla en el servidor de Cuyo Cebado.' });
  }
});

export default router;