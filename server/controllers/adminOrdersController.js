import { getAllOrders, updateOrderStatusByReference } from '../models/orders.js'

export async function listOrders(req, res) {
  const orders = await getAllOrders()
  res.json(orders)
}

export async function setOrderStatus(req, res) {
  const { reference } = req.params
  const { status } = req.body

  await updateOrderStatusByReference(reference, status)
  res.json({ message: 'Order status updated' })
}
