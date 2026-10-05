import { createBuyRequest, getBuyRequestByToken, isBuyRequestOpen } from '../models/buyRequests.js'
import { verifyTransaction } from '../utils/paystack.js'
import { priceOrder, transactionMatches, fulfillBuyRequest } from './paymentController.js'

const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000

export async function createRequest(req, res) {
  const { items, requester } = req.body

  try {
    await priceOrder(items)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }

  const request = await createBuyRequest({
    items: items.map((item) => ({ slug: item.slug, quantity: Number(item.quantity) })),
    requester,
    expiresAt: new Date(Date.now() + EXPIRY_MS).toISOString(),
  })

  res.status(201).json({ token: request.token, expiresAt: request.expires_at })
}

export async function getRequest(req, res) {
  const request = await getBuyRequestByToken(req.params.token)
  if (!isBuyRequestOpen(request)) {
    return res.status(404).json({ message: 'This link is no longer available.' })
  }

  let priced
  try {
    priced = await priceOrder(request.items)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }

  res.json({
    requesterName: request.requester.fullName.split(' ')[0],
    items: priced.lines.map((line) => ({
      name: line.name,
      productName: line.productName,
      price: line.price,
      quantity: line.quantity,
    })),
    total: priced.subtotal,
    expiresAt: request.expires_at,
  })
}

export async function payRequest(req, res) {
  const { reference, payerEmail } = req.body
  const request = await getBuyRequestByToken(req.params.token)
  if (!isBuyRequestOpen(request)) {
    return res.status(404).json({ message: 'This link is no longer available.' })
  }

  let priced
  let transaction
  try {
    priced = await priceOrder(request.items)
    transaction = await verifyTransaction(reference)
  } catch (error) {
    return res.status(400).json({ verified: false, message: error.message })
  }

  if (!transactionMatches(transaction, priced.expectedChargePesewas, payerEmail)) {
    return res.status(400).json({ verified: false, message: 'Payment could not be verified' })
  }

  await fulfillBuyRequest(request, transaction)
  res.json({ verified: true, reference })
}
