import { Router } from 'express';
import { readCollection, writeCollection } from '../utils/jsonStore.js';
import { requireApiKey } from '../middleware/auth.js';

const router = Router();
const FILE = 'about.json';

// GET /api/about -> datos institucionales (misión, visión, estadísticas)
router.get('/', async (req, res, next) => {
  try {
    const data = await readCollection(FILE);
    res.json({ data });
  } catch (err) { next(err); }
});

// PUT /api/about -> actualizar (protegido, uso desde Postman)
router.put('/', requireApiKey, async (req, res, next) => {
  try {
    const actual = await readCollection(FILE);
    const actualizado = { ...actual, ...req.body };
    await writeCollection(FILE, actualizado);
    res.json({ data: actualizado });
  } catch (err) { next(err); }
});

export default router;
