import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: user.fullName, phone: user.phone })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
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
        <h1 className="font-heading text-3xl text-ink sm:text-4xl">My Profile</h1>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
                className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
              />
            </div>

            {error && <p className="text-sm text-burgundy">{error}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full bg-burgundy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full border border-black/10 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-ink"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-4">
            {savedMessage && <p className="text-sm text-burgundy">{savedMessage}</p>}
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

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-full bg-burgundy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90"
              >
                Edit Profile
              </button>
              <Link
                to="/orders"
                className="rounded-full border border-black/10 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-ink"
              >
                My Orders
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-black/10 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-ink"
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
