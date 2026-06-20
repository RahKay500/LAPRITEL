import { useState } from 'react'
import { Camera, MessageCircle } from 'lucide-react'
import { submitContactForm } from '../services/contact'

const initialForm = { fullName: '', email: '', message: '' }

function validate(form) {
  const errors = {}
  if (!form.fullName.trim()) errors.fullName = 'Full name is required'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address'
  if (!form.message.trim()) errors.message = 'Message is required'
  return errors
}

function ContactPage() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

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
      await submitContactForm(form)
      setForm(initialForm)
      setIsSubmitted(true)
    } catch (error) {
      setServerError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-ink sm:text-4xl">Get in Touch</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">
            Questions about an order, a custom request, or just want to say
            hello? We'd love to hear from you.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            {isSubmitted ? (
              <div className="rounded-2xl border border-black/10 p-6 text-center">
                <p className="font-heading text-xl text-ink">Message Sent</p>
                <p className="mt-2 text-ink/70">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 rounded-full border border-black/10 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-ink"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                  <label htmlFor="message" className="text-sm text-ink/70">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-burgundy">{errors.message}</p>
                  )}
                </div>

                {serverError && <p className="text-sm text-burgundy">{serverError}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-burgundy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-ink">
              Other Ways to Reach Us
            </p>

            <a
              href="https://wa.me/233000000000"
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center gap-3 rounded-2xl border border-black/10 p-4 transition-colors hover:border-burgundy"
            >
              <MessageCircle className="text-burgundy" size={24} strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-ink">WhatsApp</p>
                <p className="text-xs text-ink/60">Chat with us directly</p>
              </div>
            </a>

            <a
              href="https://instagram.com/lapritel"
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center gap-3 rounded-2xl border border-black/10 p-4 transition-colors hover:border-burgundy"
            >
              <Camera className="text-burgundy" size={24} strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-ink">Instagram</p>
                <p className="text-xs text-ink/60">@lapritel</p>
              </div>
            </a>

            <p className="mt-6 text-sm text-ink/70">
              We typically respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
