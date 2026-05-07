/**
 * FAQ — Preguntas frecuentes premium para Cuyo Cebado.
 */
import { useState } from 'react';
import './FAQ.css';

const FAQ_ITEMS = [
  {
    q: '¿Cómo es el proceso de compra si quiero un mate?',
    a: 'Elegimos el contacto directo para brindarte una experiencia personalizada. Una vez que veas un modelo que te guste, hacés clic en el botón de WhatsApp y coordinamos todo por ahí: te enviamos fotos del stock real, despejamos tus dudas y definimos la entrega. Al ser piezas únicas talladas a mano, nos gusta que elijas exactamente el que te vas a llevar.',
  },
  {
    q: '¿Hacen envíos a todo el país y cómo entregan en Mendoza?',
    a: '¡Llegamos a cada rincón de Argentina! Realizamos envíos nacionales a través de correo privado, asegurando que tu mate viaje bien protegido. Si estás en Mendoza, podemos coordinar un punto de encuentro para que veas la calidad del producto en persona antes de retirarlo.',
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Para tu comodidad y seguridad, aceptamos transferencia bancaria (te enviamos el Alias por WhatsApp) y efectivo al momento de la entrega si te encontrás en Mendoza. Trabajamos de esta manera para evitar comisiones extra y mantener el precio más justo por un trabajo artesanal de exportación.',
  },
  {
    q: '¿De qué materiales están hechos los mates y qué garantía tienen?',
    a: 'Utilizamos exclusivamente maderas nobles (como algarrobo o caldén) y calabazas premium seleccionadas, todas trabajadas artesanalmente al pie de la cordillera. Confiamos tanto en nuestra calidad que, si el mate presenta alguna falla de fabricación, te lo cambiamos sin cargo.',
  },
  {
    q: '¿El mate viene listo para usar o debo curarlo?',
    a: 'Nuestros mates se entregan en su estado natural para que el proceso de curado lo realice el dueño original, asegurando que la pieza se adapte a su gusto personal. No te preocupes: junto con tu compra, te entregamos una guía paso a paso para que realices un curado perfecto y profesional.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggleItem = (index) => {
    setOpenIndex(prev => (prev === index ? -1 : index));
  };

  return (
    <section className="faq section" id="faq">
      <div className="section__container">
        {/* Clase específica faq__header para domar el tamaño del título */}
        <div className="section__title faq__header">
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