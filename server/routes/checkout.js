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

    // 🚨 ATENCIÓN: Ya ni siquiera sacamos 'discount' del body. No le creemos al cliente.
    const { items, email, name, shippingCost, orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ error: 'Falta el ID de la orden.' });
    }

    // 1. OBTENER LA ORDEN REAL DE LA BASE DE DATOS
    // Necesitamos saber de qué usuario es para revisarle los puntos
    const { data: order, error: orderErr } = await supabaseAdmin
        .from('orders')
        .select('user_id, puntos_descontados')
        .eq('id', orderId)
        .single();

    if (orderErr || !order) {
        return res.status(404).json({ error: 'Orden no encontrada en la base de datos.' });
    }

    // 2. BUSCAR PRECIOS REALES DE LOS PRODUCTOS EN LA BD (Ignoramos el precio del frontend)
    const productIds = items.map(i => i.id);
    const { data: products, error: fetchErr } = await supabaseAdmin
      .from('products')
      .select('*')
      .in('id', productIds);

    if (fetchErr) throw fetchErr;

    const orderItems = [];
    let realTotalItemsPrice = 0;

    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: `Sin stock para ${item.name}` });
      }

      const unitPrice = Number(product.price);
      const quantity = Number(item.quantity);

      realTotalItemsPrice += (unitPrice * quantity);

      orderItems.push({
        title: product.name,
        unit_price: unitPrice, // Precio 100% seguro traído desde Supabase
        quantity: quantity,
        currency_id: 'ARS'
      });
    }

    // 3. VALIDAR COSTO DE ENVÍO (Evita que manden valores negativos para restar plata)
    const validShippingCost = Math.max(0, Number(shippingCost) || 0);
    if (validShippingCost > 0) {
      orderItems.push({
        title: 'Costo de Envío',
        unit_price: validShippingCost,
        quantity: 1,
        currency_id: 'ARS'
      });
    }

    // 4. CALCULAR DESCUENTO REAL Y SEGURO (Desde la base de datos, no del frontend)
    let realDiscount = 0;
    let pointsToDeduct = 0;

    // Si la orden decía que quería usar puntos y es un usuario registrado...
    if (order.user_id && order.puntos_descontados > 0) {
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('puntos')
            .eq('id', order.user_id)
            .single();

        if (profile && profile.puntos > 0) {
            // Regla de seguridad: El usuario no puede gastar más puntos de los que tiene.
            pointsToDeduct = Math.min(order.puntos_descontados, profile.puntos);
            realDiscount = pointsToDeduct * 3; // Tu regla de negocio: 1 punto = $3
            
            orderItems.push({
              title: 'Descuento Cuyo Puntos ✨',
              unit_price: -Number(realDiscount),
              quantity: 1,
              currency_id: 'ARS'
            });
        }
    }

    // 5. ACTUALIZAR LA ORDEN CON LOS VALORES VERDADEROS 
    // Por si el frontend mandó datos falsos, corregimos la BD antes de cobrar.
    const finalTrueTotal = realTotalItemsPrice + validShippingCost - realDiscount;
    await supabaseAdmin.from('orders').update({ 
        total: finalTrueTotal,
        puntos_descontados: pointsToDeduct
    }).eq('id', orderId);

    // 6. CREAR LA PREFERENCIA DE MERCADO PAGO CON LOS DATOS BLINDADOS
    const preference = new Preference(mpClient);

    const response = await preference.create({
      body: {
        items: orderItems,
        payer: { email, name },
        back_urls: {
          success: `${FRONTEND_URL}/?status=approved`, 
          failure: `${FRONTEND_URL}/carrito`,
          pending: `${FRONTEND_URL}/`
        },
        auto_return: "approved",
        external_reference: orderId,
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