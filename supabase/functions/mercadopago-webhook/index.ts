import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
      console.log("🔔 [WEBHOOK] ¡Petición recibida de Mercado Pago!");
      
      const url = new URL(req.url);
      const queryId = url.searchParams.get("data.id") || url.searchParams.get("id");
      const type = url.searchParams.get("type") || url.searchParams.get("topic");
      
      let paymentId = queryId;
      let eventType = type;

      if (req.body && (!paymentId || !eventType)) {
          const bodyText = await req.text();
          console.log("📦 [WEBHOOK] Cuerpo crudo:", bodyText);
          if (bodyText) {
              const body = JSON.parse(bodyText);
              paymentId = paymentId || body?.data?.id || body?.id;
              eventType = eventType || body?.type || body?.topic;
          }
      }

      console.log(`🔑 [WEBHOOK] Evento: ${eventType} | ID: ${paymentId}`);

      // ESCUDO ANTI-404: Si no es un pago, lo ignoramos y le decimos "Todo OK" a MP
      if (eventType && eventType !== 'payment') {
          console.log(`⚠️ [WEBHOOK] Ignorando evento de tipo: ${eventType}. Solo leemos 'payment'.`);
          return new Response("Ignored non-payment event", { status: 200 });
      }

      if (!paymentId) {
          console.log("❌ [WEBHOOK] Error: No se encontró ID.");
          return new Response("No payment ID", { status: 400 });
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      console.log("🌐 [WEBHOOK] Consultando a MP el estado del pago...");
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${Deno.env.get('MP_ACCESS_TOKEN')}` }
      });

      if (!mpResponse.ok) {
          console.log(`❌ [WEBHOOK] MP rechazó la consulta. HTTP: ${mpResponse.status} (Probable Token incorrecto)`);
          return new Response("Error MP", { status: 400 });
      }

      const paymentData = await mpResponse.json();
      const orderId = paymentData.external_reference;
      
      console.log(`✅ [WEBHOOK] Estado de MP: ${paymentData.status} | Order ID: ${orderId}`);

      if (paymentData.status === 'approved' && orderId) {
        console.log(`🚀 [WEBHOOK] Aprobando pedido ${orderId} en base de datos...`);

        await supabase.from('orders').update({ status: 'approved' }).eq('id', orderId);

        const { data: items } = await supabase.from('order_items').select('product_id, quantity').eq('order_id', orderId);

        if (items && items.length > 0) {
            for (const item of items) {
                console.log(`⚙️ [WEBHOOK] Descontando ${item.quantity} de stock para ${item.product_id}`);
                await supabase.rpc('decrement_stock', { p_product_id: item.product_id, p_quantity: item.quantity });
            }
            console.log("✅ [WEBHOOK] Stock actualizado correctamente.");
        }
      }

      return new Response("OK", { status: 200 });

  } catch (error) {
      console.log("💥 [WEBHOOK] ERROR CRÍTICO FATAL:", error);
      return new Response("Internal Error", { status: 500 });
  }
})