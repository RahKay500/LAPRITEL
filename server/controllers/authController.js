import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase.js'
import { supabaseAuth } from '../config/supabaseAuth.js'
import {
  createResetToken,
  findValidResetToken,
  invalidateResetTokensForUser,
} from '../models/passwordResetTokens.js'
import { sendPasswordResetEmail } from '../utils/email.js'

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name || '',
      phone: user.user_metadata?.phone || '',
      role: user.app_metadata?.role || 'customer',
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
  })
}

function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.user_metadata?.full_name || '',
    phone: user.user_metadata?.phone || '',
    role: user.app_metadata?.role || 'customer',
  }
}

export async function register(req, res) {
  const { fullName, email, phone, password } = req.body

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone },
  })

  if (error) {
    const status = error.status === 422 ? 409 : 400
    return res.status(status).json({ message: error.message })
  }

  const token = signToken(data.user)
  setAuthCookie(res, token)
  res.status(201).json({ user: toPublicUser(data.user) })
}

export async function login(req, res) {
  const { email, password } = req.body

  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const token = signToken(data.user)
  setAuthCookie(res, token)
  res.json({ user: toPublicUser(data.user) })
}

export function logout(req, res) {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
}

export async function getMe(req, res) {
  if (!req.user) {
    return res.json({ user: null })
  }

  const { data, error } = await supabase.auth.admin.getUserById(req.user.id)

  if (error || !data.user) {
    return res.json({ user: null })
  }

  res.json({ user: toPublicUser(data.user) })
}

export async function requestPasswordReset(req, res) {
  const { email } = req.body
  const genericResponse = {
    message: "If an account exists for that email, we've sent a reset link.",
  }

  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) {
    throw new Error(`Failed to look up user: ${error.message}`)
  }

  const user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
  if (!user) {
    return res.json(genericResponse)
  }

  const rawToken = await createResetToken(user.id)
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`

  // Don't make the user wait on SMTP latency for what should be an instant
  // "check your email" response — send in the background, best-effort.
  sendPasswordResetEmail({
    email: user.email,
    fullName: user.user_metadata?.full_name || '',
    resetUrl,
  }).catch((emailError) => {
    console.error('Failed to send password reset email:', emailError.message)
  })

  res.json(genericResponse)
}

export async function resetPassword(req, res) {
  const { token, password } = req.body

  const resetToken = await findValidResetToken(token)
  if (!resetToken) {
    return res.status(400).json({ message: 'This reset link is invalid or has expired.' })
  }

  const { error } = await supabase.auth.admin.updateUserById(resetToken.user_id, { password })
  if (error) {
    return res.status(400).json({ message: error.message })
  }

  await invalidateResetTokensForUser(resetToken.user_id)
  res.json({ message: 'Password updated. You can now log in.' })
}

export async function updateProfile(req, res) {
  const { fullName, phone } = req.body

  const { data, error } = await supabase.auth.admin.updateUserById(req.user.id, {
    user_metadata: { full_name: fullName, phone },
  })

  if (error) {
    return res.status(400).json({ message: error.message })
  }

  const token = signToken(data.user)
  setAuthCookie(res, token)
  res.json({ user: toPublicUser(data.user) })
}
