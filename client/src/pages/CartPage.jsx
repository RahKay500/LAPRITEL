import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/useCart'
import { usePageMeta } from '../hooks/usePageMeta'
import ColorSwatch from '../components/ColorSwatch'

function CartPage() {
  usePageMeta('Your Cart', 'Review the items in your cart before checking out.')

  const { items, removeItem, updateQuantity, subtotal } = useCart()

  function handleDecrease(item) {
    if (item.quantity <= 1) return
    updateQuantity(item.key, item.quantity - 1)
  }

  function handleIncrease(item) {
    updateQuantity(item.key, item.quantity + 1)
  }

  if (items.length === 0) {
    return (
      <div className="px-4 py-20 text-center sm:px-6 lg:px-12">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Your Cart
        </h1>
        <p className="mt-3 text-ink/70">Your cart is empty.</p>
        <Link
          to="/shop"
          className="mt-8 inline-block rounded-full border-2 border-burgundy px-8 py-3 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Your Cart
        </h1>

        <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
          {items.map((item) => (
            <div key={item.key} className="flex gap-4 py-6 sm:gap-6">
              {item.image ? (
                <div className="flex h-24 w-24 flex-none items-center justify-center bg-burgundy-tint/40 sm:h-28 sm:w-28">
                  <img
                    src={item.image}
                    alt={`${item.productName} in ${item.name}`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className="flex h-24 w-24 flex-none items-center justify-center bg-burgundy-tint/40 sm:h-28 sm:w-28">
                  <ColorSwatch
                    hex={item.hex}
                    topHex={item.topHex}
                    bottomHex={item.bottomHex}
                    isTwoTone={item.isTwoTone}
                    className="h-10 w-10"
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-ink">{item.productName}</p>
                    <p className="text-sm text-ink/60">{item.name}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeItem(item.key)}
                    className="text-ink/50 hover:text-burgundy"
                  >
                    <Trash2 size={18} strokeWidth={1.5} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-full border border-black/10 px-3 py-1.5">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => handleDecrease(item)}
                      disabled={item.quantity <= 1}
                      className="text-ink disabled:text-ink/30"
                    >
                      <Minus size={14} strokeWidth={1.5} />
                    </button>
                    <span className="w-4 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => handleIncrease(item)}
                      className="text-ink hover:text-burgundy"
                    >
                      <Plus size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                  <p className="text-lg font-extrabold text-burgundy">
                    GHS {item.price * item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:items-end">
          <div className="flex w-full justify-between text-base sm:max-w-sm">
            <span className="font-medium text-ink">Subtotal</span>
            <span className="text-xl font-extrabold text-burgundy">
              GHS {subtotal}
            </span>
          </div>
          <p className="-mt-2 w-full text-right text-xs text-ink/50 sm:max-w-sm">
            A small payment processing fee is added at checkout.
          </p>
          <Link
            to="/checkout"
            className="w-full rounded-full border-2 border-burgundy px-8 py-3 text-center text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white sm:max-w-sm"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CartPage
