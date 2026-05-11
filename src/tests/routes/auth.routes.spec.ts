import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

import authRoutes from '../../routes/auth.routes.js'
import { authMiddleware } from '../../middlewares/auth.js'

vi.mock('../../controllers/auth.controller.js', () => ({
  login: vi.fn((c) => c.json({ token: 'mock-token', success: true })),
  logout: vi.fn((c) => c.json({ message: 'Logged out successfully' }))
}))

vi.mock('../../middlewares/auth.js', () => ({
  authMiddleware: vi.fn(async (c, next) => {
    c.set('jwtPayload', { userId: '123', role: 'admin' })
    await next()
  })
}))

describe('Auth Routes', () => {
  let app: Hono

  beforeEach(() => {
    vi.clearAllMocks()
    app = new Hono()
    app.route('/auth', authRoutes)
  })

  describe('Public Routes', () => {
    it('should process login on POST /auth/login', async () => {
      const res = await app.request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ token: 'mock-token', success: true })
    })

    it('should process logout on POST /auth/logout', async () => {
      const res = await app.request('/auth/logout', {
        method: 'POST'
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ message: 'Logged out successfully' })
    })
  })

  describe('Protected Routes', () => {
    it('should return jwtPayload on GET /auth/me when authenticated', async () => {
      const res = await app.request('/auth/me')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ userId: '123', role: 'admin' })
    })

    it('should block GET /auth/me when not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/auth/me')

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
    })
  })
})
