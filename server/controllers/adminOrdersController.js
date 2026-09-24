import { getAllOrders, updateOrderStatusByReference } from '../models/orders.js'

export async function listOrders(req, res) {
  const { status, search, page, limit } = req.query
  const result = await getAllOrders({ status, search, page, limit })
  res.json(result)
}

export async function setOrderStatus(req, res) {
  const { reference } = req.params
  const { status } = req.body

  await updateOrderStatusByReference(reference, status)
  res.json({ message: 'Order status updated' })
}
