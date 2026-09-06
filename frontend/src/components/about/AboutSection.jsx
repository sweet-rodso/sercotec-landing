import { useCallback } from 'react';
import { api } from '../../api/client.js';
import { useFetch } from '../../hooks/useFetch.js';
import { LoadingState, ErrorState } from '../common/AsyncState.jsx';
import { StatCounter } from './StatCounter.jsx';

export function AboutSection() {
  const fetcher = useCallback(() => api.getAbout(), []);
  const { data: about, status, error, reload } = useFetch(fetcher, []);

  return (
    <section id="nosotros" className="section section--alt" aria-labelledby="nosotros-titulo">
      <div className="section__inner">
        <h2 id="nosotros-titulo">Nosotros</h2>

        {status === 'loading' && <LoadingState label="Cargando información institucional…" />}
        {status === 'error' && <ErrorState message={error?.message} onRetry={reload} />}

        {status === 'success' && (
          <>
            <div className="about-grid">
              <div className="about-card">
                <h3>Misión</h3>
                <p>{about.mision}</p>
              </div>
              <div className="about-card">
                <h3>Visión</h3>
                <p>{about.vision}</p>
              </div>
            </div>

            <div className="stats-grid" aria-label="Cifras del Centro de Negocios">
              {about.estadisticas?.map((stat) => (
                <StatCounter key={stat.etiqueta} valor={stat.valor} etiqueta={stat.etiqueta} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
