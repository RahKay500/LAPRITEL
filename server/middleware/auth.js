import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session' })
  }
}

export function attachUserIfPresent(req, _res, next) {
  const token = req.cookies.token

  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      // Ignore invalid/expired tokens here — this route works for guests too.
    }
  }

  next()
}
