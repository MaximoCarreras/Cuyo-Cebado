# Mates Mendoza — Landing Page

Artisanal mate shop landing page built with React + Vite (frontend) and Node.js + Express (backend). Connected to Supabase for database/stock management and Mercado Pago for payments.

## Tech Stack

- **Frontend**: React 19 + Vite 8
- **Backend**: Node.js + Express 5
- **Database**: Supabase (PostgreSQL)
- **Payments**: Mercado Pago Checkout Pro
- **Styling**: Vanilla CSS with design tokens

## Quick Start

### 1. Install dependencies

```bash
# Frontend
npm install

# Backend
cd server && npm install
```

### 2. Configure environment

```bash
# Copy the example file
cp .env.example .env

# Fill in your credentials:
# - Supabase URL + keys (from supabase.com dashboard)
# - Mercado Pago access token (from mercadopago.com.ar/developers)
```

### 3. Set up Supabase database

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Paste and run `supabase-schema.sql`
4. Copy your project URL, anon key, and service role key to `.env`

### 4. Set up Mercado Pago

1. Create a developer account at [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. Create an application
3. Copy the Access Token to `.env`

### 5. Run the project

```bash
# Terminal 1 — Frontend (port 5173)
npm run dev

# Terminal 2 — Backend (port 3001)
cd server && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
CUYO/
├── src/                  # React frontend
│   ├── components/       # 16 section components
│   ├── context/          # Cart state management
│   ├── hooks/            # Products + countdown hooks
│   ├── lib/              # Supabase client
│   └── assets/           # Generated images
├── server/               # Express backend
│   ├── routes/           # API endpoints
│   └── lib/              # Supabase + MP clients
├── supabase-schema.sql   # Database schema + seed data
└── .env.example          # Environment variables template
```

## Features

- 16 landing page sections with earth-tone design system
- Real-time product stock from Supabase
- Mercado Pago Checkout Pro integration
- Shopping cart with localStorage persistence
- Real-time countdown timer
- Expandable FAQ accordion
- Newsletter signup
- Responsive design (mobile + desktop)
- Sticky navbar with compact scroll mode

## Nota

The app works without Supabase/MP credentials using fallback mock data. Configure credentials for full functionality.
