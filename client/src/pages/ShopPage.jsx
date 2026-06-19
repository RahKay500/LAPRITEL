import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Check, ChevronDown, Filter } from 'lucide-react'
import { ivyBagVariants } from '../data/ivyBagVariants'
import { useCart } from '../context/useCart'

const sortOptions = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeColor = searchParams.get('color') || 'all'
  const [sortOrder, setSortOrder] = useState('default')
  const { addItem } = useCart()
  const [addedSlug, setAddedSlug] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function setActiveColor(slug) {
    if (slug === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ color: slug })
    }
    setIsFilterOpen(false)
  }

  const activeVariant = ivyBagVariants.find((variant) => variant.slug === activeColor)

  const visibleVariants = useMemo(() => {
    const filtered =
      activeColor === 'all'
        ? ivyBagVariants
        : ivyBagVariants.filter((variant) => variant.slug === activeColor)

    if (sortOrder === 'price-asc') {
      return [...filtered].sort((a, b) => a.price - b.price)
    }
    if (sortOrder === 'price-desc') {
      return [...filtered].sort((a, b) => b.price - a.price)
    }
    return filtered
  }, [activeColor, sortOrder])

  function handleQuickAdd(variant) {
    addItem(variant)
    setAddedSlug(variant.slug)
    setTimeout(() => setAddedSlug(null), 1500)
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-ink sm:text-4xl">
            Collections
          </h1>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                  activeColor !== 'all'
                    ? 'border-burgundy bg-burgundy text-white'
                    : 'border-black/10 text-ink hover:border-burgundy'
                }`}
              >
                <Filter size={14} strokeWidth={1.5} />
                {activeColor !== 'all' && activeVariant ? activeVariant.name : 'Filter'}
                <ChevronDown size={14} strokeWidth={1.5} />
              </button>

              {isFilterOpen && (
                <div className="absolute left-0 top-full z-10 mt-2 flex w-64 flex-wrap gap-2 rounded-2xl border border-black/10 bg-white p-3 shadow-lg">
                  {ivyBagVariants.map((variant) => (
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
                        style={{ backgroundColor: variant.hex }}
                      />
                      {variant.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-ink">
            Sort by
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="rounded-full border border-black/10 px-3 py-1.5 text-sm outline-none focus:border-burgundy"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {visibleVariants.length === 0 ? (
          <p className="mt-16 text-center text-ink/60">
            No bags match that color right now.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {visibleVariants.map((variant) => (
              <div
                key={variant.slug}
                className="rounded-2xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
              >
                {variant.image ? (
                  <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-burgundy-tint/40 p-2">
                    <img
                      src={variant.image}
                      alt={`The Ivy Bag in ${variant.name}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-burgundy-tint/40">
                    <span
                      className="block h-14 w-14 rounded-full border border-black/10"
                      style={{ backgroundColor: variant.hex }}
                    />
                  </div>
                )}
                <p className="mt-3 text-sm font-medium text-ink">{variant.name}</p>
                <p className="mt-1 text-xs text-ink/60">GHS {variant.price}</p>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(variant)}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-burgundy px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90"
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
        )}
      </div>
    </div>
  )
}

export default ShopPage
