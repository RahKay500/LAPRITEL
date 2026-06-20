import express from 'express'
import { body, validationResult } from 'express-validator'
import { verifyPayment } from '../controllers/paymentController.js'
import { paymentLimiter } from '../middleware/rateLimiter.js'
import { attachUserIfPresent } from '../middleware/auth.js'

const router = express.Router()

router.post(
  '/verify',
  paymentLimiter,
  attachUserIfPresent,
  [
    body('reference').isString().trim().notEmpty(),
    body('items').isArray({ min: 1 }),
    body('items.*.slug').isString().notEmpty(),
    body('items.*.name').isString().notEmpty(),
    body('items.*.price').isFloat({ min: 0 }),
    body('items.*.quantity').isInt({ min: 1 }),
    body('customer.fullName').isString().trim().matches(/^[A-Za-z\s'-]+$/),
    body('customer.email').isEmail(),
    body('customer.phone').isString().trim().matches(/^[0-9]{10}$/),
    body('customer.address').isString().trim().notEmpty(),
    body('customer.city').isString().trim().notEmpty(),
    body('customer.region').isString().trim().notEmpty(),
  ],
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ verified: false, errors: errors.array() })
    }
    next()
  },
  verifyPayment
)

export default router
