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
    if (orderError.code === '23505') return null
    throw new Error(`Failed to create order: ${orderError.message}`)
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_name: item.productName,
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

export async function getAllOrders({ status, search, page = 1, limit = 20 } = {}) {
  let query = supabase
    .from('orders')
    .select('*, order_items(*)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  if (search) {
    // Escape PostgREST pattern/filter-syntax characters so search text is
    // matched literally rather than as a wildcard or breaking the .or() list.
    const escaped = search.replace(/[%_,()]/g, (char) => `\\${char}`)
    query = query.or(
      `reference.ilike.%${escaped}%,customer_name.ilike.%${escaped}%,customer_email.ilike.%${escaped}%`
    )
  }

  const from = (page - 1) * limit
  const to = from + limit - 1
  const { data: orders, error, count } = await query.range(from, to)

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`)
  }

  return { orders, total: count }
}

export async function markOrderPaidIfPending(reference) {
  const { error } = await supabase
    .from('orders')
    .update({ status: 'paid' })
    .eq('reference', reference)
    .eq('status', 'pending')

  if (error) {
    throw new Error(`Failed to mark order paid: ${error.message}`)
  }
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
