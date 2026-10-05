import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchFeaturedCustomers } from '../services/featuredCustomers'

const HOMEPAGE_LIMIT = 6

function FeaturedCard({ customer }) {
  const quote = customer.quote.replace(/^[“"]\s*|\s*[”"]$/g, '')
  return (
    <figure className="bg-burgundy-tint/30">
      <img
        src={customer.image_url}
        alt={`A LAPRITEL bag carried by ${customer.first_name}`}
        className="mx-auto block max-h-[480px] w-auto max-w-full"
        loading="lazy"
        decoding="async"
      />
      <figcaption className="p-6">
        <blockquote className="text-sm leading-relaxed text-ink/80">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-burgundy">
          {customer.first_name}
        </p>
      </figcaption>
    </figure>
  )
}

export function FeaturedGrid({ customers }) {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {customers.map((customer) => (
        <div key={customer.id} className="mb-6 break-inside-avoid">
          <FeaturedCard customer={customer} />
        </div>
      ))}
    </div>
  )
}

function FeaturedCustomers() {
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    let isMounted = true
    fetchFeaturedCustomers({ limit: HOMEPAGE_LIMIT })
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
    <section className="py-12 lg:py-16">
      <div className="px-4 text-center sm:px-6 lg:px-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-burgundy">
          Worn By Our Customers
        </p>
        <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Loved in real life
        </h2>
      </div>

      <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-12">
        {customers.map((customer) => (
          <figure key={customer.id} className="w-[72%] shrink-0 snap-start sm:w-[30%] lg:w-[22%]">
            <img
              src={customer.image_url}
              alt={`A LAPRITEL bag carried by ${customer.first_name}`}
              className="aspect-4/5 w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <p className="mt-3 text-center text-xs font-semibold uppercase tracking-widest text-burgundy">
              {customer.first_name}
            </p>
          </figure>
        ))}
      </div>

      <div className="mt-6 px-4 text-center sm:px-6 lg:px-12">
        <Link
          to="/featured"
          className="text-sm font-semibold uppercase tracking-wide text-burgundy underline-offset-4 hover:underline"
        >
          See all looks
        </Link>
      </div>
    </section>
  )
}

export default FeaturedCustomers
