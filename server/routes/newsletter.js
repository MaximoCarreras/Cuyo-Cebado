/**
 * Newsletter Routes — Email subscription management with automatic email greeting.
 */
import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import nodemailer from 'nodemailer';

const router = Router();

// Configuración del transportador de correos seguro usando Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    /* Validate email format */
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (!supabaseAdmin) {
      console.log('Newsletter signup (no DB):', email);
      return res.json({ success: true, message: 'Subscribed (mock)' });
    }

    /* Upsert to handle duplicate emails gracefully */
    const { error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .upsert(
        { email, subscribed_at: new Date().toISOString() },
        { onConflict: 'email' }
      );

    if (error) throw error;

    // 📧 CORREO AUTOMÁTICO DE BIENVENIDA AL NEWSLETTER 📧
    const mailOptions = {
      from: `"Cuyo Cebado 🧉" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '¡Te damos la bienvenida a Cuyo Cebado! 🧉🔥',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 25px; border-radius: 16px;">
          <h2 style="color: #1a1614; text-align: center;">¡Ya sos parte del club, matero! 🪵</h2>
          <p style="font-size: 1rem; color: #475569; line-height: 1.6; text-align: center;">
            Gracias por sumarte a la comunidad de <strong>Cuyo Cebado</strong>. A partir de ahora vas a enterarte antes que nadie de los nuevos ingresos de mates Imperiales, camioneros, bombillas premium y ofertas exclusivas.
          </p>
          <div style="text-align: center; margin: 25px 0;">
            <span style="font-size: 3rem;">🧉</span>
          </div>
          <p style="font-size: 0.85rem; color: #64748b; text-align: center; margin-top: 30px;">
            Si querés ver nuestro catálogo actual, te esperamos en nuestra web.<br>
            <strong>Cuyo Cebado — Mendoza, Argentina</strong>
          </p>
        </div>
      `
    };

    // Enviamos el mail de bienvenida
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar mail de newsletter:', error);
      } else {
        console.log('📧 Mail de Newsletter enviado con éxito:', info.response);
      }
    });

    res.json({ success: true, message: 'Successfully subscribed' });

  } catch (err) {
    console.error('Newsletter error:', err.message);
    res.status(500).json({ error: 'Subscription failed' });
  }
});

export default router;