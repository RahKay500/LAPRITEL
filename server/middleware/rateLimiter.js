import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Falls back to an in-memory store for local development, where Upstash env
// vars usually aren't configured. Production (Vercel) always uses Redis,
// since in-memory state doesn't persist across serverless invocations.
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null

function createLimiter({ limit, window, message }) {
  if (!redis) {
    const hits = new Map()
    const windowMs = parseWindowToMs(window)

    return (req, res, next) => {
      const key = req.ip
      const now = Date.now()
      const entry = hits.get(key)

      if (!entry || now - entry.start > windowMs) {
        hits.set(key, { start: now, count: 1 })
        return next()
      }

      entry.count += 1
      if (entry.count > limit) {
        return res.status(429).json({ message })
      }
      next()
    }
  }

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
  })

  return async (req, res, next) => {
    const { success } = await ratelimit.limit(req.ip)
    if (!success) {
      return res.status(429).json({ message })
    }
    next()
  }
}

function parseWindowToMs(window) {
  const [amount, unit] = window.split(' ')
  const unitMs = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }
  return Number(amount) * unitMs[unit]
}

export const apiLimiter = createLimiter({
  limit: 100,
  window: '15 m',
  message: 'Too many requests, please try again later.',
})

export const authLimiter = createLimiter({
  limit: 10,
  window: '15 m',
  message: 'Too many attempts, please try again later.',
})

export const paymentLimiter = createLimiter({
  limit: 20,
  window: '15 m',
  message: 'Too many payment attempts, please try again later.',
})
