import { useState } from 'react'
import Reveal from './Reveal'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section className="bg-burgundy px-4 py-16 text-center sm:px-6 lg:px-12 lg:py-20">
      <Reveal className="mx-auto max-w-md">
        <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
          Join the LAPRITEL Circle
        </h2>
        <p className="mt-3 text-sm text-white/80">
          Be the first to know about new colorways, restocks, and exclusive
          offers.
        </p>

        {submitted ? (
          <p className="mt-6 text-sm font-medium text-white">
            Thank you for subscribing!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
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
              className="rounded-full border-2 border-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-burgundy"
            >
              Subscribe
            </button>
          </form>
        )}
      </Reveal>
    </section>
  )
}

export default Newsletter
