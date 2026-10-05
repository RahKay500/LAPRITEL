import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PaystackPop from '@paystack/inline-js'
import { useCart } from '../context/useCart'
import { api } from '../services/api'
import { createBuyRequest } from '../services/buyRequests'
import { usePageMeta } from '../hooks/usePageMeta'
import { sanitizeField } from '../utils/sanitizeField'
import { initialForm, readSavedDetails, persistDetails, validate } from '../utils/checkout'
import CustomerDetails from '../components/checkout/CustomerDetails'
import DeliveryDetails from '../components/checkout/DeliveryDetails'
import OrderSummary from '../components/checkout/OrderSummary'

function CheckoutPage() {
  usePageMeta('Checkout', 'Enter your delivery details and complete payment securely.')

  const { items, selectedItems: checkoutItems, selectedSubtotal: subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [savedDetails] = useState(readSavedDetails)
  const [form, setForm] = useState(savedDetails ?? initialForm)
  const [saveDetails, setSaveDetails] = useState(Boolean(savedDetails))
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [buyLink, setBuyLink] = useState('')
  const [isCreatingLink, setIsCreatingLink] = useState(false)

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

  const subtotalPesewas = Math.round(subtotal * 100)
  const totalPesewas = subtotalPesewas
  const totalToPay = totalPesewas / 100

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: sanitizeField(name, value) }))
  }

  async function handleBuyForMe() {
    const validation = validate(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    setIsCreatingLink(true)
    setPaymentError('')
    try {
      const { token } = await createBuyRequest({
        items: checkoutItems.map((item) => ({ slug: item.slug, quantity: item.quantity })),
        requester: form,
      })
      setBuyLink(`${window.location.origin}/buy-for-me/${token}`)
    } catch (error) {
      setPaymentError(error.message || 'Could not create the link. Please try again.')
    } finally {
      setIsCreatingLink(false)
    }
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
      metadata: {
        items: checkoutItems.map((item) => ({
          slug: item.slug,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        customer: form,
      },
      onSuccess: async (transaction) => {
        persistDetails(form, saveDetails)
        try {
          await api.post('/payments/verify', {
            reference: transaction.reference,
            items: checkoutItems.map((item) => ({
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

  if (checkoutItems.length === 0) {
    return (
      <div className="px-4 py-20 text-center sm:px-6 lg:px-12">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Checkout
        </h1>
        <p className="mt-3 text-ink/70">
          Nothing is selected for checkout yet. Go back to your cart and choose what to buy.
        </p>
        <Link
          to="/cart"
          className="mt-8 inline-block rounded-full border-2 border-burgundy px-8 py-3 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white"
        >
          Back to Cart
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
          <CustomerDetails form={form} errors={errors} onChange={handleChange} />

          <DeliveryDetails form={form} setForm={setForm} errors={errors} onChange={handleChange} />
          </div>

          <OrderSummary
            checkoutItems={checkoutItems}
            subtotal={subtotal}
            totalToPay={totalToPay}
            saveDetails={saveDetails}
            setSaveDetails={setSaveDetails}
            publicKey={publicKey}
            paymentError={paymentError}
            isProcessing={isProcessing}
            isCreatingLink={isCreatingLink}
            buyLink={buyLink}
            onBuyForMe={handleBuyForMe}
          />
        </form>
      </div>
    </div>
  )
}

export default CheckoutPage
