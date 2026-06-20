import express from 'express'
import { body, validationResult } from 'express-validator'
import { submitContactMessage } from '../controllers/contactController.js'

const router = express.Router()

function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid input', errors: errors.array() })
  }
  next()
}

router.post(
  '/',
  [
    body('fullName').isString().trim().notEmpty().isLength({ max: 100 }),
    body('email').isEmail(),
    body('message').isString().trim().notEmpty().isLength({ max: 2000 }),
  ],
  validate,
  submitContactMessage
)

export default router
