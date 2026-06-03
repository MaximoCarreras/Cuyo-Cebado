/**
 * Express Server — Cuyo Cebado API
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products.js';
import checkoutRouter from './routes/checkout.js';
import webhooksRouter from './routes/webhooks.js';
import newsletterRouter from './routes/newsletter.js';
import shippingRouter from './routes/shipping.js'; // 🔥 AGREGADO: Importamos la ruta de envíos

const app = express();
const PORT = process.env.PORT || 3001;

/* --- Middleware --- */

// Configuración de CORS a prueba de fallos
const allowedOrigins = [
  'http://localhost:5173',
  'https://cuyocebado.com.ar',
  'https://www.cuyocebado.com.ar',
  'https://cuyo-cebado.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Origen bloqueado por CORS:", origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200 // Clave para que los navegadores viejos o estrictos no bloqueen la respuesta
}));

/* Parse JSON request bodies */
app.use(express.json());

/* --- Routes --- */
app.use('/api/products', productsRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/shipping', shippingRouter); // 🔥 AGREGADO: Habilitamos el endpoint de cotización

/* Health check endpoint */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* --- Start Server --- */
app.listen(PORT, () => {
  console.log(`\n🧉 Cuyo Cebado API funcionando correctamente`);
  console.log(`   Puerto: ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});