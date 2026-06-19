import { ivyBagVariants } from '../data/ivyBagVariants.js'
import { verifyTransaction, isValidWebhookSignature } from '../utils/paystack.js'
import {
  createOrder,
  getOrderByReference,
  updateOrderStatusByReference,
} from '../models/orders.js'

function calculateExpectedAmount(items) {
  return items.reduce((total, item) => {
    const variant = ivyBagVariants.find((v) => v.slug === item.slug)
    if (!variant) {
      throw new Error(`Unknown product variant: ${item.slug}`)
    }
    return total + variant.price * item.quantity
  }, 0)
}

export async function verifyPayment(req, res) {
  const { reference, items, customer } = req.body

  let expectedAmount
  try {
    expectedAmount = calculateExpectedAmount(items)
  } catch (error) {
    return res.status(400).json({ verified: false, message: error.message })
  }

  let transaction
  try {
    transaction = await verifyTransaction(reference)
  } catch (error) {
    return res.status(400).json({ verified: false, message: error.message })
  }

  const paidAmount = transaction.amount / 100
  const isSuccessful = transaction.status === 'success'
  const isCorrectAmount = paidAmount === expectedAmount
  const isCorrectCurrency = transaction.currency === 'GHS'

  if (!isSuccessful || !isCorrectAmount || !isCorrectCurrency) {
    return res.status(400).json({
      verified: false,
      message: 'Payment could not be verified',
    })
  }

  const existingOrder = await getOrderByReference(reference)
  if (!existingOrder) {
    await createOrder({
      reference,
      status: 'paid',
      customer,
      subtotal: paidAmount,
      items,
      userId: req.user?.id,
    })
  }

  res.json({ verified: true, reference, amount: paidAmount })
}

export async function handleWebhook(req, res) {
  const signature = req.headers['x-paystack-signature']

  if (!isValidWebhookSignature(req.body, signature)) {
    return res.sendStatus(401)
  }

  const event = JSON.parse(req.body.toString('utf8'))

  if (event.event === 'charge.success') {
    const reference = event.data.reference
    const order = await getOrderByReference(reference)
    if (order) {
      await updateOrderStatusByReference(reference, 'paid')
    }
    console.log(`Paystack webhook: charge.success for ${reference}`)
  }

  res.sendStatus(200)
}
