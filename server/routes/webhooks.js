import { Router } from 'express';
import { Payment } from 'mercadopago';
import nodemailer from 'nodemailer';
import { supabaseAdmin } from '../lib/supabase.js';
import { mpClient } from '../lib/mercadopago.js';

const router = Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
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

        const { data: order, error: orderErr } = await supabaseAdmin
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderErr || !order) {
          console.error('Orden no encontrada en Supabase:', orderErr);
          return res.status(404).send('Orden no encontrada');
        }

        // Evita duplicar el proceso si MP reenvía la notificación
        if (order.status === 'paid') {
          return res.status(200).send('La orden ya fue procesada.');
        }

        // 1. Actualizamos el estado a pagado en el Panel de Admin
        await supabaseAdmin.from('orders').update({ status: 'paid' }).eq('id', orderId);

        // 2. Descontamos el Stock de Supabase
        for (const item of order.items) {
          const { data: product } = await supabaseAdmin
            .from('products')
            .select('stock')
            .eq('name', item.title)
            .single();

          if (product) {
            const nuevoStock = Math.max(0, product.stock - item.quantity);
            await supabaseAdmin.from('products').update({ stock: nuevoStock }).eq('name', item.title);
          }
        }

        // 3. ✨ SISTEMA DE PUNTOS: Acreditación Automática ✨
        if (order.user_id) {
            const { data: profile } = await supabaseAdmin.from('profiles').select('puntos').eq('id', order.user_id).single();
            
            if (profile) {
                const puntosActuales = profile.puntos || 0;
                const puntosGanados = order.puntos_ganados || 0;
                const puntosGastados = order.puntos_descontados || 0;
                
                // Restamos los usados y sumamos los nuevos
                const nuevoSaldo = (puntosActuales - puntosGastados) + puntosGanados;
                
                await supabaseAdmin.from('profiles').update({ puntos: nuevoSaldo }).eq('id', order.user_id);
                console.log(`💳 Puntos actualizados. Nuevo saldo del cliente: ${nuevoSaldo}`);
            }
        }

        // 4. 📧 DISPARADOR AUTOMÁTICO DE CORREO AL CLIENTE 📧
        const mailOptions = {
          from: `"Cuyo Cebado 🧉" <${process.env.EMAIL_USER}>`,
          to: order.customer_email,
          subject: '¡Tu pago fue aprobado! Ya podés retirar tu pedido 🛍️',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 25px; border-radius: 16px;">
              <h2 style="color: #1a1614; text-align: center;">¡Muchas gracias por tu compra, ${order.customer_name}! 🙌</h2>
              <p style="font-size: 1rem; color: #475569; line-height: 1.6;">
                Te confirmamos que recibimos tu pago correctamente por el total de <strong>$${order.total.toLocaleString('es-AR')}</strong>. Tu pedido ya está registrado y listo para ser preparado.
              </p>
              
              <div style="background-color: #f8fafc; border: 1.5px solid #ebd432; padding: 15px; border-radius: 12px; margin: 20px 0;">
                <h4 style="margin: 0 0 8px 0; color: #1a1614;">🏡 Punto de Retiro Oficial:</h4>
                <p style="margin: 0; font-size: 0.9rem; color: #334155;"><strong>Local:</strong> Código Vinario</p>
                <p style="margin: 4px 0 0 0; font-size: 0.9rem; color: #334155;">📍 Av. Colón 701, Mendoza Capital</p>
                <p style="margin: 4px 0 0 0; font-size: 0.9rem; color: #334155;">⏰ Lun a Sáb: 10:00 a 22:00 hs</p>
              </div>

              <p style="font-size: 0.85rem; color: #64748b; text-align: center; margin-top: 30px;">
                Cualquier consulta nos podés escribir directamente por WhatsApp. ¡Que disfrutes de tus mates! 🧉<br>
                <strong>Cuyo Cebado</strong>
              </p>
            </div>
          `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error al enviar el correo de agradecimiento:', error);
          } else {
            console.log('📧 Correo enviado con éxito al cliente:', info.response);
          }
        });

        console.log(`🎉 ¡Éxito completo! Orden ${orderId} pagada, stock descontado, puntos actualizados y mail enviado.`);
      }
    }

    return res.status(200).send('OK');

  } catch (error) {
    console.error('Error en el Webhook principal:', error);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;