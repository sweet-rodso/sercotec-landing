// Validaciones manuales del lado del servidor. Nunca se confía en lo que llega
// del cliente: aunque el frontend valide, el backend repite las mismas reglas
// (CE10/CE11 seguridad — "no confiar solo en validación del cliente").

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = { nombre: 100, empresa: 100, mensaje: 1000, titulo: 120, descripcion: 600 };

export function isNonEmptyString(v, max = 500) {
  return typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;
}

export function validateContact(body) {
  const errors = {};
  const { nombre, correo, empresa, servicio, mensaje, honeypot } = body ?? {};

  // Honeypot: campo invisible para humanos; si un bot lo rellena, se descarta
  // la solicitud silenciosamente sin dar pistas de por qué (CE10 anti-bot).
  if (honeypot) {
    return { errors: { honeypot: 'spam_detected' }, isSpam: true };
  }

  if (!isNonEmptyString(nombre, MAX_LEN.nombre)) errors.nombre = 'El nombre es requerido (máx. 100 caracteres).';
  if (!isNonEmptyString(correo, 150) || !EMAIL_RE.test(correo.trim())) errors.correo = 'Ingresa un correo electrónico válido.';
  if (empresa !== undefined && empresa !== '' && !isNonEmptyString(empresa, MAX_LEN.empresa)) errors.empresa = 'Nombre de empresa demasiado largo.';
  if (!isNonEmptyString(servicio, 100)) errors.servicio = 'Selecciona un servicio de interés.';
  if (!isNonEmptyString(mensaje, MAX_LEN.mensaje)) errors.mensaje = `El mensaje es requerido (máx. ${MAX_LEN.mensaje} caracteres).`;

  return { errors, isSpam: false };
}

export function validateService(body) {
  const errors = {};
  const { titulo, descripcion, categoria, imagen } = body ?? {};
  if (!isNonEmptyString(titulo, MAX_LEN.titulo)) errors.titulo = 'El título es requerido.';
  if (!isNonEmptyString(descripcion, MAX_LEN.descripcion)) errors.descripcion = 'La descripción es requerida.';
  if (categoria !== undefined && !isNonEmptyString(categoria, 100)) errors.categoria = 'Categoría inválida.';
  if (imagen !== undefined && !isNonEmptyString(imagen, 300)) errors.imagen = 'Ruta de imagen inválida.';
  return errors;
}

export function validateTestimonial(body) {
  const errors = {};
  const { nombre, empresa, testimonio, calificacion } = body ?? {};
  if (!isNonEmptyString(nombre, 100)) errors.nombre = 'El nombre es requerido.';
  if (!isNonEmptyString(empresa, 100)) errors.empresa = 'La empresa es requerida.';
  if (!isNonEmptyString(testimonio, 400)) errors.testimonio = 'El testimonio es requerido.';
  if (calificacion !== undefined && (typeof calificacion !== 'number' || calificacion < 1 || calificacion > 5)) {
    errors.calificacion = 'La calificación debe ser un número entre 1 y 5.';
  }
  return errors;
}

export function validateFaq(body) {
  const errors = {};
  const { pregunta, respuesta } = body ?? {};
  if (!isNonEmptyString(pregunta, 200)) errors.pregunta = 'La pregunta es requerida.';
  if (!isNonEmptyString(respuesta, 800)) errors.respuesta = 'La respuesta es requerida.';
  return errors;
}
