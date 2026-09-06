import 'dotenv/config';
import { createApp } from './app.js';

const PORT = process.env.PORT || 4000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`API SERCOTEC escuchando en http://localhost:${PORT}`);
  console.log(`Salud: http://localhost:${PORT}/api/health`);
});
