import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { usePageMeta } from '../hooks/usePageMeta'

function validate(form) {
  const errors = {}
  if (form.password.length < 8) errors.password = 'Password must be at least 8 characters'
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match'
  return errors
}

function ResetPasswordPage() {
  usePageMeta('Reset Password', 'Choose a new password for your LAPRITEL account.')

  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
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

    setServerError('')
    setIsSubmitting(true)
    try {
      await resetPassword(token, form.password)
      navigate('/login')
    } catch (err) {
      setServerError(err.message)
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">Reset Password</h1>
          <p className="mt-4 text-ink/70">
            This reset link is missing its token. Request a new one below.
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-block rounded-full border-2 border-burgundy px-8 py-3 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white"
          >
            Request Reset Link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">Set a New Password</h1>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
          <div>
            <label htmlFor="password" className="text-sm text-ink/70">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            />
            {errors.password && (
              <p id="password-error" role="alert" className="mt-1 text-xs text-burgundy">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="text-sm text-ink/70">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            />
            {errors.confirmPassword && (
              <p id="confirmPassword-error" role="alert" className="mt-1 text-xs text-burgundy">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {serverError && (
            <p role="alert" className="text-sm text-burgundy">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full border-2 border-burgundy px-8 py-3 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Set New Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage
