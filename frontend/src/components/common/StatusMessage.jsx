// Mensaje de retroalimentación visual reutilizable (éxito / error) usado por
// el formulario de contacto y potencialmente por otras acciones futuras.
// aria-live="assertive" asegura que lectores de pantalla anuncien el cambio
// de estado inmediatamente (WCAG 2.1 — 4.1.3 Mensajes de estado).
export function StatusMessage({ type, children }) {
  if (!type) return null;
  const isSuccess = type === 'success';
  return (
    <div
      className={`status-message status-message--${type}`}
      role={isSuccess ? 'status' : 'alert'}
      aria-live="assertive"
    >
      <span aria-hidden="true">{isSuccess ? '✅' : '⚠️'}</span>
      <span>{children}</span>
    </div>
  );
}
