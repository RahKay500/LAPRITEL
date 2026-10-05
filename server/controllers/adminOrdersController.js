import { getAllOrders, getOrderByReference, updateOrderStatusByReference } from '../models/orders.js'
import { sendOrderStatusEmail } from '../utils/email.js'

const PAID_ONLY_STATUSES = ['processing', 'shipped', 'delivered']

export async function listOrders(req, res) {
  const { status, search, page, limit } = req.query
  const result = await getAllOrders({ status, search, page, limit })
  res.json(result)
}

export async function setOrderStatus(req, res) {
  const { reference } = req.params
  const { status } = req.body

  const order = await getOrderByReference(reference)
  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }
  if (order.status === 'pending' && PAID_ONLY_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Only paid orders can be processed, shipped or delivered.' })
  }

  await updateOrderStatusByReference(reference, status)

  try {
    await sendOrderStatusEmail({ reference, customer: { fullName: order.customer_name, email: order.customer_email }, status })
  } catch (emailError) {
    console.error('Failed to send order status email:', emailError.message)
  }
  res.json({ message: 'Order status updated' })
}
