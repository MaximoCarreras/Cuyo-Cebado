import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Recibimos el aviso de Mercado Pago
  const body = await req.json();
  const paymentId = body.data?.id;

  if (!paymentId) return new Response("No payment ID", { status: 400 });

  // Consultamos a Mercado Pago para confirmar que el pago es real
  const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { 'Authorization': `Bearer ${Deno.env.get('MP_ACCESS_TOKEN')}` }
  });
  const paymentData = await mpResponse.json();

  // Conectamos con tu base de datos
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Actualizamos el estado del pedido
  // IMPORTANTE: Asegurate que en tu tabla 'orders' tengas una columna 'payment_id'
  const { error } = await supabase
    .from('orders')
    .update({ status: paymentData.status === 'approved' ? 'approved' : 'pending' })
    .eq('payment_id', paymentId);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response("OK", { status: 200 });
})