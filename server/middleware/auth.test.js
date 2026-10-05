import jwt from 'jsonwebtoken'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ getUserById: vi.fn() }))
vi.mock('../config/supabase.js', () => ({
  supabase: { auth: { admin: { getUserById: mocks.getUserById } } },
}))

const { requireAdmin, requireAuth } = await import('./auth.js')

function response() {
  const res = { statusCode: 200, body: null }
  res.status = (code) => ((res.statusCode = code), res)
  res.json = (body) => ((res.body = body), res)
  return res
}

beforeEach(() => {
  vi.clearAllMocks()
  process.env.JWT_SECRET = 'test-jwt-secret'
})

describe('requireAuth', () => {
  it('rejects a request with no token', () => {
    const res = response()
    const next = vi.fn()
    requireAuth({ cookies: {} }, res, next)

    expect(res.statusCode).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('rejects a token signed with a different secret', () => {
    const forged = jwt.sign({ id: 'u1', role: 'admin' }, 'wrong-secret')
    const res = response()
    const next = vi.fn()
    requireAuth({ cookies: { token: forged } }, res, next)

    expect(res.statusCode).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })
})

describe('requireAdmin', () => {
  it('lets through a user whose stored role is admin', async () => {
    mocks.getUserById.mockResolvedValue({ data: { user: { app_metadata: { role: 'admin' } } }, error: null })
    const token = jwt.sign({ id: 'u1', role: 'admin' }, 'test-jwt-secret')
    const res = response()
    const next = vi.fn()
    requireAdmin({ cookies: { token } }, res, next)
    await new Promise((resolve) => setImmediate(resolve))

    expect(next).toHaveBeenCalled()
  })

  it('blocks a user who was demoted after the token was issued', async () => {
    mocks.getUserById.mockResolvedValue({ data: { user: { app_metadata: { role: 'customer' } } }, error: null })
    const token = jwt.sign({ id: 'u1', role: 'admin' }, 'test-jwt-secret')
    const res = response()
    const next = vi.fn()
    requireAdmin({ cookies: { token } }, res, next)
    await new Promise((resolve) => setImmediate(resolve))

    expect(res.statusCode).toBe(403)
    expect(next).not.toHaveBeenCalled()
  })
})
