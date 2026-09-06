// Estados compartidos para cualquier sección que consuma datos de la API.
// Un único lugar para el "look & feel" de carga/error/vacío mantiene
// consistencia visual y evita duplicar markup en cada sección (CE5 buenas
// prácticas: reutilización de componentes).
export function LoadingState({ label = 'Cargando contenido…' }) {
  return (
    <div className="async-state async-state--loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="async-state async-state--error" role="alert">
      <p>⚠️ {message || 'No pudimos cargar esta sección.'}</p>
      {onRetry && (
        <button type="button" className="btn btn--ghost" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message = 'Aún no hay contenido disponible.' }) {
  return (
    <div className="async-state async-state--empty">
      <p>{message}</p>
    </div>
  );
}
