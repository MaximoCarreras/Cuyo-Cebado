/**
 * Mercado Pago Client — Cuyo Cebado
 * Inicialización oficial del SDK para el servidor.
 */
import { MercadoPagoConfig } from 'mercadopago';
import 'dotenv/config'; // <--- CRUCIAL: Carga el archivo .env antes de leer el Token

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
  console.error(
    '\n❌ ERROR CRÍTICO: MP_ACCESS_TOKEN no encontrado en el archivo .env\n' +
    'El checkout de Mercado Pago NO funcionará hasta que se configure.\n'
  );
} else {
  console.log('✅ Mercado Pago: SDK inicializado correctamente.');
}

// Exportamos el cliente configurado
export const mpClient = accessToken
  ? new MercadoPagoConfig({ accessToken })
  : null;