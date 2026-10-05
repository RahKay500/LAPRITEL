import express from 'express'
import { body, param, validationResult } from 'express-validator'
import { createRequest, getRequest, payRequest } from '../controllers/buyRequestsController.js'
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
  '/',
  [
    body('items').isArray({ min: 1 }),
    body('items.*.slug').isString().notEmpty(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('requester.fullName').isString().trim().matches(NAME_PATTERN),
    body('requester.email').isEmail(),
    body('requester.phone').isString().trim().matches(PHONE_PATTERN),
    body('requester.address').isString().trim().notEmpty(),
    body('requester.city').isString().trim().notEmpty(),
    body('requester.region').isString().trim().notEmpty(),
  ],
  validate,
  createRequest
)

router.get('/:token', [param('token').isString().isLength({ min: 10, max: 100 })], validate, getRequest)

router.post(
  '/:token/pay',
  [
    param('token').isString().isLength({ min: 10, max: 100 }),
    body('reference').isString().trim().notEmpty(),
    body('payerEmail').isEmail(),
  ],
  validate,
  payRequest
)

export default router
