import { memo, useEffect, useRef, useState } from 'react';

// Contador animado para las estadísticas de "Nosotros". Usa
// IntersectionObserver para animar solo cuando el bloque entra en pantalla
// (evita trabajo de animación fuera de vista) y respeta
// prefers-reduced-motion mostrando el valor final de inmediato.
// React.memo: cada StatCounter es independiente y no debe re-renderizarse
// cuando cambian props de sus hermanos (CE8 optimización).
function StatCounterBase({ valor, etiqueta }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplay(valor);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const duration = 900;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          setDisplay(Math.round(valor * progress));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [valor]);

  return (
    <div className="stat-counter" ref={ref}>
      <span className="stat-counter__value" aria-hidden="true">{display}+</span>
      <span className="sr-only">{valor} {etiqueta}</span>
      <span className="stat-counter__label" aria-hidden="true">{etiqueta}</span>
    </div>
  );
}

export const StatCounter = memo(StatCounterBase);
