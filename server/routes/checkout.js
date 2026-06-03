import { Router } from 'express';
import { Preference } from 'mercadopago';
import { supabaseAdmin } from '../lib/supabase.js';
import { mpClient } from '../lib/mercadopago.js';

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://cuyocebado.com.ar';

router.post('/', async (req, res) => {
  try {
    if (!supabaseAdmin || !mpClient) {
      return res.status(503).json({ error: 'Configuración de Supabase o MP ausente.' });
    }

    const { items, email, name, shippingCost, discount, orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ error: 'Falta el ID de la orden.' });
    }

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

    if (shippingCost && Number(shippingCost) > 0) {
      orderItems.push({
        title: 'Costo de Envío',
        unit_price: Number(shippingCost),
        quantity: 1,
        currency_id: 'ARS'
      });
    }

    if (discount && Number(discount) > 0) {
      orderItems.push({
        title: 'Descuento Cuyo Puntos ✨',
        unit_price: -Number(discount),
        quantity: 1,
        currency_id: 'ARS'
      });
    }

    const preference = new Preference(mpClient);

    const response = await preference.create({
      body: {
        items: orderItems,
        payer: { email, name },
        back_urls: {
          // FORZAMOS LA URL PARA QUE EL CARRITO SE VACÍE SÍ O SÍ
          success: `${FRONTEND_URL}/?status=approved`, 
          failure: `${FRONTEND_URL}/carrito`,
          pending: `${FRONTEND_URL}/`
        },
        auto_return: "approved",
        external_reference: orderId,
        // Redirigido de forma definitiva a la ruta de tu servidor en Render
        notification_url: "https://cuyo-cebado.onrender.com/api/webhooks" 
      }
    });

    res.json({ init_point: response.init_point });

  } catch (err) {
    console.error('--- ERROR DETALLADO EN CHECKOUT ---', err);
    res.status(500).json({ error: 'Falla en el servidor de Cuyo Cebado.' });
  }
});

export default router;