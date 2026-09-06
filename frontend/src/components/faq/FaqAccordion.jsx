import { memo } from 'react';

// Ítem de acordeón accesible: usa <button> nativo (foco y activación por
// teclado gratis), aria-expanded/aria-controls para anunciar el estado, y
// un id único para enlazar pregunta<->respuesta. React.memo porque cada
// ítem solo depende de sus propias props, no de qué otro ítem está abierto.
function FaqAccordionBase({ item, isOpen, onToggle }) {
  const panelId = `faq-panel-${item.id}`;
  const buttonId = `faq-button-${item.id}`;

  return (
    <div className="faq-item">
      <h3>
        <button
          type="button"
          id={buttonId}
          className="faq-item__question"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => onToggle(item.id)}
        >
          {item.pregunta}
          <span className="faq-item__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="faq-item__answer"
        hidden={!isOpen}
      >
        <p>{item.respuesta}</p>
      </div>
    </div>
  );
}

export const FaqAccordion = memo(FaqAccordionBase);
