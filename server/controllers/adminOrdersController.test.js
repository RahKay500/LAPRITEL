import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getOrderByReference: vi.fn(),
  updateOrderStatusByReference: vi.fn(),
  sendOrderStatusEmail: vi.fn(),
}))

vi.mock('../models/orders.js', () => ({
  getAllOrders: vi.fn(),
  getOrderByReference: mocks.getOrderByReference,
  updateOrderStatusByReference: mocks.updateOrderStatusByReference,
}))
vi.mock('../utils/email.js', () => ({ sendOrderStatusEmail: mocks.sendOrderStatusEmail }))

const { setOrderStatus } = await import('./adminOrdersController.js')

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

const req = (status) => ({ params: { reference: 'REF1' }, body: { status } })

beforeEach(() => {
  vi.clearAllMocks()
  mocks.updateOrderStatusByReference.mockResolvedValue()
  mocks.sendOrderStatusEmail.mockResolvedValue()
})

describe('setOrderStatus', () => {
  it('returns 404 for an unknown order', async () => {
    mocks.getOrderByReference.mockResolvedValue(null)
    const res = response()
    await setOrderStatus(req('processing'), res)

    expect(res.statusCode).toBe(404)
    expect(mocks.updateOrderStatusByReference).not.toHaveBeenCalled()
  })

  it.each(['processing', 'shipped', 'delivered'])(
    'blocks moving an unpaid order to %s',
    async (status) => {
      mocks.getOrderByReference.mockResolvedValue({ status: 'pending', customer_name: 'Ama Mensah', customer_email: 'a@b.co' })
      const res = response()
      await setOrderStatus(req(status), res)

      expect(res.statusCode).toBe(400)
      expect(mocks.updateOrderStatusByReference).not.toHaveBeenCalled()
      expect(mocks.sendOrderStatusEmail).not.toHaveBeenCalled()
    }
  )

  it('lets a paid order move to shipped and emails the customer', async () => {
    mocks.getOrderByReference.mockResolvedValue({ status: 'paid', customer_name: 'Ama Mensah', customer_email: 'a@b.co' })
    const res = response()
    await setOrderStatus(req('shipped'), res)

    expect(res.statusCode).toBe(200)
    expect(mocks.updateOrderStatusByReference).toHaveBeenCalledWith('REF1', 'shipped')
    expect(mocks.sendOrderStatusEmail).toHaveBeenCalledWith(
      expect.objectContaining({ reference: 'REF1', status: 'shipped' })
    )
  })

  it('still updates the order when the email fails to send', async () => {
    mocks.getOrderByReference.mockResolvedValue({ status: 'paid', customer_name: 'Ama Mensah', customer_email: 'a@b.co' })
    mocks.sendOrderStatusEmail.mockRejectedValue(new Error('SMTP down'))
    const res = response()
    await setOrderStatus(req('delivered'), res)

    expect(mocks.updateOrderStatusByReference).toHaveBeenCalledWith('REF1', 'delivered')
    expect(res.statusCode).toBe(200)
  })
})
