import { Router } from 'express';
import { readCollection, writeCollection } from '../utils/jsonStore.js';
import { validateService } from '../utils/validate.js';
import { requireApiKey } from '../middleware/auth.js';

const router = Router();
const FILE = 'services.json';

// GET /api/services  -> lista completa (pública, la consume la landing)
router.get('/', async (req, res, next) => {
  try {
    const items = await readCollection(FILE);
    const ordenados = [...items].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
    res.json({ data: ordenados, total: ordenados.length });
  } catch (err) { next(err); }
});

// GET /api/services/:id -> detalle de un servicio
router.get('/:id', async (req, res, next) => {
  try {
    const items = await readCollection(FILE);
    const item = items.find((s) => s.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: { type: 'not_found', message: 'Servicio no encontrado.' } });
    }
    res.json({ data: item });
  } catch (err) { next(err); }
});

// POST /api/services -> crear (protegido, uso desde Postman por el equipo de contenido)
router.post('/', requireApiKey, async (req, res, next) => {
  try {
    const errors = validateService(req.body);
    if (Object.keys(errors).length) {
      return res.status(422).json({ error: { type: 'logic_error', message: 'Datos inválidos.', details: errors } });
    }
    const items = await readCollection(FILE);
    const id = (req.body.titulo || 'servicio')
      .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    const nuevo = {
      id,
      titulo: req.body.titulo.trim(),
      descripcion: req.body.descripcion.trim(),
      categoria: req.body.categoria?.trim() || 'General',
      imagen: req.body.imagen?.trim() || '/img/servicio-generico.jpg',
      orden: items.length + 1,
    };
    items.push(nuevo);
    await writeCollection(FILE, items);
    res.status(201).json({ data: nuevo });
  } catch (err) { next(err); }
});

// PUT /api/services/:id -> actualizar (protegido)
router.put('/:id', requireApiKey, async (req, res, next) => {
  try {
    const errors = validateService(req.body);
    if (Object.keys(errors).length) {
      return res.status(422).json({ error: { type: 'logic_error', message: 'Datos inválidos.', details: errors } });
    }
    const items = await readCollection(FILE);
    const idx = items.findIndex((s) => s.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: { type: 'not_found', message: 'Servicio no encontrado.' } });
    }
    items[idx] = { ...items[idx], ...req.body, id: items[idx].id };
    await writeCollection(FILE, items);
    res.json({ data: items[idx] });
  } catch (err) { next(err); }
});

// DELETE /api/services/:id -> eliminar (protegido)
router.delete('/:id', requireApiKey, async (req, res, next) => {
  try {
    const items = await readCollection(FILE);
    const idx = items.findIndex((s) => s.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: { type: 'not_found', message: 'Servicio no encontrado.' } });
    }
    const [eliminado] = items.splice(idx, 1);
    await writeCollection(FILE, items);
    res.json({ data: eliminado });
  } catch (err) { next(err); }
});

export default router;
