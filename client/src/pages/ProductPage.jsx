import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Check, ChevronDown, ChevronUp, Heart, Minus, Plus } from 'lucide-react'
import { useProductVariants } from '../hooks/useProductVariants'
import { useCart } from '../context/useCart'
import { usePageMeta } from '../hooks/usePageMeta'

const SPECS = [
  { label: 'Style', value: 'Structured beaded handbag' },
  { label: 'Beadwork', value: 'Full coverage seed beads, hand-stitched' },
  { label: 'Dimensions', value: '22 cm × 18 cm × 8 cm' },
  { label: 'Closure', value: 'Magnetic snap clasp with beaded tab' },
  { label: 'Lining', value: 'Satin interior with zip pocket' },
  { label: 'Carry', value: 'Top handle, 15 cm drop' },
]

function ProductPage() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const colorParam = searchParams.get('color')
  const { product, variants: allVariants, isLoading, error } = useProductVariants(slug)
  const standardVariants = allVariants.filter((variant) => !variant.isCustom)
  const customVariants = allVariants.filter((variant) => variant.isCustom)
  const hasColorChoice = standardVariants.length > 1 || customVariants.length > 0
  const selectedVariant =
    allVariants.find((variant) => variant.slug === colorParam) || standardVariants[0]
  const displayName = product?.name.replace(/^The /i, '') || ''

  usePageMeta(
    product && selectedVariant
      ? hasColorChoice
        ? `${displayName} — ${selectedVariant.name}`
        : displayName
      : product?.name,
    product?.description
  )

  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const [isCareOpen, setIsCareOpen] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (window.location.hash === '#custom-colors' && customVariants.length > 0) {
      document.getElementById('custom-colors')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [customVariants.length])

  function selectColor(slug) {
    setSearchParams({ color: slug })
    setQuantity(1)
  }

  function handleAddToCart() {
    addItem(selectedVariant, quantity)
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

  const relatedVariants = standardVariants.filter(
    (variant) => variant.slug !== selectedVariant.slug
  )
  const seasonYear = new Date().getFullYear()

  return (
    <div className="bg-burgundy-tint/30">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-12 lg:py-16">
        <Link to="/shop" className="text-sm text-ink/60 hover:text-burgundy">
          ← Back to Shop
        </Link>

        <div className="mt-6 flex gap-6 lg:gap-10">
          <div className="hidden shrink-0 flex-col items-center lg:flex">
            <p className="[writing-mode:vertical-rl] text-[11px] font-semibold uppercase tracking-[0.25em] text-burgundy/70">
              New Season &mdash; {seasonYear}
            </p>
            <span className="mt-3 w-px flex-1 bg-black/10" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl">
              {(() => {
                const words = displayName.split(' ')
                const lastWord = words.pop()
                const restName = words.join(' ')
                return (
                  <>
                    {restName && (
                      <>
                        {restName}
                        <br />
                      </>
                    )}
                    <span className="text-burgundy">{lastWord}.</span>
                  </>
                )
              })()}
            </h1>
            <p className="mt-4 max-w-md text-ink/60">{product.description}</p>

            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
              {selectedVariant.image ? (
                <div className="relative aspect-square w-full overflow-hidden bg-burgundy-tint">
                  <img
                    src={selectedVariant.image}
                    alt={`${product.name} in ${selectedVariant.name}`}
                    className="h-full w-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 bg-black/50 px-3 py-1.5">
                    <p className="text-xs font-bold uppercase tracking-widest text-white">
                      {selectedVariant.name}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-burgundy-tint">
                  <div className="text-center">
                    <span
                      className="mx-auto block h-20 w-20 rounded-full border border-black/10"
                      style={{ background: selectedVariant.hex }}
                    />
                    <p className="mt-4 text-sm text-ink/50">
                      {selectedVariant.isCustom
                        ? 'Custom colour — made to order, no preview photo'
                        : 'Photo coming soon'}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-3xl font-extrabold text-burgundy">
                  GHS {selectedVariant.price}
                </p>

                {standardVariants.length > 1 && (
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink/60">
                      {selectedVariant.isCustom ? 'Custom Colour' : 'Colour'} &mdash;{' '}
                      <span className="text-burgundy">{selectedVariant.name}</span>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {standardVariants.map((variant) => (
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
                            style={{ background: variant.hex }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {customVariants.length > 0 && (
                  <div id="custom-colors" className="mt-6 scroll-mt-24 border-t border-black/10 pt-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink/60">
                      Want a different shade? &mdash; Custom colours, made to order
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {customVariants.map((variant) => (
                        <button
                          key={variant.slug}
                          type="button"
                          aria-label={`${variant.name} (custom)`}
                          onClick={() => selectColor(variant.slug)}
                          className={`h-9 w-9 rounded-full border-2 transition-colors ${
                            variant.slug === selectedVariant.slug
                              ? 'border-burgundy'
                              : 'border-transparent hover:border-black/20'
                          }`}
                        >
                          <span
                            className="block h-full w-full rounded-full border border-black/10"
                            style={{ background: variant.hex }}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-ink/50">
                      Hand-beaded to order in your chosen colour — no preview photo, same price.
                    </p>
                  </div>
                )}

                <div className="mt-6 overflow-hidden border border-black/5">
                  {SPECS.map((spec, index) => (
                    <div
                      key={spec.label}
                      className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-burgundy-tint/40'
                      }`}
                    >
                      <p className="w-28 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-ink/50">
                        {spec.label}
                      </p>
                      <p className="text-sm text-ink">{spec.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex items-center border border-black/10 bg-white">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                      className="flex h-10 w-10 items-center justify-center text-ink/60 hover:text-burgundy"
                    >
                      <Minus size={14} strokeWidth={2} />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-ink">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((qty) => qty + 1)}
                      className="flex h-10 w-10 items-center justify-center text-ink/60 hover:text-burgundy"
                    >
                      <Plus size={14} strokeWidth={2} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-burgundy px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white"
                  >
                    {isAdded ? (
                      <>
                        <Check size={16} strokeWidth={2} />
                        Added to Cart
                      </>
                    ) : (
                      `Add to Cart — GHS ${selectedVariant.price * quantity}`
                    )}
                  </button>

                  <button
                    type="button"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    onClick={() => setIsWishlisted((value) => !value)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-burgundy transition-colors hover:border-burgundy/40"
                  >
                    <Heart
                      size={16}
                      strokeWidth={1.75}
                      className={isWishlisted ? 'fill-burgundy text-burgundy' : ''}
                    />
                  </button>
                </div>
                <p className="mt-3 text-xs text-ink/50">
                  Made to order &middot; Ships in 3&ndash;5 weeks &middot; Free
                  returns within 30 days
                </p>

                <div className="mt-8 border-t border-black/10 pt-4">
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
          </div>
        </div>

        {relatedVariants.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl">
            More Colorways
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
            {relatedVariants.map((variant) => (
              <Link key={variant.slug} to={`/shop/${product.slug}?color=${variant.slug}`}>
                {variant.image ? (
                  <div className="flex aspect-square w-full items-center justify-center bg-burgundy-tint/40">
                    <img
                      src={variant.image}
                      alt={`${product.name} in ${variant.name}`}
                      className="h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-burgundy-tint/40">
                    <span
                      className="block h-10 w-10 rounded-full border border-black/10"
                      style={{ background: variant.hex }}
                    />
                  </div>
                )}
                <p className="mt-2 text-center text-xs font-semibold uppercase tracking-wide text-ink">
                  {variant.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

export default ProductPage
