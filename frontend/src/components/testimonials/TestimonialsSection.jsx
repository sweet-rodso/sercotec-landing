import { useCallback } from 'react';
import { api } from '../../api/client.js';
import { useFetch } from '../../hooks/useFetch.js';
import { LoadingState, ErrorState, EmptyState } from '../common/AsyncState.jsx';
import { TestimonialCarousel } from './TestimonialCarousel.jsx';

export function TestimonialsSection() {
  const fetcher = useCallback(() => api.getTestimonials(), []);
  const { data: testimonios, status, error, reload } = useFetch(fetcher, []);

  return (
    <section id="testimonios" className="section" aria-labelledby="testimonios-titulo">
      <div className="section__inner">
        <h2 id="testimonios-titulo">Lo que dicen las empresas que atendemos</h2>

        {status === 'loading' && <LoadingState label="Cargando testimonios…" />}
        {status === 'error' && <ErrorState message={error?.message} onRetry={reload} />}
        {status === 'empty' && <EmptyState message="Aún no hay testimonios publicados." />}
        {status === 'success' && <TestimonialCarousel testimonios={testimonios} />}
      </div>
    </section>
  );
}
