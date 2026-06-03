import { Router } from 'express';
import { Payment } from 'mercadopago';
import nodemailer from 'nodemailer';
import { supabaseAdmin } from '../lib/supabase.js';
import { mpClient } from '../lib/mercadopago.js';

const router = Router();

// Configuración explícita para evitar errores de conexión IPv6 en Render
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

        const { data: order, error: orderErr } = await supabaseAdmin
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderErr || !order) {
          console.error('❌ Orden no encontrada en Supabase:', orderErr);
          return res.status(404).send('Orden no encontrada');
        }

        // Evita duplicar el proceso si Mercado Pago reenvía la notificación
        if (order.status === 'paid') {
          return res.status(200).send('La orden ya fue procesada.');
        }

        // 1. Actualizamos el estado a pagado en la base de datos
        await supabaseAdmin.from('orders').update({ status: 'paid' }).eq('id', orderId);
        console.log(`✅ Estado de la orden ${orderId} actualizado a 'paid'.`);

        // 2. 📦 DESCUENTO DE STOCK ULTRA-ROBUSTO
        if (order.items && Array.isArray(order.items)) {
          console.log("🔍 Analizando ítems de la orden para descontar stock:", order.items);

          for (const item of order.items) {
            console.log("🔍 Datos del ítem actual:", item);
            const nombreProducto = item.name || item.title;
            
            let queryBuilder = supabaseAdmin.from('products').select('id, name, stock');
            
            // Bala de plata: Si el ítem tiene ID, buscamos por ID. Si no, usamos el nombre.
            if (item.id) {
              queryBuilder = queryBuilder.eq('id', item.id);
            } else if (nombreProducto) {
              queryBuilder = queryBuilder.eq('name', nombreProducto);
            } else {
              console.error("⚠️ El ítem no contiene ni ID ni un nombre válido para buscarlo.");
              continue;
            }

            const { data: product, error: prodErr } = await queryBuilder.maybeSingle();

            if (prodErr) {
              console.error("❌ Error al consultar el producto en Supabase:", prodErr);
              continue;
            }

            if (product) {
              const cantidadRestar = Number(item.quantity) || 1;
              const nuevoStock = Math.max(0, product.stock - cantidadRestar);
              
              const { error: updateErr } = await supabaseAdmin
                .from('products')
                .update({ stock: nuevoStock })
                .eq('id', product.id);

              if (updateErr) {
                console.error(`❌ Error al actualizar el stock de ${product.name}:`, updateErr);
              } else {
                console.log(`📦 STOCK ACTUALIZADO: ${product.name} (ID: ${product.id}). Stock anterior: ${product.stock} -> Nuevo stock: ${nuevoStock}`);
              }
            } else {
              console.error(`❌ No se encontró el producto en la tabla 'products'. Buscado por ID: '${item.id}' o Nombre: '${nombreProducto}'`);
            }
          }
        }

        // 3. Acreditación de Puntos
        if (order.user_id) {
            const { data: profile } = await supabaseAdmin.from('profiles').select('puntos').eq('id', order.user_id).single();
            
            if (profile) {
                const puntosActuales = profile.puntos || 0;
                const puntosGanados = Number(order.puntos_ganados) || 0;
                const puntosGastados = Number(order.puntos_descontados) || 0;
                
                const nuevoSaldo = (puntosActuales - puntosGastados) + puntosGanados;
                
                await supabaseAdmin.from('profiles').update({ puntos: nuevoSaldo }).eq('id', order.user_id);
                console.log(`💳 Cuyo Puntos actualizados. Nuevo saldo del cliente: ${nuevoSaldo} (Ganados: ${puntosGanados}, Gastados: ${puntosGastados})`);
            }
        }

        // 4. Envío Automático del Correo de Confirmación
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
            console.error('❌ Error al enviar el correo de agradecimiento:', error);
          } else {
            console.log('📧 Correo enviado con éxito al cliente:', info.response);
          }
        });

        console.log(`🎉 ¡Procesamiento de orden ${orderId} finalizado por completo!`);
      }
    }

    return res.status(200).send('OK');

  } catch (error) {
    console.error('❌ Error crítico en el Webhook principal:', error);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;