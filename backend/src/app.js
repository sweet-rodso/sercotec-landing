import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import servicesRouter from './routes/services.js';
import testimonialsRouter from './routes/testimonials.js';
import faqRouter from './routes/faq.js';
import aboutRouter from './routes/about.js';
import contactRouter from './routes/contact.js';

export function createApp() {
  const app = express();

  // Cabeceras de seguridad HTTP por defecto (X-Content-Type-Options,
  // X-Frame-Options, etc.) — CE11 seguridad, buena práctica estándar.
  app.use(helmet());

  // CORS: en desarrollo se permite el origen del frontend Vite; en producción
  // se restringe a la(s) URL(es) reales vía variable de entorno FRONTEND_ORIGIN.
  const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());
  app.use(cors({ origin: allowedOrigins }));

  app.use(express.json({ limit: '100kb' })); // limita tamaño de payload (mitiga DoS simples)
  app.use(morgan('dev'));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/services', servicesRouter);
  app.use('/api/testimonials', testimonialsRouter);
  app.use('/api/faq', faqRouter);
  app.use('/api/about', aboutRouter);
  app.use('/api/contact', contactRouter);

  // 404 para cualquier ruta /api no definida
  app.use('/api', (req, res) => {
    res.status(404).json({ error: { type: 'not_found', message: 'Endpoint no encontrado.' } });
  });

  // Manejador de errores centralizado: nunca expone stack traces ni detalles
  // internos al cliente (CE11 — "controlar errores sin exponer info técnica").
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error('[error]', err.message);
    res.status(500).json({ error: { type: 'internal_error', message: 'Ocurrió un error inesperado. Intenta más tarde.' } });
  });

  return app;
}
