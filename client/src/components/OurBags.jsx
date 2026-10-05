import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../services/products'
import Reveal from './Reveal'

const HOMEPAGE_COLLECTION_LIMIT = 4

function OurBags() {
  const [products, setProducts] = useState([])
  const [selectedColors, setSelectedColors] = useState({ 'ivy-bag': 'purple' })
  const seasonYear = new Date().getFullYear()

  useEffect(() => {
    let isMounted = true
    fetchProducts()
      .then((data) => {
        if (isMounted) setProducts(data)
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="bg-burgundy-tint/30 px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
      <div className="relative mx-auto max-w-6xl">
        <div className="flex gap-4 sm:gap-6 lg:block">
          <div className="flex shrink-0 flex-col items-center lg:absolute lg:inset-y-0 lg:right-full lg:pr-10">
            <p className="[writing-mode:vertical-rl] text-[11px] font-semibold uppercase tracking-[0.25em] text-burgundy/70">
              New Season &mdash; {seasonYear}
            </p>
            <span className="mt-3 w-px flex-1 bg-black/10" />
          </div>

          <div className="min-w-0 flex-1 lg:flex-none">
            <Reveal>
              <h2 className="text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl">
                Our
                <br />
                <span className="text-burgundy">Bags.</span>
              </h2>
              <p className="mt-4 max-w-md text-ink/60">
                Fully beaded, hand-stitched over 48 hours. Three signature
                designs, each made to order.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, HOMEPAGE_COLLECTION_LIMIT).map((product, index) => {
                const standardVariants = product.product_variants.filter(
                  (v) => v.image_url && !v.is_custom
                )
                const variant =
                  standardVariants.find((v) => v.color_slug === selectedColors[product.slug]) ||
                  standardVariants[0] ||
                  product.product_variants[0]
                if (!variant) return null
                return (
                  <Reveal key={product.slug} delay={index * 100}>
                    <div>
                      <Link to={`/shop/${product.slug}?color=${variant.color_slug}`} className="group block">
                        <div className="relative aspect-square w-full overflow-hidden bg-burgundy-tint">
                          {product.cover_image_url || variant.image_url ? (
                            <img
                              src={product.cover_image_url || variant.image_url}
                              alt={product.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span
                                className="block h-16 w-16 rounded-full border border-black/10"
                                style={{ background: variant.hex }}
                              />
                            </div>
                          )}
                        </div>
                        <p className="mt-4 text-lg font-extrabold uppercase tracking-tight text-ink">
                          {product.name}
                        </p>
                        <p className="mt-1 text-sm text-ink/60">GHS {variant.price}</p>
                      </Link>

                      {standardVariants.length > 1 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {standardVariants.map((v) => (
                            <button
                              key={v.color_slug}
                              type="button"
                              aria-label={v.color_name}
                              onClick={() =>
                                setSelectedColors((current) => ({
                                  ...current,
                                  [product.slug]: v.color_slug,
                                }))
                              }
                              className={`h-6 w-6 rounded-full border-2 transition-colors ${
                                v.color_slug === variant.color_slug
                                  ? 'border-burgundy'
                                  : 'border-transparent hover:border-black/20'
                              }`}
                            >
                              <span
                                className="block h-full w-full rounded-full border border-black/10"
                                style={{ background: v.hex }}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
          {products.length > HOMEPAGE_COLLECTION_LIMIT && (
            <div className="mt-10 text-center">
              <Link
                to="/collections"
                className="text-sm font-semibold uppercase tracking-wide text-burgundy underline-offset-4 hover:underline"
              >
                See all collections
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default OurBags
