import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
      console.log("🔔 [WEBHOOK] ¡Petición recibida!");
      
      const url = new URL(req.url);
      const queryId = url.searchParams.get("data.id") || url.searchParams.get("id");
      const type = url.searchParams.get("type") || url.searchParams.get("topic");
      
      let paymentId = queryId;
      let eventType = type;

      if (req.body && (!paymentId || !eventType)) {
          const bodyText = await req.text();
          if (bodyText) {
              const body = JSON.parse(bodyText);
              paymentId = paymentId || body?.data?.id || body?.id;
              eventType = eventType || body?.type || body?.topic;
          }
      }

      if (eventType && eventType !== 'payment') {
          return new Response("Ignored non-payment event", { status: 200 });
      }

      if (!paymentId) {
          return new Response("No payment ID", { status: 400 });
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${Deno.env.get('MP_ACCESS_TOKEN')}` }
      });

      if (!mpResponse.ok) return new Response("Error MP", { status: 400 });

      const paymentData = await mpResponse.json();
      const orderId = paymentData.external_reference;

      if (paymentData.status === 'approved' && orderId) {
        
        // 1. Aprobamos la orden
        await supabase.from('orders').update({ status: 'approved' }).eq('id', orderId);

        // 2. Traemos la orden para leer la columna 'items' (que es un JSON)
        const { data: orderData } = await supabase.from('orders').select('items').eq('id', orderId).single();

        if (orderData && orderData.items) {
            let cartItems = [];
            // Si Supabase lo guardó como texto, lo convertimos a array. Si ya es array, lo usamos.
            if (typeof orderData.items === 'string') {
                try { cartItems = JSON.parse(orderData.items); } catch(e) {}
            } else {
                cartItems = orderData.items;
            }

            // 3. Recorremos el carrito y descontamos el stock
            for (const item of cartItems) {
                // item.id es el ID del producto, item.quantity es la cantidad comprada
                if (item.id && item.quantity) {
                    await supabase.rpc('decrement_stock', { p_product_id: item.id, p_quantity: item.quantity });
                }
            }
        }
      }

      return new Response("OK", { status: 200 });

  } catch (error) {
      console.log("💥 ERROR CRÍTICO:", error);
      return new Response("Internal Error", { status: 500 });
  }
})