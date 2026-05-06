/**
 * useProducts — Hook para obtener productos de Cuyo Cebado.
 * Importación directa desde assets para máxima compatibilidad.
 */
import { useState, useEffect } from 'react';

// Importamos las imágenes desde assets para que Vite las reconozca
import product1 from '../assets/product_1.png';
import product2 from '../assets/product_2.png';
import product3 from '../assets/product_3.png';
import product4 from '../assets/product_4.png';

const FALLBACK_PRODUCTS = [
  {
    id: '1',
    name: 'Mate Lapacho Imperial',
    description: 'Tallado a mano en madera de lapacho. Acabado natural con aceite de tung.',
    price: 45000,
    category: 'madera',
    image_url: product1, // Usamos la variable importada
    badge: 'Más vendido',
    stock: 12,
    is_featured: true,
  },
  {
    id: '2',
    name: 'Mate Calabaza Gaucho',
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
    description: 'Mate lapacho + bombilla alpaca + yerba orgánica + caja de madera.',
    price: 89000,
    category: 'kit',
    image_url: product4,
    badge: 'Más vendido',
    stock: 5,
    is_featured: true,
  },
];

export function useFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usamos los datos locales directamente
    setProducts(FALLBACK_PRODUCTS.filter(p => p.is_featured));
    setLoading(false);
  }, []);

  return { products, loading };
}

export function useProducts(category = null) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filtered = category
      ? FALLBACK_PRODUCTS.filter(p => p.category === category)
      : FALLBACK_PRODUCTS;
    setProducts(filtered);
    setLoading(false);
  }, [category]);

  return { products, loading };
}