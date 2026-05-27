import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // 1. Recibimos la notificación de Mercado Pago
  const body = await req.json();
  const paymentId = body.data?.id;
  
  if (!paymentId) return new Response("No payment ID", { status: 400 });

  // 2. Conectamos con Supabase
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 3. Consultamos a Mercado Pago para ver el estado real y los datos del pago
  const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { 'Authorization': `Bearer ${Deno.env.get('MP_ACCESS_TOKEN')}` }
  });
  const paymentData = await mpResponse.json();

  // ¡CLAVE! Recuperamos el ID de la orden que mandamos desde tu checkout.js
  const orderId = paymentData.external_reference;

  // 4. Si el pago está aprobado y tenemos el ID de la orden
  if (paymentData.status === 'approved' && orderId) {
    
    // Marcar la orden como aprobada buscando por su ID real
    await supabase
        .from('orders')
        .update({ status: 'approved' })
        .eq('id', orderId);

    // 5. DESCONTAR STOCK: Buscar los productos de esa orden específica
    const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', orderId);

    if (items && !itemsError) {
        for (const item of items) {
            // Restar stock usando tu función de base de datos
            await supabase.rpc('decrement_stock', { 
                p_product_id: item.product_id, 
                p_quantity: item.quantity 
            });
        }
    }
  }

  return new Response("OK", { status: 200 });
})