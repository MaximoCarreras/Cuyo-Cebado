import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = Router();

/**
 * GET /api/products
 * Trae todos los productos de Supabase ordenados por los más nuevos.
 */
router.get('/', async (req, res) => {
  try {
    if (!supabaseAdmin) {
      return res.status(503).json({ error: 'Servidor: Supabase no está configurado.' });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Error al obtener productos:', err.message);
    res.status(500).json({ error: 'No se pudieron cargar los productos.' });
  }
});

export default router;