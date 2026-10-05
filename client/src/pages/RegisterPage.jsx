import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { usePageMeta } from '../hooks/usePageMeta'
import PasswordInput from '../components/PasswordInput'
import { sanitizeField } from '../utils/sanitizeField'
import { EMAIL_PATTERN, NAME_PATTERN, PHONE_PATTERN } from '../shared/validation'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

function validate(form) {
  const errors = {}
  if (!NAME_PATTERN.test(form.fullName.trim())) {
    errors.fullName = 'Enter a valid name (letters only)'
  }
  if (!EMAIL_PATTERN.test(form.email)) errors.email = 'Enter a valid email address'
  if (!PHONE_PATTERN.test(form.phone.trim())) errors.phone = 'Enter a valid 10-digit phone number'
  if (form.password.length < 8) errors.password = 'Password must be at least 8 characters'
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match'
  return errors
}

function RegisterPage() {
  usePageMeta('Create an Account', 'Create a LAPRITEL account to track orders and check out faster.')

  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: sanitizeField(name, value) }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setServerError('')
    setIsSubmitting(true)
    try {
      await register(form)
      navigate('/profile')
    } catch (error) {
      setServerError(error.message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Create an Account
        </h1>
        <p className="mt-2 text-ink/70">
          Already have an account?{' '}
          <Link to="/login" className="text-burgundy hover:underline">
            Log in
          </Link>
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
          <div>
            <label htmlFor="fullName" className="text-sm text-ink/70">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            />
            {errors.fullName && (
              <p id="fullName-error" role="alert" className="mt-1 text-xs text-burgundy">
                {errors.fullName}
              </p>
            )}
          </div>

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
            <label htmlFor="phone" className="text-sm text-ink/70">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            />
            {errors.phone && (
              <p id="phone-error" role="alert" className="mt-1 text-xs text-burgundy">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-ink/70">
              Password
            </label>
            <PasswordInput
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              ariaInvalid={Boolean(errors.password)}
              ariaDescribedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p id="password-error" role="alert" className="mt-1 text-xs text-burgundy">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="text-sm text-ink/70">
              Confirm Password
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              ariaInvalid={Boolean(errors.confirmPassword)}
              ariaDescribedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
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
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
