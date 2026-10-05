import { getOrderByReference, getOrdersByUserId } from '../models/orders.js'

const PUBLIC_FIELDS = ['id', 'reference', 'status', 'subtotal', 'created_at', 'items']

function toPublicOrder(order) {
  return Object.fromEntries(PUBLIC_FIELDS.map((field) => [field, order[field]]))
}

export async function getOrder(req, res) {
  const order = await getOrderByReference(req.params.reference)

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  const isOwner = Boolean(req.user) && order.user_id === req.user.id
  res.json(isOwner ? order : toPublicOrder(order))
}

export async function getMyOrders(req, res) {
  const orders = await getOrdersByUserId(req.user.id)
  res.json(orders)
}
