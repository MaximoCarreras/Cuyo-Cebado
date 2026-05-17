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

    // 3. Inicializar la preferencia de Mercado Pago
    const preference = new Preference(mpClient);

    const response = await preference.create({
      body: {
        // ✨ INYECTAMOS PAQUETERÍA AUTOMÁTICA A CADA PRODUCTO ✨
        items: orderItems.map(item => ({
          title: item.title,
          unit_price: item.unit_price,
          quantity: item.quantity,
          currency_id: 'ARS',
          dimensions: {
            weight: 450,   // Peso promedio en gramos (ej: un mate completo con embalaje)
            height: 15,    // Alto en cm
            width: 15,     // Ancho en cm
            depth: 15      // Profundidad en cm
          }
        })),
        payer: { email, name },

        // 🚚 INTEGRACIÓN DE MERCADO ENVÍOS AUTOMÁTICA RE-ACTIVADA 🚚
        shipments: {
          mode: "me2",
          local_pickup: true // Habilita la opción "Retiro gratis por el local"
        },

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