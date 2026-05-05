/**
 * Express Server — Mates Mendoza API
 * 
 * Serves as the backend for:
 * - Product listing from Supabase
 * - Mercado Pago checkout integration
 * - Payment webhook processing
 * - Newsletter subscriptions
 * 
 * Start: node index.js (or npm run dev for --watch mode)
 * Port: 3001 (configurable via PORT env var) [SF][CA]
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
/* CORS: allow frontend origin during development [SFT] */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
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
  console.log(`\n🧉 Mates Mendoza API running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
