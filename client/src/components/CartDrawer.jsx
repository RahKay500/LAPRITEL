import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useCart } from '../context/useCart'

function CartDrawer() {
  const { items, removeItem, updateQuantity, subtotal, isDrawerOpen, closeDrawer } = useCart()

  useEffect(() => {
    if (!isDrawerOpen) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') closeDrawer()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen, closeDrawer])

  function handleDecrease(item) {
    if (item.quantity <= 1) return
    updateQuantity(item.key, item.quantity - 1)
  }

  function handleIncrease(item) {
    updateQuantity(item.key, item.quantity + 1)
  }

  return (
    <>
      <div
        aria-hidden="true"
        onClick={closeDrawer}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink">Your Cart</h2>
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeDrawer}
            className="text-ink hover:text-burgundy"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
            <p className="text-ink/70">Your cart is empty.</p>
            <button
              type="button"
              onClick={closeDrawer}
              className="mt-6 rounded-full border-2 border-burgundy px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-black/10 overflow-y-auto px-5">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4 py-5">
                  {item.image ? (
                    <div className="flex h-20 w-20 flex-none items-center justify-center bg-burgundy-tint/40">
                      <img
                        src={item.image}
                        alt={`${item.productName} in ${item.name}`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 flex-none items-center justify-center bg-burgundy-tint/40">
                      <span
                        className="block h-8 w-8 rounded-full border border-black/10"
                        style={{ background: item.hex }}
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
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
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 border border-black/10 px-2 py-1">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => handleDecrease(item)}
                          disabled={item.quantity <= 1}
                          className="text-ink disabled:text-ink/30"
                        >
                          <Minus size={13} strokeWidth={1.5} />
                        </button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => handleIncrease(item)}
                          className="text-ink hover:text-burgundy"
                        >
                          <Plus size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-sm font-extrabold text-burgundy">
                        GHS {item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-black/10 px-5 py-5">
              <div className="flex justify-between text-base">
                <span className="font-medium text-ink">Subtotal</span>
                <span className="text-xl font-extrabold text-burgundy">GHS {subtotal}</span>
              </div>
              <p className="mt-1 text-xs text-ink/50">
                A small payment processing fee is added at checkout.
              </p>
              <Link
                to="/checkout"
                onClick={closeDrawer}
                className="mt-4 block w-full rounded-full border-2 border-burgundy px-8 py-3 text-center text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="mt-3 block text-center text-xs font-semibold uppercase tracking-widest text-ink/60 underline-offset-4 hover:text-burgundy hover:underline"
              >
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CartDrawer
