import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../services/products'
import Reveal from './Reveal'

function OurBags() {
  const [products, setProducts] = useState([])
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
        <div className="absolute inset-y-0 right-full hidden flex-col items-center pr-6 lg:flex lg:pr-10">
          <p className="[writing-mode:vertical-rl] text-[11px] font-semibold uppercase tracking-[0.25em] text-burgundy/70">
            New Season &mdash; {seasonYear}
          </p>
          <span className="mt-3 w-px flex-1 bg-black/10" />
        </div>

        <div className="min-w-0">
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

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {products.map((product, index) => {
              const variant =
                product.product_variants.find((v) => v.image_url && !v.is_custom) ||
                product.product_variants[0]
              if (!variant) return null
              return (
                <Reveal key={product.slug} delay={index * 100}>
                  <Link to={`/shop/${product.slug}`} className="group block">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-burgundy-tint">
                      {variant.image_url ? (
                        <img
                          src={variant.image_url}
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
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurBags
