/**
 * Webhook Routes — Handles Mercado Pago IPN notifications.
 * POST /api/webhooks/mercadopago — Processes payment notifications.
 * 
 * On approved payment: updates order status + decrements product stock.
 * On rejected payment: updates order status to rejected. [SF][SFT]
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
    const status = paymentData.status; // approved, rejected, pending, etc.

    if (!orderId) {
      console.warn('Payment without external_reference:', paymentId);
      return;
    }

    /* Update order status in Supabase */
    const { error: updateErr } = await supabaseAdmin
      .from('orders')
      .update({
        status,
        mp_payment_id: String(paymentId),
      })
      .eq('id', orderId);

    if (updateErr) {
      console.error('Order update error:', updateErr.message);
      return;
    }

    /* If payment approved, decrement stock for each item [IV] */
    if (status === 'approved') {
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('items')
        .eq('id', orderId)
        .single();

      if (order?.items) {
        for (const item of order.items) {
          /* Use RPC or direct update to decrement stock atomically */
          const { error: stockErr } = await supabaseAdmin
            .rpc('decrement_stock', {
              product_id: item.product_id,
              quantity: item.quantity,
            });

          /* Fallback if RPC not available: direct decrement */
          if (stockErr) {
            const { data: product } = await supabaseAdmin
              .from('products')
              .select('stock')
              .eq('id', item.product_id)
              .single();

            if (product) {
              await supabaseAdmin
                .from('products')
                .update({ stock: Math.max(0, product.stock - item.quantity) })
                .eq('id', item.product_id);
            }
          }
        }
        console.log(`✅ Order ${orderId} approved. Stock decremented.`);
      }
    } else {
      console.log(`ℹ️ Order ${orderId} status: ${status}`);
    }

  } catch (err) {
    console.error('Webhook processing error:', err);
    /* Don't re-throw — we already sent 200 */
  }
});

export default router;
