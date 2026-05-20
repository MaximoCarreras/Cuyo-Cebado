import { Router } from 'express';
import { Payment } from 'mercadopago';
import { supabaseAdmin } from '../lib/supabase.js';
import { mpClient } from '../lib/mercadopago.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { query } = req;
    // Mercado Pago envía el tipo de evento en 'type' o 'topic'
    const topic = query.type || query.topic;

    if (topic === 'payment') {
      // El ID único del pago de Mercado Pago
      const paymentId = query['data.id'] || query.id;

      if (!paymentId) {
        return res.status(400).send('ID de pago no encontrado');
      }

      // 1. Consultamos a Mercado Pago el estado real de ese pago
      const payment = new Payment(mpClient);
      const paymentData = await payment.get({ id: paymentId });

      // 2. Si el pago está aprobado, procesamos el pedido
      if (paymentData.status === 'approved') {
        const orderId = paymentData.external_reference; // El ID de la orden en tu Supabase

        // Buscamos la orden asociada en nuestra base de datos
        const { data: order, error: orderErr } = await supabaseAdmin
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderErr || !order) {
          console.error('Orden no encontrada en Supabase:', orderErr);
          return res.status(404).send('Orden no encontrada');
        }

        // 🛡️ Si la orden ya figura como 'approved', salimos (evita restar stock doble)
        if (order.status === 'approved') {
          return res.status(200).send('La orden ya fue procesada previamente.');
        }

        // 3. Modificamos el estado de la orden a APROBADO en tu Panel de Admin
        const { error: updateOrderErr } = await supabaseAdmin
          .from('orders')
          .update({ status: 'approved' })
          .eq('id', orderId);

        if (updateOrderErr) throw updateOrderErr;

        // 4. Bajamos de forma automática el stock de cada producto comprado
        for (const item of order.items) {
          // Buscamos el producto en tu tabla por el nombre (title)
          const { data: product } = await supabaseAdmin
            .from('products')
            .select('stock')
            .eq('name', item.title)
            .single();

          if (product) {
            // Restamos la cantidad comprada asegurándonos de no irnos a números negativos
            const nuevoStock = Math.max(0, product.stock - item.quantity);

            // Actualizamos la tabla de stock real
            await supabaseAdmin
              .from('products')
              .update({ stock: nuevoStock })
              .eq('name', item.title);
          }
        }

        console.log(`🎉 ¡Éxito total! Orden ${orderId} actualizada y stock descontado.`);
      }
    }

    // ⚠️ CRÍTICO: Mercado Pago exige que le respondas un 200 OK rápido para saber que recibió el aviso
    return res.status(200).send('OK');

  } catch (error) {
    console.error('Error en el Webhook de Mercado Pago:', error);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;