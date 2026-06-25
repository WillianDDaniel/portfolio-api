import { Context } from 'hono';
import * as bcrypt from 'bcryptjs';

import {
  findUserById,
  updateUserProfile,
  updateUserPassword
} from '../repositories/users.repository.js';

export const getProfile = async (c: Context) => {
  const payload = c.get('jwtPayload');

  const user = await findUserById(payload.id);
  if (!user) return c.json({ message: 'Usuário não encontrado' }, 404);

  const { passwordHash, lockUntil, loginAttempts, ...safeUser } = user;
  return c.json(safeUser);
};

export const updateProfile = async (c: Context) => {
  const payload = c.get('jwtPayload');
  const { name, email, avatarUrl } = await c.req.json();

  try {
    const updatedUser = await updateUserProfile(payload.id, { name, email, avatarUrl });
    const { passwordHash, lockUntil, loginAttempts, ...safeUser } = updatedUser;

    return c.json(safeUser);
  } catch (error: any) {
    if (error.code === '23505') {
      return c.json({ message: 'Email já está em uso.' }, 400);
    }
    return c.json({ message: 'Erro ao atualizar perfil' }, 500);
  }
};

export const changePassword = async (c: Context) => {
  const payload = c.get('jwtPayload');
  const { oldPassword, newPassword } = await c.req.json();

  if (!oldPassword || !newPassword) {
    return c.json({ message: 'Senha atual e nova são obrigatórias' }, 400);
  }

  const user = await findUserById(payload.id);
  if (!user) return c.json({ message: 'Usuário não encontrado' }, 404);

  const passwordValid = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!passwordValid) {
    return c.json({ message: 'A senha atual está incorreta' }, 401);
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await updateUserPassword(payload.id, newPasswordHash);

  return c.json({ message: 'Senha atualizada com sucesso' });
};
