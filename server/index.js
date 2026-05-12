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

const app = express();
const PORT = process.env.PORT || 3001;

/* --- Middleware --- */

// Configuración de CORS Multiorigen
const allowedOrigins = [
  'http://localhost:5173',
  'https://cuyocebado.com.ar',
  'https://www.cuyocebado.com.ar'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir pedidos sin origen (como aplicaciones móviles o Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Origen bloqueado por CORS:", origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

/* Parse JSON request bodies */
app.use(express.json());

/* --- Routes --- */
app.use('/api/products', productsRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/newsletter', newsletterRouter);

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