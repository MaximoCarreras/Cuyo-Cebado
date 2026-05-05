/**
 * Mercado Pago Client — Server-side SDK initialization.
 * Uses ACCESS_TOKEN for creating preferences and verifying payments. [SFT]
 */
import { MercadoPagoConfig } from 'mercadopago';

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
  console.warn(
    '⚠️  MP_ACCESS_TOKEN not set. ' +
    'Checkout and payment verification will not work.'
  );
}

export const mpClient = accessToken
  ? new MercadoPagoConfig({ accessToken })
  : null;
