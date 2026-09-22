import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { useWishlist } from '../context/useWishlist'
import { useCart } from '../context/useCart'
import { usePageMeta } from '../hooks/usePageMeta'
import ColorSwatch from '../components/ColorSwatch'

function WishlistPage() {
  usePageMeta('Your Wishlist', 'The bags and colors you have saved for later.')

  const { items, removeWishlist } = useWishlist()
  const { addItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="px-4 py-20 text-center sm:px-6 lg:px-12">
        <Heart size={40} strokeWidth={1.25} className="mx-auto text-burgundy/50" />
        <h1 className="mt-4 text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Your Wishlist
        </h1>
        <p className="mt-3 text-ink/70">
          Nothing saved yet — tap the heart on any bag to keep it here.
        </p>
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
          Your Wishlist
        </h1>

        <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
          {items.map((item) => (
            <div key={`${item.productSlug}-${item.slug}`} className="flex gap-4 py-6 sm:gap-6">
              <Link
                to={`/shop/${item.productSlug}?color=${item.slug}`}
                className="flex h-24 w-24 flex-none items-center justify-center overflow-hidden bg-burgundy-tint/40 sm:h-28 sm:w-28"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={`${item.productName} in ${item.name}`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <ColorSwatch hex={item.hex} className="h-10 w-10" />
                )}
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      to={`/shop/${item.productSlug}?color=${item.slug}`}
                      className="text-sm font-medium text-ink hover:text-burgundy"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-sm text-ink/60">{item.name}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove from wishlist"
                    onClick={() => removeWishlist(item.productSlug, item.slug)}
                    className="text-ink/50 hover:text-burgundy"
                  >
                    <Trash2 size={18} strokeWidth={1.5} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-lg font-extrabold text-burgundy">GHS {item.price}</p>
                  <button
                    type="button"
                    onClick={() => addItem(item, 1)}
                    className="rounded-full border-2 border-burgundy px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WishlistPage
