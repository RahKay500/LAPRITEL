import jwt from 'jsonwebtoken'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  listUsers: vi.fn(),
  findValidResetToken: vi.fn(),
  createResetToken: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}))

vi.mock('../config/supabase.js', () => ({
  supabase: { auth: { admin: { listUsers: mocks.listUsers } } },
}))
vi.mock('../config/supabaseAuth.js', () => ({
  supabaseAuth: { auth: { signInWithPassword: mocks.signInWithPassword } },
}))
vi.mock('../models/passwordResetTokens.js', () => ({
  createResetToken: mocks.createResetToken,
  findValidResetToken: mocks.findValidResetToken,
  invalidateResetTokensForUser: vi.fn(),
}))
vi.mock('../models/orders.js', () => ({ claimOrdersByEmail: vi.fn() }))
vi.mock('../utils/email.js', () => ({ sendPasswordResetEmail: mocks.sendPasswordResetEmail }))

const { login, getMe, logout, requestPasswordReset } = await import('./authController.js')

function response() {
  const res = { statusCode: 200, body: null, cookies: [], clearedCookies: [] }
  res.status = (code) => ((res.statusCode = code), res)
  res.json = (body) => ((res.body = body), res)
  res.cookie = (name, value, opts) => res.cookies.push({ name, value, opts })
  res.clearCookie = (name, opts) => res.clearedCookies.push({ name, opts })
  return res
}

beforeEach(() => {
  vi.clearAllMocks()
  process.env.JWT_SECRET = 'test-jwt-secret'
  process.env.JWT_EXPIRES_IN = '3d'
  process.env.CLIENT_URL = 'https://lapritel.vercel.app'
})

describe('login', () => {
  it('gives the same generic message for a wrong password', async () => {
    mocks.signInWithPassword.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid' } })
    const res = response()
    await login({ body: { email: 'ama@example.com', password: 'wrong' } }, res)

    expect(res.statusCode).toBe(401)
    expect(res.body).toEqual({ message: 'Invalid email or password' })
    expect(res.cookies).toHaveLength(0)
  })

  it('sets a Lax, httpOnly session cookie on success', async () => {
    mocks.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'u1', email: 'ama@example.com', user_metadata: {}, app_metadata: { role: 'customer' } } },
      error: null,
    })
    const res = response()
    await login({ body: { email: 'ama@example.com', password: 'right' } }, res)

    const cookie = res.cookies[0]
    expect(cookie.name).toBe('token')
    expect(cookie.opts.httpOnly).toBe(true)
    expect(cookie.opts.sameSite).toBe('lax')
    expect(cookie.opts.maxAge).toBe(3 * 24 * 60 * 60 * 1000)
  })

  it('issues a token that lasts three days', async () => {
    mocks.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'u1', email: 'a@b.co', user_metadata: {}, app_metadata: {} } },
      error: null,
    })
    const res = response()
    await login({ body: { email: 'a@b.co', password: 'x' } }, res)

    const decoded = jwt.verify(res.cookies[0].value, 'test-jwt-secret')
    expect(decoded.exp - decoded.iat).toBe(3 * 24 * 60 * 60)
  })
})

describe('getMe and logout', () => {
  it('returns no user when nobody is signed in', () => {
    const res = response()
    getMe({ user: undefined }, res)

    expect(res.body).toEqual({ user: null })
  })

  it('clears the session cookie on logout', () => {
    const res = response()
    logout({}, res)

    expect(res.clearedCookies[0].name).toBe('token')
    expect(res.clearedCookies[0].opts.sameSite).toBe('lax')
  })
})

describe('requestPasswordReset', () => {
  it('gives the same reply for an unknown email, so accounts cannot be discovered', async () => {
    mocks.listUsers.mockResolvedValue({ data: { users: [] }, error: null })
    const res = response()
    await requestPasswordReset({ body: { email: 'nobody@example.com' } }, res)

    expect(res.body.message).toMatch(/If an account exists/)
    expect(mocks.sendPasswordResetEmail).not.toHaveBeenCalled()
  })

  it('finds a user on a later page of results', async () => {
    const page1 = Array.from({ length: 1000 }, (_, i) => ({ id: `p${i}`, email: `user${i}@example.com` }))
    mocks.listUsers
      .mockResolvedValueOnce({ data: { users: page1 }, error: null })
      .mockResolvedValueOnce({ data: { users: [{ id: 'late', email: 'late@example.com', user_metadata: {} }] }, error: null })
    mocks.createResetToken.mockResolvedValue('raw-token')
    mocks.sendPasswordResetEmail.mockResolvedValue()
    const res = response()
    await requestPasswordReset({ body: { email: 'LATE@example.com' } }, res)

    expect(mocks.createResetToken).toHaveBeenCalledWith('late')
    expect(mocks.listUsers).toHaveBeenCalledTimes(2)
  })
})
