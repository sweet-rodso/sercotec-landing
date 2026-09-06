import { Router } from 'express';
import { readCollection, writeCollection } from '../utils/jsonStore.js';
import { validateFaq } from '../utils/validate.js';
import { requireApiKey } from '../middleware/auth.js';

const router = Router();
const FILE = 'faq.json';

router.get('/', async (req, res, next) => {
  try {
    const items = await readCollection(FILE);
    res.json({ data: items, total: items.length });
  } catch (err) { next(err); }
});

router.post('/', requireApiKey, async (req, res, next) => {
  try {
    const errors = validateFaq(req.body);
    if (Object.keys(errors).length) {
      return res.status(422).json({ error: { type: 'logic_error', message: 'Datos inválidos.', details: errors } });
    }
    const items = await readCollection(FILE);
    const nuevo = { id: 'f' + Date.now().toString(36), pregunta: req.body.pregunta.trim(), respuesta: req.body.respuesta.trim() };
    items.push(nuevo);
    await writeCollection(FILE, items);
    res.status(201).json({ data: nuevo });
  } catch (err) { next(err); }
});

router.put('/:id', requireApiKey, async (req, res, next) => {
  try {
    const errors = validateFaq(req.body);
    if (Object.keys(errors).length) {
      return res.status(422).json({ error: { type: 'logic_error', message: 'Datos inválidos.', details: errors } });
    }
    const items = await readCollection(FILE);
    const idx = items.findIndex((f) => f.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: { type: 'not_found', message: 'Pregunta no encontrada.' } });
    items[idx] = { ...items[idx], ...req.body, id: items[idx].id };
    await writeCollection(FILE, items);
    res.json({ data: items[idx] });
  } catch (err) { next(err); }
});

router.delete('/:id', requireApiKey, async (req, res, next) => {
  try {
    const items = await readCollection(FILE);
    const idx = items.findIndex((f) => f.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: { type: 'not_found', message: 'Pregunta no encontrada.' } });
    const [eliminado] = items.splice(idx, 1);
    await writeCollection(FILE, items);
    res.json({ data: eliminado });
  } catch (err) { next(err); }
});

export default router;
