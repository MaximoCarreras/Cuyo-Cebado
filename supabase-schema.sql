-- ============================================================
-- Mates Mendoza — Supabase Database Schema
-- Run this SQL in the Supabase SQL Editor to create all tables.
-- ============================================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PRODUCTS TABLE
-- Stores all products with stock management
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,              -- Price in ARS (whole numbers)
  category TEXT NOT NULL,               -- madera, calabaza, ceramica, kit, accesorio
  image_url TEXT,
  badge TEXT,                           -- NULL, 'Más vendido', 'Nuevo', etc.
  stock INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Anyone can read products, only service_role can modify
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Products are editable by service_role only"
  ON products FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- ORDERS TABLE
-- Tracks orders and their payment status
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mp_preference_id TEXT,
  mp_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  items JSONB NOT NULL,                   -- [{product_id, quantity, price, name}]
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  total INTEGER NOT NULL,                 -- Total in ARS
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Anyone can create orders (checkout flow)
CREATE POLICY "Orders can be created by anyone"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Only service_role can read/update orders
CREATE POLICY "Orders are managed by service_role"
  ON orders FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Only service_role can read subscribers
CREATE POLICY "Subscribers are managed by service_role"
  ON newsletter_subscribers FOR SELECT
  USING (auth.role() = 'service_role');

-- ============================================================
-- STOCK DECREMENT FUNCTION (atomic operation)
-- Called by webhook when payment is approved
-- ============================================================
CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = GREATEST(0, stock - quantity)
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SEED DATA — Sample products
-- ============================================================
INSERT INTO products (name, slug, description, price, category, image_url, badge, stock, is_featured)
VALUES
  (
    'Mate Lapacho Imperial',
    'mate-lapacho-imperial',
    'Tallado a mano en madera de lapacho. Acabado natural con aceite de tung.',
    45000,
    'madera',
    '/assets/product_1.png',
    'Más vendido',
    12,
    true
  ),
  (
    'Mate Calabaza Gaucho',
    'mate-calabaza-gaucho',
    'Calabaza curada con virola de alpaca y base de cuero repujado.',
    35000,
    'calabaza',
    '/assets/product_2.png',
    'Más vendido',
    8,
    true
  ),
  (
    'Mate Cerámica Tierra',
    'mate-ceramica-tierra',
    'Cerámica artesanal con esmalte en tonos tierra. Hecho a mano en Mendoza.',
    28000,
    'ceramica',
    '/assets/product_3.png',
    NULL,
    15,
    true
  ),
  (
    'Kit Regalo Premium',
    'kit-regalo-premium',
    'Mate lapacho + bombilla alpaca + yerba orgánica + caja de madera.',
    89000,
    'kit',
    '/assets/product_4.png',
    'Más vendido',
    5,
    true
  ),
  (
    'Bombilla Alpaca Clásica',
    'bombilla-alpaca-clasica',
    'Bombilla de alpaca con filtro desmontable. Largo estándar 19cm.',
    12000,
    'accesorio',
    '/assets/product_1.png',
    NULL,
    25,
    false
  ),
  (
    'Mate Quebracho Rústico',
    'mate-quebracho-rustico',
    'Madera de quebracho con vetas naturales. Pieza única e irrepetible.',
    52000,
    'madera',
    '/assets/product_2.png',
    'Nuevo',
    6,
    false
  );
