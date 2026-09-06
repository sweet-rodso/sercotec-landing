import { useCallback, useState } from 'react';
import { api } from '../../api/client.js';
import { useFetch } from '../../hooks/useFetch.js';
import { LoadingState, ErrorState, EmptyState } from '../common/AsyncState.jsx';
import { FaqAccordion } from './FaqAccordion.jsx';

export function FaqSection() {
  const fetcher = useCallback(() => api.getFaq(), []);
  const { data: preguntas, status, error, reload } = useFetch(fetcher, []);
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  return (
    <section id="preguntas-frecuentes" className="section" aria-labelledby="faq-titulo">
      <div className="section__inner">
        <h2 id="faq-titulo">Preguntas frecuentes</h2>

        {status === 'loading' && <LoadingState label="Cargando preguntas frecuentes…" />}
        {status === 'error' && <ErrorState message={error?.message} onRetry={reload} />}
        {status === 'empty' && <EmptyState message="Aún no hay preguntas frecuentes publicadas." />}

        {status === 'success' && (
          <div className="faq-list">
            {preguntas.map((item) => (
              <FaqAccordion key={item.id} item={item} isOpen={openId === item.id} onToggle={toggle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
