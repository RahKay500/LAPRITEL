import { useEffect, useState } from 'react'
import { FeaturedGrid } from '../components/FeaturedCustomers'
import { fetchFeaturedCustomers } from '../services/featuredCustomers'
import { usePageMeta } from '../hooks/usePageMeta'

function FeaturedPage() {
  usePageMeta('Featured Customers', 'See LAPRITEL bags worn by our customers.')

  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFeaturedCustomers()
      .then(setCustomers)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-burgundy">
            Worn By Our Customers
          </p>
          <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            Loved in real life
          </h1>
        </div>

        <div className="mt-12">
          {isLoading ? (
            <p className="text-center text-ink/60">Loading...</p>
          ) : error ? (
            <p className="text-center text-sm text-burgundy">{error}</p>
          ) : customers.length === 0 ? (
            <p className="text-center text-ink/60">No featured customers yet.</p>
          ) : (
            <FeaturedGrid customers={customers} />
          )}
        </div>
      </div>
    </div>
  )
}

export default FeaturedPage
