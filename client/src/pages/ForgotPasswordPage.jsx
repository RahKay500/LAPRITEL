import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { usePageMeta } from '../hooks/usePageMeta'

function ForgotPasswordPage() {
  usePageMeta('Forgot Password', 'Reset the password for your LAPRITEL account.')

  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      await forgotPassword(email)
      setIsSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-md">
        <h1 className="font-heading text-3xl text-ink sm:text-4xl">Reset Your Password</h1>

        {isSubmitted ? (
          <p className="mt-6 text-ink/70">
            If an account exists for that email, we've sent a link to reset your password.
            Check your inbox.
          </p>
        ) : (
          <>
            <p className="mt-2 text-ink/70">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
              <div>
                <label htmlFor="email" className="text-sm text-ink/70">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                />
                {error && <p className="mt-1 text-xs text-burgundy">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-burgundy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-sm text-ink/70">
          <Link to="/login" className="text-burgundy hover:underline">
            Back to Log In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
