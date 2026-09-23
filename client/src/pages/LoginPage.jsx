import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { usePageMeta } from '../hooks/usePageMeta'
import PasswordInput from '../components/PasswordInput'

function validate(form) {
  const errors = {}
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address'
  if (!form.password) errors.password = 'Password is required'
  return errors
}

function LoginPage() {
  usePageMeta('Log In', 'Log in to your LAPRITEL account to view orders and manage your profile.')

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
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">Log In</h1>
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
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1 text-xs text-burgundy">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm text-ink/70">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-burgundy hover:underline">
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              ariaInvalid={Boolean(errors.password)}
              ariaDescribedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p id="password-error" role="alert" className="mt-1 text-xs text-burgundy">
                {errors.password}
              </p>
            )}
          </div>

          {error && (
            <p role="alert" className="text-sm text-burgundy">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full border-2 border-burgundy px-8 py-3 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Logging In...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
