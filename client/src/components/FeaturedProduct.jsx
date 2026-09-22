import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Heart, Minus, Plus } from 'lucide-react'
import { ivyBagVariants } from '../data/ivyBagVariants'
import { useCart } from '../context/useCart'
import Reveal from './Reveal'

const SPECS = [
  { label: 'Style', value: 'Structured beaded handbag' },
  { label: 'Beadwork', value: 'Full coverage seed beads, hand-stitched' },
  { label: 'Dimensions', value: '22 cm × 18 cm × 8 cm' },
  { label: 'Closure', value: 'Magnetic snap clasp with beaded tab' },
  { label: 'Lining', value: 'Satin interior with zip pocket' },
  { label: 'Carry', value: 'Top handle, 15 cm drop' },
]

function FeaturedProduct() {
  const [selectedSlug, setSelectedSlug] = useState(
    ivyBagVariants.find((variant) => variant.image)?.slug ?? ivyBagVariants[0].slug
  )
  const selectedVariant =
    ivyBagVariants.find((variant) => variant.slug === selectedSlug) || ivyBagVariants[0]

  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const seasonYear = new Date().getFullYear()

  function selectColor(slug) {
    setSelectedSlug(slug)
    setQuantity(1)
  }

  function handleAddToCart() {
    addItem(selectedVariant, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  return (
    <section className="bg-burgundy-tint/30 px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
      <div className="mx-auto flex max-w-6xl gap-6 lg:gap-10">
        <div className="hidden shrink-0 flex-col items-center lg:flex">
          <p className="[writing-mode:vertical-rl] text-[11px] font-semibold uppercase tracking-[0.25em] text-burgundy/70">
            New Season &mdash; {seasonYear}
          </p>
          <span className="mt-3 w-px flex-1 bg-black/10" />
        </div>

        <div className="min-w-0 flex-1">
          <Reveal>
            <h2 className="text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl">
              Ivy
              <br />
              <span className="text-burgundy">Bag.</span>
            </h2>
            <p className="mt-4 max-w-md text-ink/60">
              Fully beaded. Rigid shell. Hand-stitched over 48 hours.{' '}
              {ivyBagVariants.length} colourways, each capped at 200 units.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
            {selectedVariant.image ? (
              <Reveal delay={100} className="relative aspect-[4/5] w-full overflow-hidden bg-burgundy-tint">
                <img
                  key={selectedVariant.slug}
                  src={selectedVariant.image}
                  alt={`Bag Ivy in ${selectedVariant.name}`}
                  className="hero-fade h-full w-full object-cover"
                  decoding="async"
                />
                <div className="absolute bottom-0 left-0 bg-black/50 px-3 py-1.5">
                  <p className="text-xs font-bold uppercase tracking-widest text-white">
                    {selectedVariant.name}
                  </p>
                </div>
              </Reveal>
            ) : (
              <Reveal delay={100} className="flex aspect-[4/5] w-full items-center justify-center bg-burgundy-tint">
                <span
                  className="mx-auto block h-20 w-20 rounded-full border border-black/10"
                  style={{ background: selectedVariant.hex }}
                />
              </Reveal>
            )}

            <Reveal delay={200}>
              <p className="text-3xl font-extrabold text-burgundy">
                GHS {selectedVariant.price}
              </p>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-ink/60">
                  Colour &mdash; <span className="text-burgundy">{selectedVariant.name}</span>
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
                        style={{ background: variant.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

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
                      Added to Bag
                    </>
                  ) : (
                    `Add to Bag — GHS ${selectedVariant.price * quantity}`
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
                Made to order &middot; Ships in 3&ndash;5 weeks &middot; Free returns
                within 30 days
              </p>

              <Link
                to={`/shop/ivy-bag?color=${selectedVariant.slug}`}
                className="mt-4 inline-block text-sm font-medium text-burgundy hover:underline"
              >
                View full details &rarr;
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProduct
