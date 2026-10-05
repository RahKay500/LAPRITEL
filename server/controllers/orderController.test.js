import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ getOrderByReference: vi.fn() }))

vi.mock('../models/orders.js', () => ({
  getOrderByReference: mocks.getOrderByReference,
  getOrdersByUserId: vi.fn(),
}))

const { getOrder } = await import('./orderController.js')

function response() {
  const res = { statusCode: 200, body: null }
  res.status = (code) => {
    res.statusCode = code
    return res
  }
  res.json = (body) => {
    res.body = body
    return res
  }
  return res
}

const order = {
  id: 'o1',
  reference: 'REF1',
  status: 'shipped',
  subtotal: 800,
  created_at: '2026-10-05T00:00:00Z',
  items: [{ product_name: 'Bag Glanzy', color_name: 'Pink', quantity: 1, line_total: 800 }],
  user_id: 'owner-1',
  customer_name: 'Ama Mensah',
  customer_email: 'ama@example.com',
  customer_phone: '0241234567',
  delivery_address: '12 Osu Street',
  delivery_city: 'Accra',
  delivery_region: 'Greater Accra',
  delivery_notes: 'Leave with the guard',
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.getOrderByReference.mockResolvedValue(order)
})

describe('getOrder', () => {
  it('returns 404 for an unknown reference', async () => {
    mocks.getOrderByReference.mockResolvedValue(null)
    const res = response()
    await getOrder({ params: { reference: 'nope' }, user: null }, res)

    expect(res.statusCode).toBe(404)
  })

  it('hides personal details from someone who is not the owner', async () => {
    const res = response()
    await getOrder({ params: { reference: 'REF1' }, user: null }, res)

    expect(res.body).toEqual({
      id: 'o1',
      reference: 'REF1',
      status: 'shipped',
      subtotal: 800,
      created_at: '2026-10-05T00:00:00Z',
      items: order.items,
    })
    expect(res.body).not.toHaveProperty('customer_email')
    expect(res.body).not.toHaveProperty('delivery_address')
  })

  it('returns the full order to its owner', async () => {
    const res = response()
    await getOrder({ params: { reference: 'REF1' }, user: { id: 'owner-1' } }, res)

    expect(res.body).toEqual(order)
  })

  it('hides personal details from a different logged-in user', async () => {
    const res = response()
    await getOrder({ params: { reference: 'REF1' }, user: { id: 'someone-else' } }, res)

    expect(res.body).not.toHaveProperty('customer_name')
  })
})
