import { Context } from 'hono'
import { generateSignature } from '../services/cloudinary.service.js'

const ALLOWED_FOLDERS = ['projects', 'services', 'educations', 'users', 'settings'];

export const getCloudinarySignature = async (c: Context) => {
  const folder = c.req.query('folder');
  const identifier = c.req.query('identifier');

  if (!folder || !identifier) {
    return c.json({ message: 'Parâmetros folder e identifier são obrigatórios.' }, 400);
  }

  if (!ALLOWED_FOLDERS.includes(folder)) {
    return c.json({ message: 'Pasta de destino não permitida.' }, 403);
  }

  const signatureData = generateSignature(folder, identifier);

  return c.json(signatureData);
}
