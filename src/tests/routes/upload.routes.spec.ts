import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'
import uploadRoutes from '../../routes/upload.routes.js'
import { authMiddleware } from '../../middlewares/auth.js'

vi.mock('../../controllers/upload.controller.js', () => ({
  getCloudinarySignature: vi.fn((c) => c.json({
    timestamp: 1715000000,
    signature: 'mocked-signature-string'
  }))
}))

vi.mock('../../middlewares/auth.js', () => ({
  authMiddleware: vi.fn(async (c, next) => await next())
}))

describe('Upload Routes', () => {
  let app: Hono

  beforeEach(() => {
    vi.clearAllMocks()
    app = new Hono()
    app.route('/api/uploads', uploadRoutes)
  })

  describe('Protected Routes', () => {
    it('should return signature data on GET /api/uploads/cloudinary-signature when authenticated', async () => {
      const res = await app.request('/api/uploads/cloudinary-signature')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({
        timestamp: 1715000000,
        signature: 'mocked-signature-string'
      })
    })

    it('should block GET /api/uploads/cloudinary-signature when not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/uploads/cloudinary-signature')

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
    })
  })
})
