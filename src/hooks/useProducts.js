/**
 * useProducts — Hook for fetching products from Supabase.
 * Falls back to local mock data when Supabase is not configured. [REH]
 * Supports filtering by category.
 */
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/* Import product images for fallback data [CMV] */
import product1 from '../assets/product_1.png';
import product2 from '../assets/product_2.png';
import product3 from '../assets/product_3.png';
import product4 from '../assets/product_4.png';

/* Fallback products for development without Supabase */
const FALLBACK_PRODUCTS = [
  {
    id: '1',
    name: 'Mate Lapacho Imperial',
    slug: 'mate-lapacho-imperial',
    description: 'Tallado a mano en madera de lapacho. Acabado natural con aceite de tung.',
    price: 45000,
    category: 'madera',
    image_url: product1,
    badge: 'Más vendido',
    stock: 12,
    is_featured: true,
  },
  {
    id: '2',
    name: 'Mate Calabaza Gaucho',
    slug: 'mate-calabaza-gaucho',
    description: 'Calabaza curada con virola de alpaca y base de cuero repujado.',
    price: 35000,
    category: 'calabaza',
    image_url: product2,
    badge: 'Más vendido',
    stock: 8,
    is_featured: true,
  },
  {
    id: '3',
    name: 'Mate Cerámica Tierra',
    slug: 'mate-ceramica-tierra',
    description: 'Cerámica artesanal con esmalte en tonos tierra. Hecho a mano en Mendoza.',
    price: 28000,
    category: 'ceramica',
    image_url: product3,
    badge: null,
    stock: 15,
    is_featured: true,
  },
  {
    id: '4',
    name: 'Kit Regalo Premium',
    slug: 'kit-regalo-premium',
    description: 'Mate lapacho + bombilla alpaca + yerba orgánica + caja de madera.',
    price: 89000,
    category: 'kit',
    image_url: product4,
    badge: 'Más vendido',
    stock: 5,
    is_featured: true,
  },
];

export function useProducts(category = null) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);

      /* Try Supabase first, fall back to local data */
      if (supabase) {
        try {
          let query = supabase.from('products').select('*');

          if (category) {
            query = query.eq('category', category);
          }

          const { data, error: fetchError } = await query.order('created_at', { ascending: false });

          if (fetchError) throw fetchError;
          setProducts(data || []);
        } catch (err) {
          console.warn('Supabase fetch failed, using fallback data:', err.message);
          setProducts(filterByCategory(FALLBACK_PRODUCTS, category));
        }
      } else {
        /* No Supabase configured — use fallback */
        setProducts(filterByCategory(FALLBACK_PRODUCTS, category));
      }

      setLoading(false);
    }

    fetchProducts();
  }, [category]);

  return { products, loading, error };
}

/* Helper to filter fallback products by category */
function filterByCategory(products, category) {
  if (!category) return products;
  return products.filter(p => p.category === category);
}

/**
 * Fetches only featured products for the "Más vendidos" section.
 */
export function useFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true);

      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
            .limit(4);

          if (error) throw error;
          setProducts(data || []);
        } catch (err) {
          console.warn('Supabase featured fetch failed:', err.message);
          setProducts(FALLBACK_PRODUCTS.filter(p => p.is_featured));
        }
      } else {
        setProducts(FALLBACK_PRODUCTS.filter(p => p.is_featured));
      }

      setLoading(false);
    }

    fetchFeatured();
  }, []);

  return { products, loading };
}
