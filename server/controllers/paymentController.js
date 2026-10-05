import { getActiveVariantPriceMap, getActiveVariantMetaMap } from '../models/products.js'
import { verifyTransaction, isValidWebhookSignature } from '../utils/paystack.js'
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from '../utils/email.js'
import { getBuyRequestByToken, isBuyRequestOpen, markBuyRequestPaid } from '../models/buyRequests.js'
import {
  createOrder,
  getOrderByReference,
  markOrderPaidIfPending,
} from '../models/orders.js'

export async function priceOrder(items) {
  const [priceMap, metaMap] = await Promise.all([getActiveVariantPriceMap(), getActiveVariantMetaMap()])

  let subtotalPesewas = 0
  const lines = items.map((item) => {
    const price = priceMap.get(item.slug)
    if (price === undefined) {
      throw new Error(`Unknown product variant: ${item.slug}`)
    }
    const quantity = Number(item.quantity)
    subtotalPesewas += Math.round(price * 100) * quantity

    const meta = metaMap.get(item.slug)
    return {
      slug: item.slug,
      name: meta.colorName,
      productName: meta.productName,
      isCustom: meta.isCustom,
      price,
      quantity,
    }
  })

  return {
    lines,
    subtotal: subtotalPesewas / 100,
    expectedChargePesewas: subtotalPesewas,
  }
}

export function transactionMatches(transaction, expectedChargePesewas, email) {
  return (
    transaction.status === 'success' &&
    transaction.amount === expectedChargePesewas &&
    transaction.currency === 'GHS' &&
    transaction.customer?.email?.toLowerCase() === email?.toLowerCase()
  )
}

export async function fulfillOrder({ reference, customer, priced, userId }) {
  if (await getOrderByReference(reference)) return

  const order = await createOrder({
    reference,
    status: 'paid',
    customer,
    subtotal: priced.subtotal,
    items: priced.lines,
    userId,
  })
  if (!order) return

  try {
    await sendOrderConfirmationEmail({ reference, customer, items: priced.lines, subtotal: priced.subtotal })
  } catch (emailError) {
    console.error('Failed to send order confirmation email:', emailError.message)
  }

  try {
    await sendAdminOrderNotificationEmail({ reference, customer, items: priced.lines, subtotal: priced.subtotal })
  } catch (emailError) {
    console.error('Failed to send admin order notification email:', emailError.message)
  }
}

export async function verifyPayment(req, res) {
  const { reference, items, customer } = req.body

  let priced
  try {
    priced = await priceOrder(items)
  } catch (error) {
    return res.status(400).json({ verified: false, message: error.message })
  }

  let transaction
  try {
    transaction = await verifyTransaction(reference)
  } catch (error) {
    return res.status(400).json({ verified: false, message: error.message })
  }

  if (!transactionMatches(transaction, priced.expectedChargePesewas, customer.email)) {
    return res.status(400).json({ verified: false, message: 'Payment could not be verified' })
  }

  await fulfillOrder({ reference, customer, priced, userId: req.user?.id })

  res.json({ verified: true, reference, amount: transaction.amount / 100 })
}

export async function handleWebhook(req, res) {
  const signature = req.headers['x-paystack-signature']

  if (!isValidWebhookSignature(req.body, signature)) {
    return res.sendStatus(401)
  }

  const event = JSON.parse(req.body.toString('utf8'))

  if (event.event === 'charge.success') {
    const data = event.data
    const reference = data.reference
    const { items, customer, buyRequestToken } = data.metadata || {}

    if (buyRequestToken) {
      await fulfillBuyRequestFromWebhook(buyRequestToken, data)
    }

    if (Array.isArray(items) && customer) {
      try {
        const priced = await priceOrder(items)
        if (transactionMatches(data, priced.expectedChargePesewas, customer.email)) {
          await fulfillOrder({ reference, customer, priced, userId: null })
        } else {
          console.error(`Paystack webhook: amount or customer mismatch for ${reference}`)
        }
      } catch (error) {
        console.error(`Paystack webhook: could not fulfil ${reference}:`, error.message)
      }
    }

    await markOrderPaidIfPending(reference)
    console.log(`Paystack webhook: charge.success for ${reference}`)
  }

  res.sendStatus(200)
}

export async function fulfillBuyRequest(request, transaction) {
  const priced = await priceOrder(request.items)
  if (!transactionMatches(transaction, priced.expectedChargePesewas, transaction.customer?.email)) {
    throw new Error('Buy request payment does not match the request total')
  }
  await fulfillOrder({
    reference: transaction.reference,
    customer: { ...request.requester, email: transaction.customer.email },
    priced,
    userId: null,
  })
  await markBuyRequestPaid(request.id)
}

async function fulfillBuyRequestFromWebhook(token, transaction) {
  const request = await getBuyRequestByToken(token)
  if (!isBuyRequestOpen(request)) return
  try {
    await fulfillBuyRequest(request, transaction)
  } catch (error) {
    console.error(`Paystack webhook: could not fulfil buy request ${token}:`, error.message)
  }
}
