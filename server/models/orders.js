import { supabase } from '../config/supabase.js'

export async function createOrder({ reference, status, customer, subtotal, items, userId }) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      reference,
      status,
      user_id: userId || null,
      customer_name: customer.fullName,
      customer_email: customer.email,
      customer_phone: customer.phone,
      delivery_address: customer.address,
      delivery_city: customer.city,
      delivery_region: customer.region,
      delivery_notes: customer.notes || null,
      subtotal,
    })
    .select()
    .single()

  if (orderError) {
    throw new Error(`Failed to create order: ${orderError.message}`)
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_name: item.productName || 'Bag Ivy',
    color_slug: item.slug,
    color_name: item.name,
    is_custom: item.isCustom || false,
    unit_price: item.price,
    quantity: item.quantity,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

  if (itemsError) {
    throw new Error(`Failed to create order items: ${itemsError.message}`)
  }

  return order
}

export async function getOrderByReference(reference) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('reference', reference)
    .single()

  if (orderError || !order) {
    return null
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id)

  if (itemsError) {
    throw new Error(`Failed to fetch order items: ${itemsError.message}`)
  }

  return { ...order, items }
}

export async function getOrdersByUserId(userId) {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`)
  }

  return orders
}

export async function getAllOrders() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`)
  }

  return orders
}

export async function updateOrderStatusByReference(reference, status) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('reference', reference)

  if (error) {
    throw new Error(`Failed to update order status: ${error.message}`)
  }
}
