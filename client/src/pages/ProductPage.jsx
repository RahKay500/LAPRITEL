import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useIvyBagVariants } from '../hooks/useIvyBagVariants'
import { useCart } from '../context/useCart'

function ProductPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const colorParam = searchParams.get('color')
  const { product, variants: ivyBagVariants, isLoading, error } = useIvyBagVariants()
  const selectedVariant =
    ivyBagVariants.find((variant) => variant.slug === colorParam) || ivyBagVariants[0]

  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const [isCareOpen, setIsCareOpen] = useState(false)

  function selectColor(slug) {
    setSearchParams({ color: slug })
  }

  function handleAddToCart() {
    addItem(selectedVariant)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  if (isLoading) {
    return (
      <div className="px-4 py-12 text-center text-ink/60 sm:px-6 lg:px-12 lg:py-16">
        Loading product…
      </div>
    )
  }

  if (error || !product || !selectedVariant) {
    return (
      <div className="px-4 py-12 text-center text-ink/60 sm:px-6 lg:px-12 lg:py-16">
        We couldn't load this product right now. Please try again shortly.
      </div>
    )
  }

  const relatedVariants = ivyBagVariants.filter(
    (variant) => variant.slug !== selectedVariant.slug
  )

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link to="/shop" className="text-sm text-ink/60 hover:text-burgundy">
          ← Back to Shop
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {selectedVariant.image ? (
            <div className="aspect-[9/16] w-full overflow-hidden rounded-2xl bg-burgundy-tint">
              <img
                src={selectedVariant.image}
                alt={`${product.name} in ${selectedVariant.name}`}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-burgundy-tint">
              <div className="text-center">
                <span
                  className="mx-auto block h-20 w-20 rounded-full border border-black/10"
                  style={{ backgroundColor: selectedVariant.hex }}
                />
                <p className="mt-4 text-sm text-ink/50">Photo coming soon</p>
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-burgundy">
              {product.name}
            </p>
            <h1 className="mt-2 font-heading text-3xl text-ink sm:text-4xl">
              {selectedVariant.name}
            </h1>
            <p className="mt-3 font-heading text-2xl text-burgundy">
              GHS {selectedVariant.price}
            </p>

            <p className="mt-6 max-w-md text-ink/70">{product.description}</p>

            <div className="mt-8">
              <p className="text-sm font-medium text-ink">
                Color: <span className="font-semibold">{selectedVariant.name}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ivyBagVariants.map((variant) => (
                  <button
                    key={variant.slug}
                    type="button"
                    aria-label={variant.name}
                    onClick={() => selectColor(variant.slug)}
                    className={`h-9 w-9 rounded-full border-2 transition-colors ${
                      variant.slug === selectedVariant.slug
                        ? 'border-burgundy'
                        : 'border-transparent hover:border-black/20'
                    }`}
                  >
                    <span
                      className="block h-full w-full rounded-full border border-black/10"
                      style={{ backgroundColor: variant.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-burgundy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90 sm:w-auto"
            >
              {isAdded ? (
                <>
                  <Check size={16} strokeWidth={2} />
                  Added to Cart
                </>
              ) : (
                'Add to Cart'
              )}
            </button>

            <div className="mt-10 border-t border-black/10 pt-4">
              <button
                type="button"
                onClick={() => setIsCareOpen((open) => !open)}
                className="flex w-full items-center justify-between text-left text-sm font-semibold text-ink"
              >
                Size & Care
                {isCareOpen ? (
                  <ChevronUp size={16} strokeWidth={1.5} />
                ) : (
                  <ChevronDown size={16} strokeWidth={1.5} />
                )}
              </button>
              {isCareOpen && (
                <div className="mt-3 space-y-2 text-sm text-ink/70">
                  <p>Approx. 22cm wide x 18cm tall, with a 15cm handle drop.</p>
                  <p>
                    Wipe clean with a soft, dry cloth. Avoid water, perfume,
                    and direct sunlight for extended periods to preserve the
                    beadwork.
                  </p>
                  <p>Store in the provided pouch when not in use.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="font-heading text-2xl text-ink sm:text-3xl">
            More Colorways
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
            {relatedVariants.map((variant) => (
              <Link
                key={variant.slug}
                to={`/shop/ivy-bag?color=${variant.slug}`}
                className="rounded-2xl bg-white p-2 shadow-sm transition-shadow hover:shadow-md"
              >
                {variant.image ? (
                  <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-burgundy-tint/40 p-1">
                    <img
                      src={variant.image}
                      alt={`${product.name} in ${variant.name}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-burgundy-tint/40">
                    <span
                      className="block h-10 w-10 rounded-full border border-black/10"
                      style={{ backgroundColor: variant.hex }}
                    />
                  </div>
                )}
                <p className="mt-2 text-center text-xs font-medium text-ink">
                  {variant.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
