import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../services/products'
import { usePageMeta } from '../hooks/usePageMeta'

function summarise(product) {
  const standard = (product.product_variants || []).filter(
    (variant) => variant.is_active !== false && !variant.is_custom
  )
  const cover = standard.find((variant) => variant.image_url)
  const prices = standard.map((variant) => Number(variant.price))
  return {
    cover: cover?.image_url,
    fromPrice: prices.length ? Math.min(...prices) : null,
  }
}

function CollectionsPage() {
  usePageMeta('Collections', 'Every LAPRITEL bag collection in one place.')

  const [collections, setCollections] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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

  let content
  if (isLoading) {
    content = <p className="mt-16 text-center text-ink/60">Loading collections…</p>
  } else if (error) {
    content = <p className="mt-16 text-center text-ink/60">{error}</p>
  } else if (collections.length === 0) {
    content = <p className="mt-16 text-center text-ink/60">No collections yet.</p>
  } else {
    content = (
      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {collections.map((product) => {
          const { cover, fromPrice } = summarise(product)
          return (
            <Link key={product.slug} to={`/shop?collection=${product.slug}`} className="group block">
              <div className="aspect-4/5 w-full overflow-hidden bg-burgundy-tint/40">
                {cover && (
                  <img
                    src={cover}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-ink">{product.name}</p>
              {fromPrice !== null && <p className="mt-1 text-xs text-ink/60">From GHS {fromPrice}</p>}
            </Link>
          )
        })}
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
        </div>
        {content}
      </div>
    </div>
  )
}

export default CollectionsPage
