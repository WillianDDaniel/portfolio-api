import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'
import githubRoutes from '../../routes/github.routes.js'
import { authMiddleware } from '../../middlewares/auth.js'
import { cronMiddleware } from '../../middlewares/cron.js'

vi.mock('../../controllers/github.controller.js', () => ({
  syncGithubData: vi.fn((c) => c.json({ success: true, message: 'Synced successfully' })),
  previewGithubData: vi.fn((c) => c.json({ repos: ['repo-1', 'repo-2'] }))
}))

vi.mock('../../middlewares/auth.js', () => ({
  authMiddleware: vi.fn(async (c, next) => await next())
}))

vi.mock('../../middlewares/cron.js', () => ({
  cronMiddleware: vi.fn(async (c, next) => await next())
}))

describe('GitHub Routes', () => {
  let app: Hono

  beforeEach(() => {
    vi.clearAllMocks()
    app = new Hono()
    app.route('/api/github', githubRoutes)
  })

  describe('Cron & Sync Routes', () => {
    it('should call syncGithubData on GET /api/github/cron/sync when cron validation passes', async () => {
      const res = await app.request('/api/github/cron/sync')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ success: true, message: 'Synced successfully' })
    })

    it('should call syncGithubData on POST /api/github/sync when cron validation passes', async () => {
      const res = await app.request('/api/github/sync', {
        method: 'POST'
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ success: true, message: 'Synced successfully' })
    })

    it('should block GET /api/github/cron/sync if cron validation fails', async () => {
      vi.mocked(cronMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Forbidden' }, 403)
      })

      const res = await app.request('/api/github/cron/sync')

      expect(res.status).toBe(403)
      const data = await res.json()
      expect(data).toEqual({ message: 'Forbidden' })
    })
  })

  describe('Preview Routes', () => {
    it('should return preview data on GET /api/github/preview when user is authenticated', async () => {
      const res = await app.request('/api/github/preview')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ repos: ['repo-1', 'repo-2'] })
    })

    it('should block GET /api/github/preview when user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/github/preview')

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
    })
  })
})