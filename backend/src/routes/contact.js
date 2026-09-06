import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { readCollection, writeCollection } from '../utils/jsonStore.js';
import { validateContact } from '../utils/validate.js';
import { requireApiKey } from '../middleware/auth.js';

const router = Router();
const FILE = 'contact-submissions.json';

// Limita los envíos de formulario a 5 por 10 minutos por IP: mitiga abuso/spam
// sin depender de un captcha externo (CE10 seguridad — protección anti-bot).
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { type: 'rate_limiting_error', message: 'Demasiados envíos. Intenta nuevamente en unos minutos.' } },
});

// POST /api/contact -> recibe el formulario de contacto de la landing
router.post('/', contactLimiter, async (req, res, next) => {
  try {
    const { errors, isSpam } = validateContact(req.body);

    // Si el honeypot fue rellenado, respondemos 200 "falso positivo" para no
    // darle al bot ninguna pista de que fue detectado, pero NO guardamos nada.
    if (isSpam) {
      return res.status(200).json({ data: { recibido: true } });
    }

    if (Object.keys(errors).length) {
      return res.status(422).json({ error: { type: 'logic_error', message: 'Revisa los campos del formulario.', details: errors } });
    }

    const items = await readCollection(FILE);
    const nuevo = {
      id: 'c' + Date.now().toString(36),
      nombre: req.body.nombre.trim(),
      correo: req.body.correo.trim(),
      empresa: req.body.empresa?.trim() || '',
      servicio: req.body.servicio.trim(),
      mensaje: req.body.mensaje.trim(),
      fecha: new Date().toISOString(),
      atendido: false,
    };
    items.push(nuevo);
    await writeCollection(FILE, items);

    // Nunca se devuelve el objeto completo con datos internos (p.ej. IP) al
    // cliente: solo confirmación mínima (CE11 — no exponer info innecesaria).
    res.status(201).json({ data: { id: nuevo.id, recibido: true } });
  } catch (err) { next(err); }
});

// GET /api/contact -> listar mensajes recibidos (protegido, uso interno/Postman)
router.get('/', requireApiKey, async (req, res, next) => {
  try {
    const items = await readCollection(FILE);
    res.json({ data: items, total: items.length });
  } catch (err) { next(err); }
});

export default router;
