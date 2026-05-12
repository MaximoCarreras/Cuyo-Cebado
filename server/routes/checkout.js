import { Router } from 'express';
import { Preference } from 'mercadopago';
import { supabaseAdmin } from '../lib/supabase.js';
import { mpClient } from '../lib/mercadopago.js';

const router = Router();

// Detectamos si estamos en producción (Render) o en tu PC
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

router.post('/', async (req, res) => {
  try {
    // Verificamos qué es lo que falta exactamente para ayudarte mejor
    if (!supabaseAdmin || !mpClient) {
      console.error("--- ERROR DE CONFIGURACIÓN ---");
      if (!supabaseAdmin) console.error("Falta inicializar Supabase. Revisá SUPABASE_URL y SUPABASE_KEY");
      if (!mpClient) console.error("Falta inicializar Mercado Pago. Revisá MP_ACCESS_TOKEN");

      return res.status(503).json({
        error: 'Configuración de Supabase o MP ausente en el servidor.'
      });
    }

    const { items, email, name } = req.body;

    // 1. Verificación de Stock en Supabase
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