import { useEffect, useState } from 'react'
import { fetchAdminOrders, updateAdminOrderStatus, ORDER_STATUSES } from '../../services/admin'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingReference, setUpdatingReference] = useState(null)
  const [statusError, setStatusError] = useState('')

  useEffect(() => {
    fetchAdminOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  async function handleStatusChange(order, status) {
    setStatusError('')
    setUpdatingReference(order.reference)
    try {
      await updateAdminOrderStatus(order.reference, status)
      setOrders((current) =>
        current.map((item) => (item.reference === order.reference ? { ...item, status } : item))
      )
    } catch (err) {
      setStatusError(err.message)
    } finally {
      setUpdatingReference(null)
    }
  }

  if (isLoading) return <p className="text-ink/60">Loading orders...</p>
  if (error) return <p className="text-sm text-burgundy">{error}</p>
  if (orders.length === 0) return <p className="text-ink/60">No orders yet.</p>

  return (
    <div className="space-y-4">
      {statusError && <p className="text-sm text-burgundy">{statusError}</p>}

      {orders.map((order) => (
        <div key={order.id} className="border border-black/10 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">Order {order.reference}</p>
              <p className="text-xs text-ink/60">{formatDate(order.created_at)}</p>
              <p className="mt-2 text-sm text-ink/70">{order.customer_name}</p>
              <p className="text-xs text-ink/60">
                {order.customer_email} · {order.customer_phone}
              </p>
              <p className="mt-1 text-xs text-ink/60">
                {order.delivery_address}, {order.delivery_city}, {order.delivery_region}
              </p>
            </div>

            <label className="flex flex-col items-end gap-1 text-xs text-ink/60">
              Status
              <select
                value={order.status}
                disabled={updatingReference === order.reference}
                onChange={(event) => handleStatusChange(order, event.target.value)}
                className="rounded-full border border-black/10 px-3 py-1.5 text-sm capitalize outline-none focus:border-burgundy disabled:opacity-50"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 space-y-2 border-t border-black/10 pt-4">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-ink/70">
                  {item.product_name} ({item.color_name}) x{item.quantity}
                  {item.is_custom && (
                    <span className="rounded-full border border-burgundy px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-burgundy">
                      Custom
                    </span>
                  )}
                </span>
                <span className="text-ink">GHS {item.line_total}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between border-t border-black/10 pt-3 text-sm font-medium">
            <span className="text-ink">Total</span>
            <span className="text-burgundy">GHS {order.subtotal}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminOrdersPage
