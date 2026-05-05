/**
 * Newsletter Routes — Email subscription management.
 * POST /api/newsletter — Subscribes email to newsletter (upsert). [SF]
 */
import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = Router();

/**
 * POST /api/newsletter
 * Body: { email }
 * Upserts email into newsletter_subscribers table.
 */
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    /* Validate email format [IV] */
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (!supabaseAdmin) {
      /* If Supabase not configured, just log and acknowledge */
      console.log('Newsletter signup (no DB):', email);
      return res.json({ success: true, message: 'Subscribed (mock)' });
    }

    /* Upsert to handle duplicate emails gracefully [REH] */
    const { error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .upsert(
        { email, subscribed_at: new Date().toISOString() },
        { onConflict: 'email' }
      );

    if (error) throw error;

    res.json({ success: true, message: 'Successfully subscribed' });

  } catch (err) {
    console.error('Newsletter error:', err.message);
    res.status(500).json({ error: 'Subscription failed' });
  }
});

export default router;
