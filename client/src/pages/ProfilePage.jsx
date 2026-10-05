import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { usePageMeta } from '../hooks/usePageMeta'
import { sanitizeField } from '../utils/sanitizeField'

function validate(form) {
  const errors = {}
  if (!/^[A-Za-z\s'-]+$/.test(form.fullName.trim())) {
    errors.fullName = 'Enter a valid name (letters only)'
  }
  if (!/^[0-9]{10}$/.test(form.phone.trim())) errors.phone = 'Enter a valid 10-digit phone number'
  return errors
}

function ProfilePage() {
  usePageMeta('My Profile', 'Manage your LAPRITEL account details.')

  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: user.fullName, phone: user.phone })
  const [errors, setErrors] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: sanitizeField(name, value) }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setError('')
    setIsSaving(true)
    try {
      await updateProfile(form)
      setSavedMessage('Profile updated.')
      setIsEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">My Profile</h1>

        {isEditing ? (
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

            {error && (
              <p role="alert" className="text-sm text-burgundy">
                {error}
              </p>
            )}

            <div className="flex items-center gap-6">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full border-2 border-burgundy px-8 py-3 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-sm font-semibold uppercase tracking-wide text-ink/70 underline-offset-4 transition-colors hover:text-burgundy hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-4">
            {savedMessage && (
              <p role="status" className="text-sm text-burgundy">
                {savedMessage}
              </p>
            )}
            <div>
              <p className="text-sm text-ink/60">Full Name</p>
              <p className="text-ink">{user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-ink/60">Email</p>
              <p className="text-ink">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-ink/60">Phone Number</p>
              <p className="text-ink">{user.phone}</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-full border-2 border-burgundy px-8 py-3 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white"
              >
                Edit Profile
              </button>
              <Link
                to="/orders"
                className="text-sm font-semibold uppercase tracking-wide text-ink/70 underline-offset-4 transition-colors hover:text-burgundy hover:underline"
              >
                My Orders
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-semibold uppercase tracking-wide text-ink/70 underline-offset-4 transition-colors hover:text-burgundy hover:underline"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
