import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { usePageMeta } from '../hooks/usePageMeta'

function MyOrdersPage() {
  usePageMeta('My Orders', 'View your past LAPRITEL orders and their status.')

  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/orders')
      .then(setOrders)
      .catch(() => setError('We could not load your orders.'))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="px-4 py-20 text-center sm:px-6 lg:px-12">
        <p className="text-ink/60">Loading your orders...</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">My Orders</h1>

        {error && <p className="mt-4 text-sm text-burgundy">{error}</p>}

        {!error && orders.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-ink/70">You haven't placed any orders yet.</p>
            <Link
              to="/shop"
              className="mt-6 inline-block rounded-full border-2 border-burgundy px-8 py-3 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white"
            >
              Shop the Ivy Bag
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-black/10 p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-ink">
                      Order {order.reference}
                    </p>
                    <p className="text-xs text-ink/60">
                      {new Date(order.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className="rounded-full bg-burgundy-tint px-3 py-1 text-xs font-medium capitalize text-burgundy">
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-ink/70">
                        {item.product_name} ({item.color_name}) x{item.quantity}
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
        )}
      </div>
    </div>
  )
}

export default MyOrdersPage
