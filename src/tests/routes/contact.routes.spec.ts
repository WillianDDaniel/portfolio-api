import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'
import contactRoutes from '../../routes/contact.routes.js'

vi.mock('../../controllers/contact.controller.js', () => ({
  sendContactEmail: vi.fn((c) => c.json({ success: true, message: 'Email sent successfully' }, 200))
}))

describe('Contact Routes', () => {
  let app: Hono

  beforeEach(() => {
    vi.clearAllMocks()
    app = new Hono()
    app.route('/api/contact', contactRoutes)
  })

  describe('Public Routes', () => {
    it('should process the contact form submission on POST /api/contact', async () => {
      const res = await app.request('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Hello there'
        })
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ success: true, message: 'Email sent successfully' })
    })
  })
})
