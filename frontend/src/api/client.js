// Cliente HTTP centralizado. Toda la app pasa por aquí para hablar con el
// backend: evita repetir fetch/try-catch en cada componente (DRY) y permite
// cambiar la URL base en un solo lugar (buena práctica: separación de
// responsabilidades — la capa de datos no vive dentro de los componentes).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    // Respuesta sin cuerpo (p. ej. algunos 204) — no es un error por sí mismo.
  }

  if (!res.ok) {
    const message = payload?.error?.message || 'No se pudo completar la solicitud.';
    throw new ApiError(message, res.status, payload?.error?.details);
  }

  return payload?.data ?? payload;
}

export const api = {
  getServices: () => request('/services'),
  getService: (id) => request(`/services/${id}`),
  getTestimonials: () => request('/testimonials'),
  getFaq: () => request('/faq'),
  getAbout: () => request('/about'),
  sendContact: (payload) => request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
};

export { ApiError };
