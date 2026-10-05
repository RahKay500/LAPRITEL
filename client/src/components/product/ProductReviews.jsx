import { useEffect, useState } from 'react'
import { fetchProductReviews } from '../../services/reviews'
import Stars from '../reviews/Stars'

export default function ProductReviews({ productSlug }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    let isMounted = true
    fetchProductReviews(productSlug)
      .then((result) => {
        if (isMounted) setData(result)
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [productSlug])

  if (!data) return null

  return (
    <section className="mt-20">
      <h2 className="text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl">Reviews</h2>
      {data.count === 0 ? (
        <p className="mt-4 text-sm text-ink/60">No reviews yet. Reviews appear here after a delivered order is reviewed.</p>
      ) : (
        <>
          <p className="mt-3 text-sm text-ink/70">
            <Stars value={Math.round(data.average)} label={`${data.average} out of 5 stars`} /> {data.average} out of 5 · {data.count} review{data.count === 1 ? '' : 's'}
          </p>
          <ul className="mt-6 space-y-6">
            {data.reviews.map((review) => (
              <li key={review.id} className="border-t border-black/10 pt-4">
                <Stars value={review.rating} />
                <p className="mt-2 text-sm text-ink/80">{review.body}</p>
                <p className="mt-2 text-xs text-ink/50">
                  {review.author_name} · {new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
