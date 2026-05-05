/**
 * FAQ — Expandable accordion with 5 frequently asked questions.
 * Uses useState to track which item is open. [SF]
 */
import { useState } from 'react';
import './FAQ.css';

const FAQ_ITEMS = [
  {
    q: '¿Cuánto tarda el envío?',
    a: 'Hacemos envíos a todo el país. En CABA y GBA llega en 24 a 48hs hábiles. Al interior, entre 3 y 5 días hábiles. Trabajamos con Correo Argentino y Andreani.',
  },
  {
    q: '¿Cómo sé qué mate elegir?',
    a: 'Depende de tu gusto: los de madera son los más clásicos y duraderos, los de calabaza tienen el sabor tradicional, y los de cerámica son ideales si buscás algo moderno y fácil de limpiar. Si tenés dudas, escribinos por WhatsApp y te asesoramos.',
  },
  {
    q: '¿El mate viene curado?',
    a: 'Los mates de calabaza vienen pre-curados de fábrica, pero recomendamos hacer un curado casero antes de usar (te enviamos las instrucciones). Los de madera y cerámica están listos para usar.',
  },
  {
    q: '¿Puedo devolver el producto?',
    a: 'Sí. Tenés 30 días desde la recepción para devolver el producto si no estás conforme. Solo pedimos que esté en las mismas condiciones en que lo recibiste. El costo de envío de devolución corre por nuestra cuenta.',
  },
  {
    q: '¿Tienen locales físicos en Mendoza?',
    a: 'Sí, tenemos nuestro taller-showroom en Chacras de Coria, Luján de Cuyo. Podés visitarnos de lunes a sábados de 9 a 18hs. También hacemos envíos a todo el país desde ahí.',
  },
];

export default function FAQ() {
  /* Track open item index. -1 means all closed. */
  const [openIndex, setOpenIndex] = useState(-1);

  const toggleItem = (index) => {
    setOpenIndex(prev => prev === index ? -1 : index);
  };

  return (
    <section className="faq section" id="faq">
      <div className="section__container">
        <div className="section__title">
          <h2>Preguntas frecuentes</h2>
          <div className="gold-line"></div>
        </div>

        <div className="faq__list">
          {FAQ_ITEMS.map((item, i) => (
            <div
              className={`faq__item ${openIndex === i ? 'faq__item--open' : ''}`}
              key={i}
            >
              <button
                className="faq__question"
                onClick={() => toggleItem(i)}
                aria-expanded={openIndex === i}
              >
                <span>{item.q}</span>
                <span className="material-symbols-outlined faq__icon">
                  {openIndex === i ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Expandable answer */}
              <div className="faq__answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
