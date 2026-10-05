import crypto from 'crypto'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getActiveVariantPriceMap: vi.fn(),
  getActiveVariantMetaMap: vi.fn(),
  getOrderByReference: vi.fn(),
  createOrder: vi.fn(),
  markOrderPaidIfPending: vi.fn(),
  getBuyRequestByToken: vi.fn(),
  isBuyRequestOpen: vi.fn(),
  markBuyRequestPaid: vi.fn(),
  sendOrderConfirmationEmail: vi.fn(),
  sendAdminOrderNotificationEmail: vi.fn(),
  verifyTransaction: vi.fn(),
}))

vi.mock('../models/products.js', () => ({
  getActiveVariantPriceMap: mocks.getActiveVariantPriceMap,
  getActiveVariantMetaMap: mocks.getActiveVariantMetaMap,
}))
vi.mock('../models/orders.js', () => ({
  getOrderByReference: mocks.getOrderByReference,
  createOrder: mocks.createOrder,
  markOrderPaidIfPending: mocks.markOrderPaidIfPending,
}))
vi.mock('../models/buyRequests.js', () => ({
  getBuyRequestByToken: mocks.getBuyRequestByToken,
  isBuyRequestOpen: mocks.isBuyRequestOpen,
  markBuyRequestPaid: mocks.markBuyRequestPaid,
}))
vi.mock('../utils/email.js', () => ({
  sendOrderConfirmationEmail: mocks.sendOrderConfirmationEmail,
  sendAdminOrderNotificationEmail: mocks.sendAdminOrderNotificationEmail,
}))
vi.mock('../utils/paystack.js', async (importOriginal) => ({
  ...(await importOriginal()),
  verifyTransaction: mocks.verifyTransaction,
}))

const {
  priceOrder,
  transactionMatches,
  fulfillOrder,
  handleWebhook,
} = await import('./paymentController.js')

const secret = 'test-secret-key'
const sign = (payload) => crypto.createHmac('sha512', secret).update(payload).digest('hex')

const customer = {
  fullName: 'Ama Mensah',
  email: 'ama@example.com',
  phone: '0241234567',
  address: '12 Osu Street',
  city: 'Accra',
  region: 'Greater Accra',
}

beforeEach(() => {
  vi.clearAllMocks()
  process.env.PAYSTACK_SECRET_KEY = secret
  mocks.getActiveVariantPriceMap.mockResolvedValue(new Map([['glanzy-pink', 800]]))
  mocks.getActiveVariantMetaMap.mockResolvedValue(
    new Map([['glanzy-pink', { colorName: 'Pink', productName: 'Bag Glanzy', isCustom: false }]])
  )
  mocks.getOrderByReference.mockResolvedValue(null)
  mocks.createOrder.mockResolvedValue({ id: 'order-1' })
  mocks.sendOrderConfirmationEmail.mockResolvedValue()
  mocks.sendAdminOrderNotificationEmail.mockResolvedValue()
})

describe('priceOrder', () => {
  it('prices every line from the server catalogue, ignoring any client price', async () => {
    const priced = await priceOrder([{ slug: 'glanzy-pink', quantity: 2, price: 1 }])

    expect(priced.subtotal).toBe(1600)
    expect(priced.expectedChargePesewas).toBe(160000)
    expect(priced.lines[0]).toMatchObject({ name: 'Pink', productName: 'Bag Glanzy', price: 800, quantity: 2 })
  })

  it('rejects a colour that is not in the catalogue', async () => {
    await expect(priceOrder([{ slug: 'not-a-colour', quantity: 1 }])).rejects.toThrow(
      'Unknown product variant: not-a-colour'
    )
  })
})

describe('transactionMatches', () => {
  const good = {
    status: 'success',
    amount: 80000,
    currency: 'GHS',
    customer: { email: 'ama@example.com' },
  }

  it('accepts a successful GHS payment for the right amount and payer', () => {
    expect(transactionMatches(good, 80000, 'AMA@example.com')).toBe(true)
  })

  it.each([
    ['failed status', { ...good, status: 'failed' }],
    ['wrong amount', { ...good, amount: 79999 }],
    ['wrong currency', { ...good, currency: 'USD' }],
    ['different payer', { ...good, customer: { email: 'someone@else.com' } }],
  ])('rejects a payment with %s', (_, transaction) => {
    expect(transactionMatches(transaction, 80000, 'ama@example.com')).toBe(false)
  })
})

describe('fulfillOrder', () => {
  it('creates the order with server prices', async () => {
    const priced = await priceOrder([{ slug: 'glanzy-pink', quantity: 1 }])
    await fulfillOrder({ reference: 'REF1', customer, priced, userId: null })

    expect(mocks.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({ reference: 'REF1', status: 'paid', subtotal: 800 })
    )
    expect(mocks.sendOrderConfirmationEmail).toHaveBeenCalledTimes(1)
  })

  it('does nothing when the order already exists', async () => {
    mocks.getOrderByReference.mockResolvedValue({ id: 'existing' })
    const priced = await priceOrder([{ slug: 'glanzy-pink', quantity: 1 }])
    await fulfillOrder({ reference: 'REF1', customer, priced, userId: null })

    expect(mocks.createOrder).not.toHaveBeenCalled()
    expect(mocks.sendOrderConfirmationEmail).not.toHaveBeenCalled()
  })

  it('sends no emails when another request created the order first', async () => {
    mocks.createOrder.mockResolvedValue(null)
    const priced = await priceOrder([{ slug: 'glanzy-pink', quantity: 1 }])
    await fulfillOrder({ reference: 'REF1', customer, priced, userId: null })

    expect(mocks.sendOrderConfirmationEmail).not.toHaveBeenCalled()
  })
})

describe('handleWebhook', () => {
  function webhookRequest(payload) {
    const body = Buffer.from(JSON.stringify(payload))
    return { body, headers: { 'x-paystack-signature': sign(body) } }
  }

  function response() {
    return { sendStatus: vi.fn() }
  }

  it('rejects a webhook with a bad signature without touching orders', async () => {
    const res = response()
    await handleWebhook(
      { body: Buffer.from('{}'), headers: { 'x-paystack-signature': 'bad' } },
      res
    )

    expect(res.sendStatus).toHaveBeenCalledWith(401)
    expect(mocks.createOrder).not.toHaveBeenCalled()
    expect(mocks.markOrderPaidIfPending).not.toHaveBeenCalled()
  })

  it('creates the order from the payment metadata when the amount matches', async () => {
    const payload = {
      event: 'charge.success',
      data: {
        reference: 'REF2',
        status: 'success',
        amount: 80000,
        currency: 'GHS',
        customer: { email: customer.email },
        metadata: { items: [{ slug: 'glanzy-pink', quantity: 1 }], customer },
      },
    }
    const res = response()
    await handleWebhook(webhookRequest(payload), res)

    expect(mocks.createOrder).toHaveBeenCalledWith(expect.objectContaining({ reference: 'REF2', subtotal: 800 }))
    expect(res.sendStatus).toHaveBeenCalledWith(200)
  })

  it('does not create an order when the paid amount is wrong', async () => {
    const payload = {
      event: 'charge.success',
      data: {
        reference: 'REF3',
        status: 'success',
        amount: 100,
        currency: 'GHS',
        customer: { email: customer.email },
        metadata: { items: [{ slug: 'glanzy-pink', quantity: 1 }], customer },
      },
    }
    await handleWebhook(webhookRequest(payload), response())

    expect(mocks.createOrder).not.toHaveBeenCalled()
  })
})
