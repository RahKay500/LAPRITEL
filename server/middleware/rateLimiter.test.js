import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authLimiter } from './rateLimiter.js'

// No UPSTASH_REDIS_REST_URL/TOKEN are set in this test environment (same as
// local dev), so rateLimiter.js falls back to its in-memory Map -- this
// exercises that real fallback path directly, not a mock of it. authLimiter
// is used here since its limit (10) is small enough to hit in a test without
// hundreds of calls.

function mockRes() {
  const res = {}
  res.status = vi.fn(() => res)
  res.json = vi.fn(() => res)
  return res
}

describe('authLimiter (in-memory fallback)', () => {
  let ipCounter = 0
  let ip

  beforeEach(() => {
    // A fresh IP per test avoids state leaking across tests, since the
    // limiter's hit-counter Map is module-scoped and persists for the
    // lifetime of the import.
    ipCounter += 1
    ip = `test-ip-${ipCounter}`
  })

  it('allows requests under the limit through', () => {
    for (let i = 0; i < 10; i += 1) {
      const next = vi.fn()
      authLimiter({ ip }, mockRes(), next)
      expect(next).toHaveBeenCalledOnce()
    }
  })

  it('blocks the request once the limit is exceeded', () => {
    for (let i = 0; i < 10; i += 1) {
      authLimiter({ ip }, mockRes(), vi.fn())
    }

    const next = vi.fn()
    const res = mockRes()
    authLimiter({ ip }, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(429)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Too many attempts, please try again later.',
    })
  })

  it('tracks each IP independently', () => {
    const otherIp = `${ip}-other`
    for (let i = 0; i < 10; i += 1) {
      authLimiter({ ip }, mockRes(), vi.fn())
    }

    // The first IP is now at its limit, but a different IP should be
    // unaffected.
    const next = vi.fn()
    authLimiter({ ip: otherIp }, mockRes(), next)
    expect(next).toHaveBeenCalledOnce()
  })
})
