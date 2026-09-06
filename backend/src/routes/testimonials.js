import { Router } from 'express';
import { readCollection, writeCollection } from '../utils/jsonStore.js';
import { validateTestimonial } from '../utils/validate.js';
import { requireApiKey } from '../middleware/auth.js';

const router = Router();
const FILE = 'testimonials.json';

router.get('/', async (req, res, next) => {
  try {
    const items = await readCollection(FILE);
    res.json({ data: items, total: items.length });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const items = await readCollection(FILE);
    const item = items.find((t) => t.id === req.params.id);
    if (!item) return res.status(404).json({ error: { type: 'not_found', message: 'Testimonio no encontrado.' } });
    res.json({ data: item });
  } catch (err) { next(err); }
});

router.post('/', requireApiKey, async (req, res, next) => {
  try {
    const errors = validateTestimonial(req.body);
    if (Object.keys(errors).length) {
      return res.status(422).json({ error: { type: 'logic_error', message: 'Datos inválidos.', details: errors } });
    }
    const items = await readCollection(FILE);
    const nuevo = {
      id: 't' + Date.now().toString(36),
      nombre: req.body.nombre.trim(),
      empresa: req.body.empresa.trim(),
      cargo: req.body.cargo?.trim() || '',
      testimonio: req.body.testimonio.trim(),
      avatar: req.body.avatar?.trim() || '/img/testimonio-generico.jpg',
      calificacion: req.body.calificacion ?? 5,
    };
    items.push(nuevo);
    await writeCollection(FILE, items);
    res.status(201).json({ data: nuevo });
  } catch (err) { next(err); }
});

router.put('/:id', requireApiKey, async (req, res, next) => {
  try {
    const errors = validateTestimonial(req.body);
    if (Object.keys(errors).length) {
      return res.status(422).json({ error: { type: 'logic_error', message: 'Datos inválidos.', details: errors } });
    }
    const items = await readCollection(FILE);
    const idx = items.findIndex((t) => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: { type: 'not_found', message: 'Testimonio no encontrado.' } });
    items[idx] = { ...items[idx], ...req.body, id: items[idx].id };
    await writeCollection(FILE, items);
    res.json({ data: items[idx] });
  } catch (err) { next(err); }
});

router.delete('/:id', requireApiKey, async (req, res, next) => {
  try {
    const items = await readCollection(FILE);
    const idx = items.findIndex((t) => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: { type: 'not_found', message: 'Testimonio no encontrado.' } });
    const [eliminado] = items.splice(idx, 1);
    await writeCollection(FILE, items);
    res.json({ data: eliminado });
  } catch (err) { next(err); }
});

export default router;
