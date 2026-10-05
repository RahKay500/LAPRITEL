import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase.js'

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

export function requireAdmin(req, res, next) {
  requireAuth(req, res, async () => {
    const { data, error } = await supabase.auth.admin.getUserById(req.user.id)
    if (error || data.user?.app_metadata?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    next()
  })
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
