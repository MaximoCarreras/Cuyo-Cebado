/**
 * Products Routes — CRUD operations for products via Supabase.
 * GET /api/products — list all, with optional category filter.
 * GET /api/products/:slug — get single product by slug. [SF]
 */
import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = Router();

/**
 * GET /api/products
 * Query params: category (optional), featured (optional boolean)
 * Returns array of products from Supabase.
 */
router.get('/', async (req, res) => {
  try {
    if (!supabaseAdmin) {
      return res.status(503).json({ error: 'Supabase not configured' });
    }

    let query = supabaseAdmin.from('products').select('*');

    /* Filter by category if provided [IV] */
    const { category, featured } = req.query;
    if (category) {
      query = query.eq('category', category);
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Products fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/products/:slug
 * Returns single product with current stock level.
 */
router.get('/:slug', async (req, res) => {
  try {
    if (!supabaseAdmin) {
      return res.status(503).json({ error: 'Supabase not configured' });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('slug', req.params.slug)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Product not found' });

    res.json(data);
  } catch (err) {
    console.error('Product fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
