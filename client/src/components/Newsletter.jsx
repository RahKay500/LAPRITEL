import { useState } from 'react'
import { api } from '../services/api'
import Reveal from './Reveal'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setMessage('')
    setIsError(false)
    try {
      const data = await api.post('/newsletter', { email })
      setSubmitted(true)
      setMessage(data.message)
      setEmail('')
    } catch (err) {
      setIsError(true)
      setMessage(err.message || 'We could not save your email. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="bg-burgundy px-4 py-16 text-center sm:px-6 lg:px-12 lg:py-24">
      <Reveal className="mx-auto max-w-md">
        <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
          Join the LAPRITEL Circle
        </h2>
        <p className="mt-3 text-sm text-white/80">
          Be the first to know about new colorways, restocks, and exclusive offers.
        </p>

        {submitted ? (
          <p role="status" className="mt-6 text-sm font-medium text-white">
            {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row" noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              className="w-full border border-white/40 bg-transparent px-5 py-3 text-sm text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full border-2 border-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-burgundy disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Subscribe'}
            </button>
          </form>
        )}

        {!submitted && (
          <p className="mt-4 text-xs text-white/70">
            By subscribing you agree to receive LAPRITEL news by email. To stop, email lapritel@gmail.com at any time.
          </p>
        )}
        {isError && <p role="alert" className="mt-3 text-sm text-white">{message}</p>}
      </Reveal>
    </section>
  )
}

export default Newsletter
