import { useState, useEffect } from 'react';

const FALLBACK_PRODUCTS = [
  {
    id: '1',
    name: 'Mate Lapacho Imperial',
    description: 'Tallado a mano en madera de lapacho. Acabado natural con aceite de tung.',
    price: 45000,
    category: 'madera',
    image_url: '/images/product_1.png',
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
    image_url: '/images/product_2.png',
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
    image_url: '/images/product_3.png',
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
    image_url: '/images/product_4.png',
    badge: 'Más vendido',
    stock: 5,
    is_featured: true,
  },
];

export function useFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Forzamos el uso de los datos locales que tienen las rutas correctas
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