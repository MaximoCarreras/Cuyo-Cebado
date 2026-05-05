/**
 * Newsletter — "Club del Mate" signup section.
 * Submits email to Supabase (or backend API). [SF]
 */
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import './Newsletter.css';

/* API base URL for fallback when Supabase is not configured [CMV] */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Basic email validation [IV] */
    if (!email || !email.includes('@')) return;

    setStatus('loading');

    try {
      if (supabase) {
        /* Direct insert to Supabase using anon key + RLS */
        const { error } = await supabase
          .from('newsletter_subscribers')
          .upsert({ email }, { onConflict: 'email' });

        if (error) throw error;
      } else {
        /* Fallback: POST to backend API */
        const res = await fetch(`${API_URL}/api/newsletter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error('API error');
      }

      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setStatus('error');
    }
  };

  return (
    <section className="newsletter section" id="contacto">
      <div className="newsletter__container section__container">
        <h2 className="newsletter__title">Unite al Club del Mate</h2>
        <p className="newsletter__subtitle">
          Recibí un 10% OFF en tu primera compra + tips de curado exclusivos
        </p>

        <form className="newsletter__form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Tu email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="newsletter__input"
            required
          />
          <button
            type="submit"
            className="btn btn--primary"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
          </button>
        </form>

        {/* Status messages */}
        {status === 'success' && (
          <p className="newsletter__message newsletter__message--success">
            ✅ ¡Te suscribiste! Revisá tu email para el cupón de 10% OFF.
          </p>
        )}
        {status === 'error' && (
          <p className="newsletter__message newsletter__message--error">
            ❌ Hubo un error. Intentá de nuevo.
          </p>
        )}

        <p className="newsletter__disclaimer">
          Sin spam. Cancelá cuando quieras.
        </p>
      </div>
    </section>
  );
}
