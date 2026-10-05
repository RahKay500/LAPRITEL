import { useState } from 'react'
import {
  createAdminFeaturedCustomer,
  deleteAdminFeaturedCustomer,
  fetchAdminFeaturedCustomers,
  uploadAdminImage,
} from '../../services/admin'
import { usePagedList } from '../../hooks/usePagedList'
import { NAME_PATTERN } from '../../shared/validation'

const QUOTE_MAX = 280
const PHOTO_MAX_SIDE = 1600
const emptyForm = { firstName: '', quote: '', consentConfirmed: false }

// Full-size camera photos are often over Vercel's ~4.5 MB request limit, so
// shrink them in the browser before uploading.
async function shrinkPhoto(file) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, PHOTO_MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))
  return new File([blob], 'featured.jpg', { type: 'image/jpeg' })
}

function AdminFeaturedPage() {
  const {
    items: customers,
    setItems: setCustomers,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    setError,
    loadMore,
  } = usePagedList(fetchAdminFeaturedCustomers)
  const [form, setForm] = useState(emptyForm)
  const [photo, setPhoto] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState('')

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    if (!photo) return setFormError('Choose a photo first.')
    if (!NAME_PATTERN.test(form.firstName.trim()) || form.firstName.trim().length > 50) {
      return setFormError('Enter a first name (letters only).')
    }
    if (!form.quote.trim() || form.quote.trim().length > QUOTE_MAX) {
      return setFormError(`Enter a quote (up to ${QUOTE_MAX} characters).`)
    }
    if (!form.consentConfirmed) {
      return setFormError('Confirm the customer agreed to be featured before saving.')
    }

    setIsSaving(true)
    try {
      const { imageUrl } = await uploadAdminImage(await shrinkPhoto(photo))
      const customer = await createAdminFeaturedCustomer({
        firstName: form.firstName.trim(),
        quote: form.quote.trim(),
        imageUrl,
        consentConfirmed: true,
      })
      setCustomers((current) => [customer, ...current])
      setForm(emptyForm)
      setPhoto(null)
      event.target.reset()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(customer) {
    if (!window.confirm(`Remove ${customer.first_name} from the featured section?`)) return
    try {
      await deleteAdminFeaturedCustomer(customer.id)
      setCustomers((current) => current.filter((item) => item.id !== customer.id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-4 border border-black/15 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">Add a featured customer</h2>

        <div>
          <span className="text-sm text-ink/85">Photo of them with a bag</span>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label
              htmlFor="photo"
              className="cursor-pointer rounded-full border-2 border-burgundy px-6 py-2 text-xs font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white focus-within:ring-2 focus-within:ring-burgundy/40"
            >
              Choose photo
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(event) => setPhoto(event.target.files[0] ?? null)}
              className="sr-only"
            />
            <span className="text-sm text-ink/75">{photo ? photo.name : 'No file selected'}</span>
          </div>
        </div>

        <div>
          <label htmlFor="firstName" className="text-sm text-ink/85">First name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            className="mt-1 w-full border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
          />
        </div>

        <div>
          <label htmlFor="quote" className="text-sm text-ink/85">
            Quote ({form.quote.length}/{QUOTE_MAX})
          </label>
          <textarea
            id="quote"
            name="quote"
            rows={3}
            value={form.quote}
            onChange={handleChange}
            maxLength={QUOTE_MAX}
            className="mt-1 w-full border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-ink/85">
          <input
            type="checkbox"
            name="consentConfirmed"
            checked={form.consentConfirmed}
            onChange={handleChange}
            className="mt-1 h-4 w-4 accent-burgundy"
          />
          They have agreed to their photo and first name being shown on the website.
        </label>

        {formError && <p role="alert" className="text-sm text-burgundy">{formError}</p>}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full border-2 border-burgundy px-8 py-2.5 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Add to featured'}
        </button>
      </form>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">Currently featured</h2>
        {isLoading ? (
          <p className="mt-4 text-ink/75">Loading...</p>
        ) : error ? (
          <p className="mt-4 text-sm text-burgundy">{error}</p>
        ) : customers.length === 0 ? (
          <p className="mt-4 text-ink/75">No one is featured yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {customers.map((customer) => (
              <div key={customer.id} className="border border-black/15">
                <img src={customer.image_url} alt={`Photo of ${customer.first_name}`} className="mx-auto block max-h-120 w-auto max-w-full" />
                <div className="p-4">
                  <p className="text-sm font-medium text-ink">{customer.first_name}</p>
                  <p className="mt-1 text-sm text-ink/85">&ldquo;{customer.quote}&rdquo;</p>
                  <button
                    type="button"
                    onClick={() => handleDelete(customer)}
                    className="mt-3 text-xs font-semibold uppercase tracking-wide text-burgundy hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={isLoadingMore}
              className="rounded-full border-2 border-burgundy px-8 py-2.5 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoadingMore ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminFeaturedPage
