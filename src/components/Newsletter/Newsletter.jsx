/**
 * Newsletter — "Club del Mate" signup section.
 */
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import './Newsletter.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');

    try {
      if (supabase) {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .upsert({ email }, { onConflict: 'email' });
        if (error) throw error;
      } else {
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
      <div className="newsletter__container">

        {/* Título unificado con línea dorada */}
        <div className="section__title newsletter__header">
          <h2>Unite al Club del Mate</h2>
          <div className="gold-line"></div>
        </div>

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
            className="newsletter__btn"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
          </button>
        </form>

        {status === 'success' && (
          <p className="newsletter__message newsletter__message--success">
            ✅ ¡Te suscribiste! Revisá tu email para el cupón.
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