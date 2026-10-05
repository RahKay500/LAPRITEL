import express from 'express'
import { body, query, validationResult } from 'express-validator'
import { requireAuth } from '../middleware/auth.js'
import { getProductReviews, getMyReviews, submitReview } from '../controllers/reviewsController.js'

const router = express.Router()

function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid input', errors: errors.array() })
  }
  next()
}

router.get('/', [query('product').isString().trim().isLength({ max: 100 })], validate, getProductReviews)

router.get('/mine', requireAuth, getMyReviews)

router.post(
  '/',
  requireAuth,
  [
    body('orderReference').isString().trim().notEmpty(),
    body('colorSlug').isString().trim().notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('body').isString().trim().isLength({ min: 10, max: 1000 }),
  ],
  validate,
  submitReview
)

export default router
