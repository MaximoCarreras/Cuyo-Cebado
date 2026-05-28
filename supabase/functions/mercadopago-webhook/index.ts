import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
      console.log("🔔 [WEBHOOK] ¡Petición recibida de Mercado Pago!");
      
      // 1. Buscamos el ID del pago. MP a veces lo manda en la URL y a veces en el Body
      const url = new URL(req.url);
      const queryId = url.searchParams.get("data.id") || url.searchParams.get("id");
      let paymentId = queryId;

      if (!paymentId && req.body) {
          const bodyText = await req.text(); // Leemos como texto para que no crashee
          console.log("📦 [WEBHOOK] Cuerpo crudo recibido:", bodyText);
          if (bodyText) {
              const body = JSON.parse(bodyText);
              paymentId = body?.data?.id || body?.id;
          }
      }

      console.log("🔑 [WEBHOOK] ID del pago encontrado:", paymentId);

      if (!paymentId) {
          console.log("❌ [WEBHOOK] Error: No se encontró ID en la petición.");
          return new Response("No payment ID", { status: 400 });
      }

      // 2. Conectamos con Supabase
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      console.log("🌐 [WEBHOOK] Consultando a MP el estado del pago...");
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${Deno.env.get('MP_ACCESS_TOKEN')}` }
      });

      if (!mpResponse.ok) {
          console.log("❌ [WEBHOOK] MP rechazó la consulta. HTTP:", mpResponse.status);
          return new Response("Error MP", { status: 400 });
      }

      const paymentData = await mpResponse.json();
      const orderId = paymentData.external_reference;
      
      console.log(`✅ [WEBHOOK] Estado de MP: ${paymentData.status} | Order ID: ${orderId}`);

      // 3. Procesamos la orden si está aprobada
      if (paymentData.status === 'approved' && orderId) {
        console.log(`🚀 [WEBHOOK] Aprobando pedido ${orderId} en base de datos...`);

        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: 'approved' })
            .eq('id', orderId);

        if (updateError) console.log("❌ [WEBHOOK] Error al actualizar estado:", updateError);

        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('product_id, quantity')
            .eq('order_id', orderId);

        if (itemsError) console.log("❌ [WEBHOOK] Error al buscar items:", itemsError);

        if (items && items.length > 0) {
            for (const item of items) {
                console.log(`⚙️ [WEBHOOK] Descontando ${item.quantity} de stock para ${item.product_id}`);
                const { error: rpcError } = await supabase.rpc('decrement_stock', { 
                    p_product_id: item.product_id, 
                    p_quantity: item.quantity 
                });
                if (rpcError) console.log("❌ [WEBHOOK] Error descontando stock:", rpcError);
            }
            console.log("✅ [WEBHOOK] Stock actualizado correctamente.");
        }
      } else {
          console.log(`⚠️ [WEBHOOK] Ignorado. Estado: ${paymentData.status}, OrderId: ${orderId}`);
      }

      return new Response("OK", { status: 200 });

  } catch (error) {
      console.log("💥 [WEBHOOK] ERROR CRÍTICO FATAL:", error);
      return new Response("Internal Error", { status: 500 });
  }
})