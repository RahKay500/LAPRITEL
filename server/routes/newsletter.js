import express from 'express'
import { body, validationResult } from 'express-validator'
import { subscribe } from '../controllers/newsletterController.js'

const router = express.Router()

router.post(
  '/',
  [body('email').isString().trim().isEmail().isLength({ max: 254 })],
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Enter a valid email address.' })
    }
    next()
  },
  subscribe
)

export default router
