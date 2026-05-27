import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const body = await req.json();
  const paymentId = body.data?.id;
  if (!paymentId) return new Response("No payment ID", { status: 400 });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 1. Obtener datos del pago de MP
  const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { 'Authorization': `Bearer ${Deno.env.get('MP_ACCESS_TOKEN')}` }
  });
  const paymentData = await mpResponse.json();

  if (paymentData.status === 'approved') {
    // 2. Actualizar estado del pedido
    const { data: order } = await supabase
        .from('orders')
        .update({ status: 'approved' })
        .eq('payment_id', paymentId)
        .select('id');

    // 3. DESCONTAR STOCK: Buscar los productos de esa orden
    const { data: items } = await supabase.from('order_items').select('product_id, quantity').eq('order_id', order[0].id);

    for (const item of items) {
        // Restar stock
        await supabase.rpc('decrement_stock', { p_product_id: item.product_id, p_quantity: item.quantity });
    }
  }

  return new Response("OK", { status: 200 });
})