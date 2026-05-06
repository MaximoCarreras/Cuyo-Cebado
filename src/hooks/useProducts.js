/**
 * useProducts — Hook para obtener productos de Cuyo Cebado.
 * IDs actualizados con UUID de Supabase para compatibilidad con el checkout.
 */
import { useState, useEffect } from 'react';

// Importamos las imágenes desde assets
import product1 from '../assets/product_1.png';
import product2 from '../assets/product_2.png';
import product3 from '../assets/product_3.png';
import product4 from '../assets/product_4.png';
// Nota: Si tenés imágenes para los nuevos productos, importalas aquí.

const FALLBACK_PRODUCTS = [
  {
    id: '939a1f06-6e48-47e1-a5a1-4cc4e74eafe8',
    name: 'Mate Lapacho Imperial',
    description: 'Tallado a mano en madera de lapacho. Acabado natural con aceite de tung.',
    price: 45000,
    category: 'madera',
    image_url: product1,
    badge: 'Más vendido',
    stock: 12,
    is_featured: true,
  },
  {
    id: 'fe6bfa0f-a835-4a6a-864d-0048906238a9',
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
    id: '977e492d-990e-4934-8227-6ae0a8203ef5',
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
    id: '6acf35f1-8a23-4717-971e-5fe657c5ed35',
    name: 'Kit Regalo Premium',
    description: 'Mate lapacho + bombilla alpaca + yerba orgánica + caja de madera.',
    price: 89000,
    category: 'kit',
    image_url: product4,
    badge: 'Más vendido',
    stock: 5,
    is_featured: true,
  },
  {
    id: '4668527e-d5b2-4302-9985-b55d87dc5f80',
    name: 'Mate Quebracho Rústico',
    description: 'Madera de quebracho ultra resistente con detalles en plata y alpaca.',
    price: 42000,
    category: 'madera',
    image_url: product1, // Reemplazar por la imagen correcta si la tenés
    badge: 'Nuevo',
    stock: 10,
    is_featured: false,
  },
  {
    id: '9852b131-00e1-4b09-8ab1-ed94984568b2',
    name: 'Bombilla Alpaca Clásica',
    description: 'Bombilla de alpaca con filtro de resorte, desarmable para limpieza fácil.',
    price: 12000,
    category: 'accesorios',
    image_url: product2, // Reemplazar por la imagen correcta si la tenés
    badge: null,
    stock: 30,
    is_featured: false,
  }
];

export function useFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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