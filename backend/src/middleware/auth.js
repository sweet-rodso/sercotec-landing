// Middleware de autenticación simple para operaciones de escritura del CMS.
// El equipo de contenido administra servicios/testimonios/FAQ vía Postman
// enviando el header "X-Api-Key". La clave NO se hardcodea: se lee desde
// variables de entorno (.env, fuera del control de versiones) — mitiga el
// riesgo de credenciales expuestas en el código fuente (CE11 seguridad).
export function requireApiKey(req, res, next) {
  const provided = req.header('X-Api-Key');
  const expected = process.env.CMS_API_KEY;

  if (!expected) {
    // Falla segura: si el servidor no tiene configurada la clave, se rechaza
    // toda escritura en lugar de dejarla abierta por defecto.
    return res.status(500).json({
      error: { type: 'internal_error', message: 'CMS no configurado correctamente.' }
    });
  }

  if (!provided || provided !== expected) {
    return res.status(401).json({
      error: { type: 'auth_error', message: 'API key inválida o ausente.' }
    });
  }

  next();
}
