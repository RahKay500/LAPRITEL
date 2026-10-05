import express from 'express'
import { body, validationResult } from 'express-validator'
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  requestPasswordReset,
  resetPassword,
} from '../controllers/authController.js'
import { requireAuth, attachUserIfPresent } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { NAME_PATTERN, PHONE_PATTERN } from '../shared/validation.js'

const router = express.Router()

function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid input', errors: errors.array() })
  }
  next()
}

router.post(
  '/register',
  authLimiter,
  [
    body('fullName').isString().trim().matches(NAME_PATTERN),
    body('email').isEmail(),
    body('phone').isString().trim().matches(PHONE_PATTERN),
    body('password').isString().isLength({ min: 8 }),
  ],
  validate,
  register
)

router.post(
  '/login',
  authLimiter,
  [body('email').isEmail(), body('password').isString().notEmpty()],
  validate,
  login
)

router.post('/logout', logout)

router.post(
  '/forgot-password',
  authLimiter,
  [body('email').isEmail()],
  validate,
  requestPasswordReset
)

router.post(
  '/reset-password',
  authLimiter,
  [body('token').isString().trim().notEmpty(), body('password').isString().isLength({ min: 8 })],
  validate,
  resetPassword
)

router.get('/me', attachUserIfPresent, getMe)

router.patch(
  '/me',
  requireAuth,
  [
    body('fullName').isString().trim().matches(NAME_PATTERN),
    body('phone').isString().trim().matches(PHONE_PATTERN),
  ],
  validate,
  updateProfile
)

export default router
