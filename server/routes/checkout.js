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

    // 💥 RECIBIMOS EL SHIPPING COST DESDE EL FRONTEND 💥
    const { items, email, name, shippingCost } = req.body;

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

    // 🚚 SI HAY COSTO DE ENVÍO, LO AGREGAMOS COMO UN ÍTEM MÁS 🚚
    if (shippingCost && Number(shippingCost) > 0) {
      orderItems.push({
        title: 'Costo de Envío a domicilio',
        unit_price: Number(shippingCost),
        quantity: 1,
        currency_id: 'ARS'
      });
    }

    const total = orderItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

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

    const preference = new Preference(mpClient);

    // 🛠️ CONFIGURACIÓN LIMPIA SIN FORZAR ME2 🛠️
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
        external_reference: order.id
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