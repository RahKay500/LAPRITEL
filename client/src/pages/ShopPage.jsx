import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Check, ChevronDown, Filter, Heart } from 'lucide-react'
import { fetchProducts } from '../services/products'
import { useCart } from '../context/useCart'
import { useWishlist } from '../context/useWishlist'
import { usePageMeta } from '../hooks/usePageMeta'

function toCartVariant(variant, productName) {
  return {
    name: variant.color_name,
    slug: variant.color_slug,
    hex: variant.hex,
    price: Number(variant.price),
    image: variant.image_url || undefined,
    isCustom: Boolean(variant.is_custom),
    productName,
  }
}

function ShopPage() {
  usePageMeta('Shop', 'Browse every LAPRITEL collection and filter by colour.')

  const [searchParams, setSearchParams] = useSearchParams()
  const [collections, setCollections] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterRef = useRef(null)
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [addedSlug, setAddedSlug] = useState(null)

  useEffect(() => {
    let isMounted = true
    fetchProducts()
      .then((products) => {
        if (isMounted) setCollections(products)
      })
      .catch(() => {
        if (isMounted) setError("We couldn't load the collections right now. Please try again shortly.")
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedCollection =
    collections.find((item) => item.slug === searchParams.get('collection')) || collections[0]
  const activeColor = searchParams.get('color') || 'all'

  const standardVariants = useMemo(
    () =>
      (selectedCollection?.product_variants || [])
        .filter((variant) => variant.is_active !== false && !variant.is_custom)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .map((variant) => toCartVariant(variant, selectedCollection.name)),
    [selectedCollection]
  )
  const hasCustomVariants = (selectedCollection?.product_variants || []).some(
    (variant) => variant.is_active !== false && variant.is_custom
  )

  const visibleVariants = useMemo(
    () =>
      activeColor === 'all'
        ? standardVariants
        : standardVariants.filter((variant) => variant.slug === activeColor),
    [activeColor, standardVariants]
  )

  const activeVariant = standardVariants.find((variant) => variant.slug === activeColor)

  function selectCollection(slug) {
    setSearchParams({ collection: slug })
    setIsFilterOpen(false)
  }

  function setActiveColor(slug) {
    const next = { collection: selectedCollection.slug }
    if (slug !== 'all') next.color = slug
    setSearchParams(next)
    setIsFilterOpen(false)
  }

  function handleQuickAdd(variant) {
    addItem({ slug: variant.slug }, 1)
    setAddedSlug(variant.slug)
    setTimeout(() => setAddedSlug(null), 1500)
  }

  let gridContent
  if (isLoading) {
    gridContent = <p className="mt-16 text-center text-ink/60">Loading collections…</p>
  } else if (error) {
    gridContent = <p className="mt-16 text-center text-ink/60">{error}</p>
  } else if (!selectedCollection) {
    gridContent = <p className="mt-16 text-center text-ink/60">No collections yet.</p>
  } else if (standardVariants.length === 0) {
    gridContent = <p className="mt-16 text-center text-ink/60">Coming soon.</p>
  } else if (visibleVariants.length === 0) {
    gridContent = <p className="mt-16 text-center text-ink/60">No bags match that colour right now.</p>
  } else {
    gridContent = (
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {visibleVariants.map((variant) => (
          <div key={variant.slug} className="relative">
            <button
              type="button"
              aria-label={isWishlisted(selectedCollection.slug, variant.slug) ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={() => toggleWishlist(selectedCollection.slug, variant.slug)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-burgundy shadow-sm"
            >
              <Heart
                size={16}
                strokeWidth={1.75}
                className={isWishlisted(selectedCollection.slug, variant.slug) ? 'fill-burgundy text-burgundy' : ''}
              />
            </button>
            <Link to={`/shop/${selectedCollection.slug}?color=${variant.slug}`}>
              {variant.image ? (
                <div className="flex aspect-square w-full items-center justify-center bg-burgundy-tint/40">
                  <img
                    src={variant.image}
                    alt={`${selectedCollection.name} in ${variant.name}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-burgundy-tint/40">
                  <span
                    className="block h-14 w-14 rounded-full border border-black/10"
                    style={{ background: variant.hex }}
                  />
                </div>
              )}
              <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-ink">
                {variant.name}
              </p>
              <p className="mt-1 text-xs text-ink/60">GHS {variant.price}</p>
            </Link>
            <button
              type="button"
              onClick={() => handleQuickAdd(variant)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-burgundy px-4 py-2 text-xs font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white"
            >
              {addedSlug === variant.slug ? (
                <>
                  <Check size={14} strokeWidth={2} />
                  Added
                </>
              ) : (
                'Quick Add'
              )}
            </button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            Collections
          </h1>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <select
              value={selectedCollection?.slug || ''}
              onChange={(event) => selectCollection(event.target.value)}
              disabled={collections.length === 0}
              aria-label="Choose a collection"
              className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium text-ink outline-none focus:border-burgundy"
            >
              {collections.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            <Link
              to="/collections"
              className="text-sm font-medium text-burgundy underline-offset-4 hover:underline"
            >
              All collections
            </Link>
          </div>
        </div>

        {selectedCollection && (
          <>
            <div className="mt-12 flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl">
                {selectedCollection.name}
              </h2>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveColor('all')}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeColor === 'all'
                      ? 'border-burgundy bg-burgundy text-white'
                      : 'border-black/10 text-ink hover:border-burgundy'
                  }`}
                >
                  All
                </button>

                <div className="relative" ref={filterRef}>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen((open) => !open)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      activeColor === 'all'
                        ? 'border-black/10 text-ink hover:border-burgundy'
                        : 'border-burgundy bg-burgundy text-white'
                    }`}
                  >
                    <Filter size={14} strokeWidth={1.5} />
                    {activeColor !== 'all' && activeVariant ? activeVariant.name : 'Filter'}
                    <ChevronDown size={14} strokeWidth={1.5} />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute left-0 top-full z-10 mt-2 flex w-64 flex-wrap gap-2 rounded-2xl border border-black/10 bg-white p-3 shadow-lg">
                      {standardVariants.map((variant) => (
                        <button
                          key={variant.slug}
                          type="button"
                          onClick={() => setActiveColor(variant.slug)}
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                            activeColor === variant.slug
                              ? 'border-burgundy bg-burgundy text-white'
                              : 'border-black/10 text-ink hover:border-burgundy'
                          }`}
                        >
                          <span
                            className="block h-3 w-3 rounded-full border border-black/10"
                            style={{ background: variant.hex }}
                          />
                          {variant.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {hasCustomVariants && selectedCollection && (
          <div className="mt-4 text-right">
            <Link
              to={`/shop/${selectedCollection.slug}#custom-colors`}
              className="text-sm font-medium text-burgundy underline-offset-4 hover:underline"
            >
              + Custom colours available
            </Link>
          </div>
        )}

        {gridContent}
      </div>
    </div>
  )
}

export default ShopPage
