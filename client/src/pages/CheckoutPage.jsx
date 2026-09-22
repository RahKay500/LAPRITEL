import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PaystackPop from '@paystack/inline-js'
import { useCart } from '../context/useCart'
import { api } from '../services/api'
import { grossUpForPaystackFee } from '../utils/pricing'
import { usePageMeta } from '../hooks/usePageMeta'

const ghanaRegions = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Western North',
  'Central',
  'Eastern',
  'Volta',
  'Oti',
  'Northern',
  'Savannah',
  'North East',
  'Upper East',
  'Upper West',
  'Bono',
  'Bono East',
  'Ahafo',
]

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  region: '',
  notes: '',
}

function validate(form) {
  const errors = {}
  if (!/^[A-Za-z\s'-]+$/.test(form.fullName.trim())) {
    errors.fullName = 'Enter a valid name (letters only)'
  }
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address'
  if (!/^[0-9]{10}$/.test(form.phone.trim())) errors.phone = 'Enter a valid 10-digit phone number'
  if (!form.address.trim()) errors.address = 'Delivery address is required'
  if (!form.city.trim()) errors.city = 'City/town is required'
  if (!form.region) errors.region = 'Select a region'
  return errors
}

function CheckoutPage() {
  usePageMeta('Checkout', 'Enter your delivery details and complete payment securely.')

  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

  const subtotalPesewas = Math.round(subtotal * 100)
  const totalPesewas = grossUpForPaystackFee(subtotalPesewas)
  const processingFee = (totalPesewas - subtotalPesewas) / 100
  const totalToPay = totalPesewas / 100

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handlePayment(event) {
    event.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setPaymentError('')
    setIsProcessing(true)

    const paystack = new PaystackPop()
    paystack.newTransaction({
      key: publicKey,
      email: form.email,
      amount: totalPesewas,
      currency: 'GHS',
      onSuccess: async (transaction) => {
        try {
          await api.post('/payments/verify', {
            reference: transaction.reference,
            items: items.map((item) => ({
              slug: item.slug,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            customer: form,
          })
          clearCart()
          navigate(`/order-confirmation?reference=${transaction.reference}`)
        } catch {
          setPaymentError(
            'We could not verify your payment. Please contact us before retrying.'
          )
          setIsProcessing(false)
        }
      },
      onCancel: () => {
        setIsProcessing(false)
      },
    })
  }

  if (items.length === 0) {
    return (
      <div className="px-4 py-20 text-center sm:px-6 lg:px-12">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Checkout
        </h1>
        <p className="mt-3 text-ink/70">Your cart is empty.</p>
        <Link
          to="/shop"
          className="mt-8 inline-block rounded-full border-2 border-burgundy px-8 py-3 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Checkout
        </h1>

        <form
          onSubmit={handlePayment}
          noValidate
          className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16"
        >
          <div className="space-y-8">
            <fieldset>
              <legend className="text-sm font-semibold uppercase tracking-wide text-ink">
                Customer Details
              </legend>
              <div className="mt-4 space-y-4">
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

                <div className="grid gap-4 sm:grid-cols-2">
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
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold uppercase tracking-wide text-ink">
                Delivery Address
              </legend>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="address" className="text-sm text-ink/70">
                    Street Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby={errors.address ? 'address-error' : undefined}
                    className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                  />
                  {errors.address && (
                    <p id="address-error" role="alert" className="mt-1 text-xs text-burgundy">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="city" className="text-sm text-ink/70">
                      City / Town
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.city)}
                      aria-describedby={errors.city ? 'city-error' : undefined}
                      className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                    />
                    {errors.city && (
                      <p id="city-error" role="alert" className="mt-1 text-xs text-burgundy">
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="region" className="text-sm text-ink/70">
                      Region
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={form.region}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.region)}
                      aria-describedby={errors.region ? 'region-error' : undefined}
                      className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                    >
                      <option value="">Select region</option>
                      {ghanaRegions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    {errors.region && (
                      <p id="region-error" role="alert" className="mt-1 text-xs text-burgundy">
                        {errors.region}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="text-sm text-ink/70">
                    Delivery Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={form.notes}
                    onChange={handleChange}
                    className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                  />
                </div>
              </div>
            </fieldset>
          </div>

          <div>
            <div className="border border-black/10 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">
                Order Summary
              </h2>
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={item.slug} className="flex justify-between text-sm">
                    <span className="text-ink/70">
                      {item.productName} ({item.name}) x{item.quantity}
                    </span>
                    <span className="text-ink">GHS {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-black/10 pt-4 text-sm">
                <div className="flex justify-between text-ink/70">
                  <span>Subtotal</span>
                  <span>GHS {subtotal}</span>
                </div>
                <div className="flex justify-between text-ink/70">
                  <span>Payment Processing Fee</span>
                  <span>GHS {processingFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between border-t border-black/10 pt-4 text-base">
                <span className="font-medium text-ink">Total to Pay</span>
                <span className="text-xl font-extrabold text-burgundy">
                  GHS {totalToPay.toFixed(2)}
                </span>
              </div>

              {!publicKey && (
                <p className="mt-4 text-xs text-burgundy">
                  Paystack public key not configured. Add
                  VITE_PAYSTACK_PUBLIC_KEY to client/.env to enable payment.
                </p>
              )}

              {paymentError && (
                <p role="alert" className="mt-4 text-xs text-burgundy">
                  {paymentError}
                </p>
              )}

              <button
                type="submit"
                disabled={!publicKey || isProcessing}
                className="mt-6 w-full rounded-full border-2 border-burgundy px-8 py-3 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutPage
