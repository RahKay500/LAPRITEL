import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Check, Heart, Minus, Plus } from 'lucide-react'
import { useProductVariants } from '../hooks/useProductVariants'
import { useCart } from '../context/useCart'
import { useWishlist } from '../context/useWishlist'
import { usePageMeta } from '../hooks/usePageMeta'
import ProductImage from '../components/product/ProductImage'
import ColourPicker from '../components/product/ColourPicker'
import CustomColourPicker from '../components/product/CustomColourPicker'
import ProductDetails from '../components/product/ProductDetails'
import RelatedBags from '../components/product/RelatedBags'

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

  const [customMode, setCustomMode] = useState('single')
  const [topSlug, setTopSlug] = useState(null)
  const [bottomSlug, setBottomSlug] = useState(null)
  const topVariant = customVariants.find((variant) => variant.slug === topSlug)
  const bottomVariant = customVariants.find((variant) => variant.slug === bottomSlug)
  const isTwoToneReady = customMode === 'two-tone' && Boolean(topVariant) && Boolean(bottomVariant)
  const twoToneVariant = isTwoToneReady
    ? {
        ...topVariant,
        name: `${topVariant.name} (Top) & ${bottomVariant.name} (Bottom)`,
        topHex: topVariant.hex,
        bottomHex: bottomVariant.hex,
        isTwoTone: true,
        image: undefined,
      }
    : null
  const effectiveVariant = twoToneVariant || selectedVariant
  const canAddToCart = customMode !== 'two-tone' || isTwoToneReady

  usePageMeta(
    product && selectedVariant
      ? hasColorChoice
        ? `${displayName} — ${selectedVariant.name}`
        : displayName
      : product?.name,
    product?.description
  )

  const { addItem, buyNow } = useCart()
  const navigate = useNavigate()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [isAdded, setIsAdded] = useState(false)
  const [isCustomOpen, setIsCustomOpen] = useState(() => window.location.hash === '#custom-colors')
  const [quantity, setQuantity] = useState(1)
  const wishlisted = Boolean(product && selectedVariant && isWishlisted(product.slug, selectedVariant.slug))

  useEffect(() => {
    if (window.location.hash === '#custom-colors' && customVariants.length > 0) {
      document.getElementById('custom-colors')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [customVariants.length])

  // On mobile the image sits above the color pickers, so once the shopper
  // scrolls down to pick a color, a swap happens off-screen above them.
  // Scroll the image back into view so the change is visible without
  // needing to scroll back up. Desktop already shows both side by side, so
  // this only runs below the lg breakpoint.
  function scrollImageIntoView() {
    if (window.innerWidth >= 1024) return
    document.getElementById('product-image')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function selectColor(slug) {
    setSearchParams({ color: slug })
    setQuantity(1)
    setCustomMode('single')
    scrollImageIntoView()
  }

  function selectTwoToneMode() {
    setCustomMode('two-tone')
    setTopSlug(null)
    setBottomSlug(null)
  }

  // Two-tone needs two picks. Scrolling away after the first one just makes
  // the shopper scroll back down to make the second pick, so only jump to
  // the image once this pick completes the pair.
  function selectTopColor(slug) {
    setTopSlug(slug)
    if (bottomSlug && bottomSlug !== slug) scrollImageIntoView()
  }

  function selectBottomColor(slug) {
    setBottomSlug(slug)
    if (topSlug && topSlug !== slug) scrollImageIntoView()
  }

  function handleAddToCart() {
    if (!canAddToCart) return
    addItem(
      effectiveVariant,
      quantity,
      isTwoToneReady
        ? { name: effectiveVariant.name, topHex: effectiveVariant.topHex, bottomHex: effectiveVariant.bottomHex }
        : null
    )
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  function handleBuyNow() {
    if (!canAddToCart) return
    buyNow(
      effectiveVariant,
      quantity,
      isTwoToneReady
        ? { name: effectiveVariant.name, topHex: effectiveVariant.topHex, bottomHex: effectiveVariant.bottomHex }
        : null
    )
    navigate('/checkout')
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
              <ProductImage variant={effectiveVariant} productName={product.name} isTwoToneReady={isTwoToneReady} />

              <div>
                <p className="text-3xl font-extrabold text-burgundy">
                  GHS {effectiveVariant.price}
                </p>

                <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-ink/60">
                  {effectiveVariant.readyToShip
                    ? 'Ready to ship'
                    : 'Made to order · ready in 5–7 working days'}
                </p>

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
                    disabled={!canAddToCart}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-burgundy px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white disabled:cursor-not-allowed disabled:border-black/20 disabled:text-ink/40 disabled:hover:bg-transparent"
                  >
                    {isAdded ? (
                      <>
                        <Check size={16} strokeWidth={2} />
                        Added to Cart
                      </>
                    ) : (
                      `Add to Cart — GHS ${effectiveVariant.price * quantity}`
                    )}
                  </button>

                  <button
                    type="button"
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    onClick={() => toggleWishlist(product.slug, selectedVariant.slug)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-burgundy transition-colors hover:border-burgundy/40"
                  >
                    <Heart
                      size={16}
                      strokeWidth={1.75}
                      className={wishlisted ? 'fill-burgundy text-burgundy' : ''}
                    />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!canAddToCart}
                  className="mt-3 w-full rounded-full bg-burgundy px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-burgundy/90 disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-ink/40"
                >
                  Buy Now
                </button>

                <ColourPicker variants={standardVariants} selected={selectedVariant} onSelect={selectColor} />

                {customVariants.length > 0 && (
                  <CustomColourPicker
                    variants={customVariants}
                    mode={customMode}
                    isOpen={isCustomOpen}
                    onToggle={() => setIsCustomOpen((open) => !open)}
                    onSingleMode={() => setCustomMode('single')}
                    onTwoToneMode={selectTwoToneMode}
                    selectedSlug={selectedVariant.slug}
                    onSelectSingle={selectColor}
                    topSlug={topSlug}
                    bottomSlug={bottomSlug}
                    topVariant={topVariant}
                    bottomVariant={bottomVariant}
                    isTwoToneReady={isTwoToneReady}
                    onTopColor={selectTopColor}
                    onBottomColor={selectBottomColor}
                  />
                )}

                <ProductDetails hasCustomVariants={customVariants.length > 0} />
              </div>
            </div>
          </div>
        </div>

        {relatedVariants.length > 0 && <RelatedBags relatedVariants={relatedVariants} product={product} />}
      </div>
    </div>
  )
}

export default ProductPage
