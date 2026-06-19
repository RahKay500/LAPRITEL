import express from 'express'
import { handleWebhook } from '../controllers/paymentController.js'

const router = express.Router()

// Mounted before the global express.json() middleware in index.js — Paystack's
// signature is computed over the exact raw request bytes, so the body must
// stay unparsed until after signature verification.
router.post('/', express.raw({ type: 'application/json' }), handleWebhook)

export default router
