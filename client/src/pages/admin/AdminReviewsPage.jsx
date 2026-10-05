import { useEffect, useState } from 'react'
import { fetchAdminReviews, updateAdminReview } from '../../services/reviews'
import Stars from '../../components/reviews/Stars'

const FILTERS = [
  { value: 'pending', label: 'Awaiting approval' },
  { value: 'approved', label: 'Published' },
  { value: 'hidden', label: 'Hidden' },
]

export default function AdminReviewsPage() {
  const [status, setStatus] = useState('pending')
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    let isMounted = true
    fetchAdminReviews(status)
      .then((data) => {
        if (isMounted) setReviews(data)
      })
      .catch(() => {
        if (isMounted) setError('Could not load reviews.')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [status])

  async function changeStatus(review, nextStatus) {
    setSavingId(review.id)
    setError('')
    try {
      await updateAdminReview(review.id, nextStatus)
      setReviews((current) => current.filter((item) => item.id !== review.id))
    } catch (err) {
      setError(err.message || 'Could not update that review.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => {
              setIsLoading(true)
              setStatus(filter.value)
            }}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              status === filter.value ? 'border-burgundy bg-burgundy text-white' : 'border-black/15 text-ink hover:border-burgundy'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="text-sm text-burgundy">{error}</p>}
      {isLoading ? (
        <p className="text-ink/75">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-ink/75">No reviews here.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border border-black/15 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Stars value={review.rating} />
                  <p className="mt-1 text-xs text-ink/75">
                    {review.product_slug} · {review.color_slug} · {review.author_name} ·{' '}
                    {new Date(review.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div className="flex gap-2">
                  {status !== 'approved' && (
                    <button
                      type="button"
                      disabled={savingId === review.id}
                      onClick={() => changeStatus(review, 'approved')}
                      className="rounded-full border border-burgundy px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-burgundy disabled:opacity-50"
                    >
                      Publish
                    </button>
                  )}
                  {status !== 'hidden' && (
                    <button
                      type="button"
                      disabled={savingId === review.id}
                      onClick={() => changeStatus(review, 'hidden')}
                      className="rounded-full border border-black/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ink disabled:opacity-50"
                    >
                      Hide
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm text-ink/85">{review.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
