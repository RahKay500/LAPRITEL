import express from 'express'
import { body, validationResult } from 'express-validator'
import { verifyPayment } from '../controllers/paymentController.js'
import { paymentLimiter } from '../middleware/rateLimiter.js'
import { attachUserIfPresent } from '../middleware/auth.js'
import { NAME_PATTERN, PHONE_PATTERN } from '../shared/validation.js'

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
    body('customer.fullName').isString().trim().matches(NAME_PATTERN),
    body('customer.email').isEmail(),
    body('customer.phone').isString().trim().matches(PHONE_PATTERN),
    body('customer.address').isString().trim().notEmpty(),
    body('customer.city').isString().trim().notEmpty(),
    body('customer.region').isString().trim().notEmpty(),
    body('customer.recipientName')
      .optional({ values: 'falsy' })
      .isString()
      .trim()
      .matches(NAME_PATTERN),
    body('customer.recipientPhone')
      .optional({ values: 'falsy' })
      .isString()
      .trim()
      .matches(PHONE_PATTERN),
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
