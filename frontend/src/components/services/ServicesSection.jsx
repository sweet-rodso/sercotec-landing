import { useCallback } from 'react';
import { api } from '../../api/client.js';
import { useFetch } from '../../hooks/useFetch.js';
import { LoadingState, ErrorState, EmptyState } from '../common/AsyncState.jsx';
import { ServiceCard } from './ServiceCard.jsx';

export function ServicesSection() {
  const fetcher = useCallback(() => api.getServices(), []);
  const { data: servicios, status, error, reload } = useFetch(fetcher, []);

  return (
    <section id="servicios" className="section section--alt" aria-labelledby="servicios-titulo">
      <div className="section__inner">
        <h2 id="servicios-titulo">Nuestros servicios</h2>
        <p className="section__lead">
          Acompañamiento integral para que tu negocio funcione mejor, sea más eficiente y crezca de forma sostenible.
        </p>

        {status === 'loading' && <LoadingState label="Cargando servicios…" />}
        {status === 'error' && <ErrorState message={error?.message} onRetry={reload} />}
        {status === 'empty' && <EmptyState message="Aún no hay servicios publicados." />}

        {status === 'success' && (
          <div className="service-grid">
            {servicios.map((servicio) => (
              <ServiceCard key={servicio.id} servicio={servicio} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
