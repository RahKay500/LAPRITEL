import express from 'express'
import { body, validationResult } from 'express-validator'
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
} from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimiter.js'

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
    body('fullName').isString().trim().notEmpty(),
    body('email').isEmail(),
    body('phone').isString().trim().notEmpty(),
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

router.get('/me', requireAuth, getMe)

router.patch(
  '/me',
  requireAuth,
  [body('fullName').isString().trim().notEmpty(), body('phone').isString().trim().notEmpty()],
  validate,
  updateProfile
)

export default router
