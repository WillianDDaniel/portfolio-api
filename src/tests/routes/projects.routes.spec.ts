import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'
import projectsRoutes from '../../routes/projects.routes.js'
import { authMiddleware } from '../../middlewares/auth.js'

vi.mock('../../controllers/projects.controller.js', () => ({
  getProjects: vi.fn((c) => c.json([{ id: 1, title: 'Portfolio Website' }])),
  getProjectById: vi.fn((c) => c.json({ id: c.req.param('id'), title: 'Portfolio Website' })),
  createProject: vi.fn((c) => c.json({ success: true }, 201)),
  updateProject: vi.fn((c) => c.json({ success: true })),
  deleteProject: vi.fn((c) => c.json({ message: 'Deleted' }))
}))

vi.mock('../../middlewares/auth.js', () => ({
  authMiddleware: vi.fn(async (c, next) => await next())
}))

describe('Projects Routes', () => {
  let app: Hono

  beforeEach(() => {
    vi.clearAllMocks()
    app = new Hono()
    app.route('/api/projects', projectsRoutes)
  })

  describe('Public Routes', () => {
    it('should return a list of projects on GET /api/projects', async () => {
      const res = await app.request('/api/projects')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual([{ id: 1, title: 'Portfolio Website' }])
    })

    it('should return a specific project on GET /api/projects/:id', async () => {
      const res = await app.request('/api/projects/42')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ id: '42', title: 'Portfolio Website' })
    })
  })

  describe('Protected Routes', () => {
    it('should create a project if user is authenticated on POST /api/projects', async () => {
      const res = await app.request('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New App' })
      })

      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data).toEqual({ success: true })
    })

    it('should update a project if user is authenticated on PUT /api/projects/:id', async () => {
      const res = await app.request('/api/projects/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated App' })
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ success: true })
    })

    it('should block POST /api/projects if user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Hacked App' })
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
    })

    it('should block DELETE /api/projects/:id if user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/projects/1', {
        method: 'DELETE'
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
    })
  })
})
