import { Router } from 'express';
import { Payment } from 'mercadopago';
import nodemailer from 'nodemailer';
import { supabaseAdmin } from '../lib/supabase.js';
import { mpClient } from '../lib/mercadopago.js';

const router = Router();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', async (req, res) => {
  try {
    const { query } = req;
    const topic = query.type || query.topic;

    if (topic === 'payment') {
      const paymentId = query['data.id'] || query.id;

      if (!paymentId) {
        return res.status(400).send('ID de pago no encontrado');
      }

      const payment = new Payment(mpClient);
      const paymentData = await payment.get({ id: paymentId });

      if (paymentData.status === 'approved') {
        const orderId = paymentData.external_reference;

        // 🔥 1. ACTUALIZACIÓN ATÓMICA: Evita procesar webhooks duplicados
        // Solo actualizamos a 'paid' si actualmente NO está en 'paid'
        const { data: order, error: updateErr } = await supabaseAdmin
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', orderId)
          .neq('status', 'paid')
          .select()
          .maybeSingle(); // maybeSingle devuelve null si ninguna fila cumplió la condición

        if (updateErr) {
          console.error('❌ Error al actualizar la orden en Supabase:', updateErr);
          return res.status(500).send('Error interno de base de datos');
        }

        // Si 'order' es null, significa que otra petición simultánea ya la había actualizado
        if (!order) {
          console.log(`⚠️ Webhook duplicado ignorado. La orden ${orderId} ya estaba procesada.`);
          return res.status(200).send('La orden ya fue procesada.');
        }

        console.log(`✅ Orden ${orderId} asegurada y marcada como 'paid'. Procesando stock y puntos...`);

        // 2. 📦 DESCUENTO DE STOCK (Ahora es imposible que se corra dos veces)
        if (order.items && Array.isArray(order.items)) {
          for (const item of order.items) {
            const nombreProducto = item.name || item.title;
            
            let queryBuilder = supabaseAdmin.from('products').select('id, name, stock');
            
            if (item.id) {
              queryBuilder = queryBuilder.eq('id', item.id);
            } else if (nombreProducto) {
              queryBuilder = queryBuilder.eq('name', nombreProducto);
            } else {
              continue;
            }

            const { data: product } = await queryBuilder.maybeSingle();

            if (product) {
              const cantidadRestar = Number(item.quantity) || 1;
              const nuevoStock = Math.max(0, product.stock - cantidadRestar);
              
              await supabaseAdmin.from('products').update({ stock: nuevoStock }).eq('id', product.id);
              console.log(`📦 STOCK ACTUALIZADO: ${product.name}. Anterior: ${product.stock} -> Nuevo: ${nuevoStock}`);
            }
          }
        }

        // 3. ✨ ACREDITACIÓN DE PUNTOS
        if (order.user_id) {
            const { data: profile } = await supabaseAdmin.from('profiles').select('puntos').eq('id', order.user_id).single();
            
            if (profile) {
                const puntosActuales = profile.puntos || 0;
                const puntosGanados = Number(order.puntos_ganados) || 0;
                const puntosGastados = Number(order.puntos_descontados) || 0;
                
                const nuevoSaldo = (puntosActuales - puntosGastados) + puntosGanados;
                
                await supabaseAdmin.from('profiles').update({ puntos: nuevoSaldo }).eq('id', order.user_id);
                console.log(`💳 Puntos actualizados. Nuevo saldo: ${nuevoSaldo}`);
            }
        }

        // 4. 📧 DISPARADOR DE CORREO (Sujeto a restricciones gratuitas de Render)
        const mailOptions = {
          from: `"Cuyo Cebado 🧉" <${process.env.EMAIL_USER}>`,
          to: order.customer_email,
          subject: '¡Tu pago fue aprobado! Ya podés retirar tu pedido 🛍️',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 25px; border-radius: 16px;">
              <h2 style="color: #1a1614; text-align: center;">¡Muchas gracias por tu compra, ${order.customer_name}! 🙌</h2>
              <p style="font-size: 1rem; color: #475569; line-height: 1.6;">
                Te confirmamos que recibimos tu pago correctamente por el total de <strong>$${order.total.toLocaleString('es-AR')}</strong>.
              </p>
            </div>
          `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('❌ Bloqueo SMTP de Render o error de credenciales detectado.');
          } else {
            console.log('📧 Correo enviado con éxito al cliente:', info.response);
          }
        });

        console.log(`🎉 ¡Éxito completo! Orden ${orderId} finalizada de forma segura.`);
      }
    }

    return res.status(200).send('OK');

  } catch (error) {
    console.error('Error crítico en el Webhook:', error);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;