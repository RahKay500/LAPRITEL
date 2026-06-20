import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function validate(form) {
  const errors = {}
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address'
  if (!form.password) errors.password = 'Password is required'
  return errors
}

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setError('')
    setIsSubmitting(true)
    try {
      await login(form)
      const redirectTo = location.state?.from?.pathname || '/profile'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-md">
        <h1 className="font-heading text-3xl text-ink sm:text-4xl">Log In</h1>
        <p className="mt-2 text-ink/70">
          Don't have an account?{' '}
          <Link to="/register" className="text-burgundy hover:underline">
            Create one
          </Link>
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
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            />
            {errors.email && <p className="mt-1 text-xs text-burgundy">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-ink/70">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            />
            {errors.password && <p className="mt-1 text-xs text-burgundy">{errors.password}</p>}
          </div>

          {error && <p className="text-sm text-burgundy">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-burgundy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Logging In...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
