import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

function validate(form) {
  const errors = {}
  if (!/^[A-Za-z\s'-]+$/.test(form.fullName.trim())) {
    errors.fullName = 'Enter a valid name (letters only)'
  }
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address'
  if (!/^[0-9]{10}$/.test(form.phone.trim())) errors.phone = 'Enter a valid 10-digit phone number'
  if (form.password.length < 8) errors.password = 'Password must be at least 8 characters'
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match'
  return errors
}

function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
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
        <h1 className="font-heading text-3xl text-ink sm:text-4xl">
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
              className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-burgundy">{errors.fullName}</p>
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
              className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            />
            {errors.email && <p className="mt-1 text-xs text-burgundy">{errors.email}</p>}
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
              className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            />
            {errors.phone && <p className="mt-1 text-xs text-burgundy">{errors.phone}</p>}
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
            {errors.password && (
              <p className="mt-1 text-xs text-burgundy">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="text-sm text-ink/70">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-burgundy">{errors.confirmPassword}</p>
            )}
          </div>

          {serverError && <p className="text-sm text-burgundy">{serverError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-burgundy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
