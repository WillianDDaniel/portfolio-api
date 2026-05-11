import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';

import educationsRoutes from '../../routes/educations.routes.js';
import { authMiddleware } from '../../middlewares/auth.js';

vi.mock('../../controllers/educations.controller.js', () => ({
  getEducations: vi.fn((c) => c.json([{ id: 1, title: 'Software Engineering' }])),
  getEducationById: vi.fn((c) => c.json({ id: c.req.param('id'), title: 'Software Engineering' })),
  createEducation: vi.fn((c) => c.json({ success: true }, 201)),
  updateEducation: vi.fn((c) => c.json({ success: true })),
  deleteEducation: vi.fn((c) => c.json({ message: 'Deleted' }))
}));

vi.mock('../../middlewares/auth.js', () => ({
  authMiddleware: vi.fn(async (c, next) => await next())
}));

describe('Educations Routes', () => {
  let app: Hono;

  beforeEach(() => {
    vi.clearAllMocks();
    app = new Hono();
    app.route('/api/educations', educationsRoutes);
  });

  describe('Public Routes', () => {
    it('should return a list of educations on GET /api/educations', async () => {
      const res = await app.request('/api/educations');

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual([{ id: 1, title: 'Software Engineering' }]);
    });

    it('should return a specific education on GET /api/educations/:id', async () => {
      const res = await app.request('/api/educations/99');

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ id: '99', title: 'Software Engineering' });
    });
  });

  describe('Protected Routes', () => {
    it('should create an education if user is logged in on POST /api/educations', async () => {
      const res = await app.request('/api/educations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Course' })
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data).toEqual({ success: true });
    });

    it('should block DELETE /api/educations/:id if user is not logged in', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401);
      });

      const res = await app.request('/api/educations/1', {
        method: 'DELETE'
      });

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data).toEqual({ message: 'Unauthorized' });
    });
  });
});
