import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../services/api'

function OrderConfirmationPage() {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference')
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(reference))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!reference) return

    api
      .get(`/orders/${reference}`)
      .then(setOrder)
      .catch(() => setError('We could not find this order.'))
      .finally(() => setIsLoading(false))
  }, [reference])

  if (isLoading) {
    return (
      <div className="px-4 py-20 text-center sm:px-6 lg:px-12">
        <p className="text-ink/60">Loading your order...</p>
      </div>
    )
  }

  if (!order || error) {
    return (
      <div className="px-4 py-20 text-center sm:px-6 lg:px-12">
        <h1 className="font-heading text-3xl text-ink sm:text-4xl">
          No order found
        </h1>
        <p className="mt-3 text-ink/70">
          {error || "We couldn't find an order to show here."}
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-block rounded-full bg-burgundy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 py-12 text-center sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-xl">
        <h1 className="font-heading text-3xl text-ink sm:text-4xl">
          Thank You, {order.customer_name.split(' ')[0]}!
        </h1>
        <p className="mt-3 text-ink/70">
          Your order has been received and is being prepared.
        </p>
        <p className="mt-4 text-sm text-ink/60">
          Order Reference: <span className="font-medium text-ink">{order.reference}</span>
        </p>

        <div className="mt-8 rounded-2xl border border-black/10 p-6 text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">
            Order Summary
          </h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-ink/70">
                  {item.product_name} ({item.color_name}) x{item.quantity}
                </span>
                <span className="text-ink">GHS {item.line_total}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-black/10 pt-4 text-base">
            <span className="font-medium text-ink">Total</span>
            <span className="font-heading text-xl text-burgundy">
              GHS {order.subtotal}
            </span>
          </div>
        </div>

        <p className="mt-6 text-sm text-ink/60">
          We'll deliver to {order.delivery_address}, {order.delivery_city},{' '}
          {order.delivery_region}.
        </p>

        <Link
          to="/shop"
          className="mt-8 inline-block rounded-full bg-burgundy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default OrderConfirmationPage
