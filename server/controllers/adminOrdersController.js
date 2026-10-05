import { getAllOrders, getOrderByReference, updateOrderStatusByReference } from '../models/orders.js'

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
  res.json({ message: 'Order status updated' })
}
