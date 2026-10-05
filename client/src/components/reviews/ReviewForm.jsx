import { useState } from 'react'
import { submitReview } from '../../services/reviews'

export default function ReviewForm({ orderReference, colorSlug, onSubmitted }) {
  const [rating, setRating] = useState(0)
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (rating === 0) {
      setError('Choose a star rating.')
      return
    }
    if (body.trim().length < 10) {
      setError('Please write at least 10 characters.')
      return
    }
    setError('')
    setIsSaving(true)
    try {
      const data = await submitReview({ orderReference, colorSlug, rating, body })
      onSubmitted(data.message)
    } catch (err) {
      setError(err.message || 'Could not save your review. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 border border-black/10 p-4" noValidate>
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={rating === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onClick={() => setRating(star)}
            className={`text-2xl leading-none ${star <= rating ? 'text-burgundy' : 'text-black/20'}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={3}
        maxLength={1000}
        placeholder="Tell us about the bag (at least 10 characters)"
        className="w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-burgundy"
      />
      {error && <p role="alert" className="text-xs text-burgundy">{error}</p>}
      <button
        type="submit"
        disabled={isSaving}
        className="rounded-full border-2 border-burgundy px-5 py-2 text-xs font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Submit review'}
      </button>
    </form>
  )
}
