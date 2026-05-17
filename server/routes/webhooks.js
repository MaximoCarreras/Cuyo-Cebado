/**
 * Webhook Routes — Handles Mercado Pago IPN notifications.
 * POST /api/webhooks/mercadopago — Processes payment notifications.
 */
import { Router } from 'express';
import { Payment } from 'mercadopago';
import { supabaseAdmin } from '../lib/supabase.js';
import { mpClient } from '../lib/mercadopago.js';

const router = Router();

/**
 * POST /api/webhooks/mercadopago
 * Mercado Pago sends IPN notifications here when payment status changes.
 */
router.post('/mercadopago', async (req, res) => {
  try {
    /* Acknowledge receipt immediately to avoid MP retries [RM] */
    res.status(200).send('OK');

    if (!supabaseAdmin || !mpClient) {
      console.warn('Webhook received but services not configured');
      return;
    }

    const { type, data } = req.body;

    /* Only process payment notifications */
    if (type !== 'payment') return;

    const paymentId = data?.id;
    if (!paymentId) return;

    /* Fetch payment details from Mercado Pago API */
    const payment = new Payment(mpClient);
    const paymentData = await payment.get({ id: paymentId });

    const orderId = paymentData.external_reference;
    const mpStatus = paymentData.status; // approved, rejected, pending, etc.

    if (!orderId) {
      console.warn('Payment without external_reference:', paymentId);
      return;
    }

    // 💥 SINCRONIZACIÓN DE COLOR: Mapeamos los estados oficiales para tu AdminDashboard 💥
    let finalStatus = 'pending';
    if (mpStatus === 'approved') finalStatus = 'paid';
    if (mpStatus === 'rejected' || mpStatus === 'cancelled') finalStatus = 'cancelled';

    /* Update order status in Supabase */
    const { error: updateErr } = await supabaseAdmin
      .from('orders')
      .update({
        status: finalStatus,
        mp_payment_id: String(paymentId),
      })
      .eq('id', orderId);

    if (updateErr) {
      console.error('Order update error:', updateErr.message);
      return;
    }

    /* If payment approved, decrement stock for each item [IV] */
    if (mpStatus === 'approved') {
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('items')
        .eq('id', orderId)
        .single();

      if (order?.items) {
        for (const item of order.items) {

          // 🚚 BLINDAJE DE STOCK: Si no viene product_id, lo buscamos por su nombre/title
          let targetProductId = item.product_id;

          if (!targetProductId && item.title) {
            const { data: prod } = await supabaseAdmin
              .from('products')
              .select('id')
              .eq('name', item.title)
              .single();
            if (prod) targetProductId = prod.id;
          }

          // Si logramos resolver el ID del mate, procedemos a bajar el stock
          if (targetProductId) {
            /* Use RPC or direct update to decrement stock atomically */
            const { error: stockErr } = await supabaseAdmin
              .rpc('decrement_stock', {
                product_id: targetProductId,
                quantity: Number(item.quantity),
              });

            /* Fallback if RPC not available: direct decrement */
            if (stockErr) {
              const { data: product } = await supabaseAdmin
                .from('products')
                .select('stock')
                .eq('id', targetProductId)
                .single();

              if (product) {
                await supabaseAdmin
                  .from('products')
                  .update({ stock: Math.max(0, product.stock - Number(item.quantity)) })
                  .eq('id', targetProductId);
              }
            }
          }
        }
        console.log(`✅ Order ${orderId} successfully marked as PAID. Stock updated in storage.`);
      }
    } else {
      console.log(`ℹ️ Order ${orderId} synced with MP status: ${mpStatus} -> Dashboard: ${finalStatus}`);
    }

  } catch (err) {
    console.error('Webhook processing error:', err);
    /* Don't re-throw — we already sent 200 */
  }
});

export default router;