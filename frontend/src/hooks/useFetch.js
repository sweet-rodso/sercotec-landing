// Hook reutilizable para consumir la API con estados de carga/error/ausencia
// de resultados. Todas las secciones dinámicas (Servicios, Nosotros, FAQ,
// Testimonios) lo usan, evitando duplicar la misma lógica de useEffect+state
// en cada componente (buena práctica: reutilización mediante custom hooks).
import { useCallback, useEffect, useState } from 'react';

export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'empty' | 'error'
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);

    fetcher()
      .then((result) => {
        if (cancelled) return;
        const isEmpty = Array.isArray(result) && result.length === 0;
        setData(result);
        setStatus(isEmpty ? 'empty' : 'success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setStatus('error');
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => load(), [load]);

  return { data, status, error, reload: load };
}
