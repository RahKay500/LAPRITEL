import express from 'express'
import { param, validationResult } from 'express-validator'
import { getOrder, getMyOrders } from '../controllers/orderController.js'
import { requireAuth, attachUserIfPresent } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, getMyOrders)

router.get(
  '/:reference',
  attachUserIfPresent,
  [param('reference').isString().trim().notEmpty()],
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid order reference' })
    }
    next()
  },
  getOrder
)

export default router
