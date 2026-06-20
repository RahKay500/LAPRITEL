import { getActiveVariantPriceMap } from '../models/products.js'
import { verifyTransaction, isValidWebhookSignature } from '../utils/paystack.js'
import { grossUpForPaystackFee } from '../utils/pricing.js'
import { sendOrderConfirmationEmail } from '../utils/email.js'
import {
  createOrder,
  getOrderByReference,
  updateOrderStatusByReference,
} from '../models/orders.js'

async function calculateExpectedAmounts(items) {
  const priceMap = await getActiveVariantPriceMap()

  const subtotalPesewas = items.reduce((total, item) => {
    const price = priceMap.get(item.slug)
    if (price === undefined) {
      throw new Error(`Unknown product variant: ${item.slug}`)
    }
    return total + Math.round(price * 100) * item.quantity
  }, 0)

  return {
    subtotal: subtotalPesewas / 100,
    expectedChargePesewas: grossUpForPaystackFee(subtotalPesewas),
  }
}

export async function verifyPayment(req, res) {
  const { reference, items, customer } = req.body

  let subtotal
  let expectedChargePesewas
  try {
    ;({ subtotal, expectedChargePesewas } = await calculateExpectedAmounts(items))
  } catch (error) {
    return res.status(400).json({ verified: false, message: error.message })
  }

  let transaction
  try {
    transaction = await verifyTransaction(reference)
  } catch (error) {
    return res.status(400).json({ verified: false, message: error.message })
  }

  const isSuccessful = transaction.status === 'success'
  const isCorrectAmount = transaction.amount === expectedChargePesewas
  const isCorrectCurrency = transaction.currency === 'GHS'
  // Without this, an attacker could pay for their own order, then submit an
  // arbitrary customer object (any recipient email, unescaped HTML in
  // address/name fields) — sending a spoofed "order confirmed" email from
  // our own SMTP sender to a victim of their choosing.
  const isCorrectCustomer =
    transaction.customer?.email?.toLowerCase() === customer.email?.toLowerCase()

  if (!isSuccessful || !isCorrectAmount || !isCorrectCurrency || !isCorrectCustomer) {
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
      subtotal,
      items,
      userId: req.user?.id,
    })

    try {
      await sendOrderConfirmationEmail({ reference, customer, items, subtotal })
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError.message)
    }
  }

  res.json({ verified: true, reference, amount: transaction.amount / 100 })
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
