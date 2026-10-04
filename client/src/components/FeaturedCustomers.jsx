import { useEffect, useState } from 'react'
import { fetchFeaturedCustomers } from '../services/featuredCustomers'

function FeaturedCustomers() {
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    let isMounted = true
    fetchFeaturedCustomers()
      .then((data) => {
        if (isMounted) setCustomers(data)
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  if (customers.length === 0) return null

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-burgundy">
            Worn By Our Customers
          </p>
          <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            Loved in real life
          </h2>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <figure key={customer.id} className="bg-burgundy-tint/30">
              <img
                src={customer.image_url}
                alt={`A LAPRITEL bag carried by ${customer.first_name}`}
                className="aspect-square w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="p-6">
                <blockquote className="text-sm leading-relaxed text-ink/80">
                  &ldquo;{customer.quote}&rdquo;
                </blockquote>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-burgundy">
                  {customer.first_name}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCustomers
