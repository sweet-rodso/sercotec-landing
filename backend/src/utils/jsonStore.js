// Utilidad de acceso a los archivos JSON que actúan como base de datos del CMS.
// Centraliza lectura/escritura para evitar duplicar lógica de I/O y validar
// que siempre se trabaje con arreglos/objetos bien formados (buena práctica: DRY).
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../data');

function dataPath(fileName) {
  // Evita path traversal: solo se permite acceder a archivos .json dentro de /data
  const safeName = path.basename(fileName);
  if (!safeName.endsWith('.json')) {
    throw new Error('Nombre de archivo de datos inválido');
  }
  return path.join(DATA_DIR, safeName);
}

export async function readCollection(fileName) {
  const raw = await readFile(dataPath(fileName), 'utf-8');
  return JSON.parse(raw);
}

export async function writeCollection(fileName, data) {
  await writeFile(dataPath(fileName), JSON.stringify(data, null, 2), 'utf-8');
}
