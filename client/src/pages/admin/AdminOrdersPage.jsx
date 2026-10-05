import { useEffect, useRef, useState } from 'react'
import { fetchAdminOrders, updateAdminOrderStatus, ORDER_STATUSES } from '../../services/admin'
import { isRiskyStatusChange } from './orderStatusRisk'

const PAGE_SIZE = 20
const PAID_ONLY_STATUSES = ['processing', 'shipped', 'delivered']
// Keeps requests from firing on every keystroke while still feeling instant.
const SEARCH_DEBOUNCE_MS = 350

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingReference, setUpdatingReference] = useState(null)
  const [statusError, setStatusError] = useState('')

  const [statusFilter, setStatusFilter] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const searchRef = useRef('')
  useEffect(() => {
    const id = setTimeout(() => {
      const next = searchInput.trim()
      if (next === searchRef.current) return
      searchRef.current = next
      setSearch(next)
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [searchInput])

  useEffect(() => {
    let ignore = false

    async function loadOrders() {
      setIsLoading(true)
      setError('')
      try {
        const data = await fetchAdminOrders({ status: statusFilter, search, page, limit: PAGE_SIZE })
        if (ignore) return
        setOrders(data.orders)
        setTotal(data.total)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadOrders()
    return () => {
      ignore = true
    }
  }, [statusFilter, search, page])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  async function handleStatusChange(order, status) {
    if (isRiskyStatusChange(order.status, status)) {
      const confirmed = window.confirm(
        `Change order ${order.reference} from "${order.status}" to "${status}"? This order was already marked "${order.status}" — double-check before continuing.`
      )
      if (!confirmed) return
    }

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by name, email, or order reference"
          className="min-w-[240px] flex-1 border border-black/15 px-3 py-2 text-sm outline-none focus:border-burgundy"
        />
        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value)
            setPage(1)
          }}
          className="rounded-full border border-black/15 px-3 py-2 text-sm capitalize outline-none focus:border-burgundy"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {statusError && <p className="text-sm text-burgundy">{statusError}</p>}

      {isLoading ? (
        <p className="text-ink/75">Loading orders...</p>
      ) : error ? (
        <p className="text-sm text-burgundy">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-ink/75">
          {statusFilter || search ? 'No orders match your filters.' : 'No orders yet.'}
        </p>
      ) : (
        <>
          {orders.map((order) => (
            <div key={order.id} className="border border-black/15 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink">Order {order.reference}</p>
                  <p className="text-xs text-ink/75">{formatDate(order.created_at)}</p>
                  <p className="mt-2 text-sm text-ink/85">{order.customer_name}</p>
                  {order.recipient_name && (
                    <p className="mt-1 text-xs text-ink/75">
                      Deliver to {order.recipient_name} · {order.recipient_phone}
                    </p>
                  )}
                  <p className="text-xs text-ink/75">
                    {order.customer_email} · {order.customer_phone}
                  </p>
                  <p className="mt-1 text-xs text-ink/75">
                    {order.delivery_address}, {order.delivery_city}, {order.delivery_region}
                  </p>
                </div>

                <label className="flex flex-col items-end gap-1 text-xs text-ink/75">
                  Status
                  <select
                    value={order.status}
                    disabled={updatingReference === order.reference}
                    onChange={(event) => handleStatusChange(order, event.target.value)}
                    className="rounded-full border border-black/15 px-3 py-1.5 text-sm capitalize outline-none focus:border-burgundy disabled:opacity-50"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option
                        key={status}
                        value={status}
                        disabled={order.status === 'pending' && PAID_ONLY_STATUSES.includes(status)}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 space-y-2 border-t border-black/15 pt-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-ink/85">
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

              <div className="mt-4 flex justify-between border-t border-black/15 pt-3 text-sm font-medium">
                <span className="text-ink">Total</span>
                <span className="text-burgundy">GHS {order.subtotal}</span>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="text-sm font-medium text-burgundy disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <p className="text-xs text-ink/75">
                Page {page} of {totalPages} &middot; {total} order{total === 1 ? '' : 's'}
              </p>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className="text-sm font-medium text-burgundy disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminOrdersPage
