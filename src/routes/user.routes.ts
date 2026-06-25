import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/auth.js';
import {
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/user.controller.js';

const userRoutes = new Hono();

userRoutes.get('/profile', authMiddleware, getProfile);
userRoutes.put('/profile', authMiddleware, updateProfile);
userRoutes.put('/password', authMiddleware, changePassword);

export default userRoutes;
