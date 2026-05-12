import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    if (!supabaseAdmin) {
      return res.status(503).json({ error: 'Servidor: Supabase no configurado.' });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

export default router;