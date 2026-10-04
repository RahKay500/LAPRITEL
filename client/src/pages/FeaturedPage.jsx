import { useEffect, useState } from 'react'
import { FeaturedGrid } from '../components/FeaturedCustomers'
import { fetchFeaturedCustomers } from '../services/featuredCustomers'
import { usePageMeta } from '../hooks/usePageMeta'

const PAGE_SIZE = 24

function FeaturedPage() {
  usePageMeta('Featured Customers', 'See LAPRITEL bags worn by our customers.')

  const [customers, setCustomers] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')

  // Ask for one extra row so we know whether another page exists without a count query.
  useEffect(() => {
    fetchFeaturedCustomers({ limit: PAGE_SIZE + 1 })
      .then((data) => {
        setHasMore(data.length > PAGE_SIZE)
        setCustomers(data.slice(0, PAGE_SIZE))
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  async function handleLoadMore() {
    setIsLoadingMore(true)
    setError('')
    try {
      const data = await fetchFeaturedCustomers({ limit: PAGE_SIZE + 1, offset: customers.length })
      setHasMore(data.length > PAGE_SIZE)
      setCustomers((current) => [...current, ...data.slice(0, PAGE_SIZE)])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoadingMore(false)
    }
  }

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
          ) : customers.length === 0 && error ? (
            <p className="text-center text-sm text-burgundy">{error}</p>
          ) : customers.length === 0 ? (
            <p className="text-center text-ink/60">No featured customers yet.</p>
          ) : (
            <>
              <FeaturedGrid customers={customers} />
              {error && <p className="mt-6 text-center text-sm text-burgundy">{error}</p>}
              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="rounded-full border-2 border-burgundy px-8 py-2.5 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoadingMore ? 'Loading...' : 'Load more'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeaturedPage
