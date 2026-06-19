import { getOrderByReference, getOrdersByUserId } from '../models/orders.js'

export async function getOrder(req, res) {
  const order = await getOrderByReference(req.params.reference)

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  res.json(order)
}

export async function getMyOrders(req, res) {
  const orders = await getOrdersByUserId(req.user.id)
  res.json(orders)
}
