import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PaystackPop from '@paystack/inline-js'
import { fetchBuyRequest, payBuyRequest } from '../services/buyRequests'
import { usePageMeta } from '../hooks/usePageMeta'
import { EMAIL_PATTERN } from '../shared/validation'

function BuyForMePage() {
  usePageMeta('Buy for me', 'Pay for a LAPRITEL bag for a friend.')
  const { token } = useParams()
  const navigate = useNavigate()
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

  const [request, setRequest] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [payerEmail, setPayerEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    let isMounted = true
    fetchBuyRequest(token)
      .then((data) => {
        if (isMounted) setRequest(data)
      })
      .catch((error) => {
        if (isMounted) setLoadError(error.message || 'This link is no longer available.')
      })
    return () => {
      isMounted = false
    }
  }, [token])

  function handlePay(event) {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(payerEmail)) {
      setEmailError('Enter a valid email address')
      return
    }
    setEmailError('')
    setPaymentError('')
    setIsProcessing(true)

    const paystack = new PaystackPop()
    paystack.newTransaction({
      key: publicKey,
      email: payerEmail,
      amount: Math.round(request.total * 100),
      currency: 'GHS',
      metadata: { buyRequestToken: token },
      onSuccess: async (transaction) => {
        try {
          await payBuyRequest(token, { reference: transaction.reference, payerEmail })
          navigate(`/order-confirmation?reference=${transaction.reference}`)
        } catch {
          setPaymentError(
            'Payment went through but we could not confirm it yet. Keep your reference and contact us.'
          )
          setIsProcessing(false)
        }
      },
      onCancel: () => setIsProcessing(false),
    })
  }

  if (loadError) {
    return (
      <div className="px-4 py-20 text-center sm:px-6 lg:px-12">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Buy for me
        </h1>
        <p className="mt-3 text-ink/70">{loadError}</p>
      </div>
    )
  }

  if (!request) {
    return <p className="px-4 py-20 text-center text-ink/60">Loading…</p>
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Buy for {request.requesterName}
        </h1>
        <p className="mt-3 text-ink/70">
          {request.requesterName} would like these LAPRITEL bags. Your payment covers them and they
          are delivered to {request.requesterName}.
        </p>

        <div className="mt-8 space-y-3 border-y border-black/10 py-6">
          {request.items.map((item) => (
            <div key={`${item.productName}-${item.name}`} className="flex justify-between text-sm">
              <span className="text-ink/80">
                {item.productName} ({item.name}) x{item.quantity}
              </span>
              <span className="text-ink">GHS {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 text-base">
            <span className="font-medium text-ink">Total</span>
            <span className="text-xl font-extrabold text-burgundy">GHS {request.total}</span>
          </div>
        </div>

        <form onSubmit={handlePay} noValidate className="mt-8 space-y-4">
          <div>
            <label htmlFor="payerEmail" className="text-sm text-ink/70">
              Your email (for your receipt)
            </label>
            <input
              id="payerEmail"
              type="email"
              value={payerEmail}
              onChange={(event) => setPayerEmail(event.target.value)}
              aria-invalid={Boolean(emailError)}
              className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            />
            {emailError && <p className="mt-1 text-xs text-burgundy">{emailError}</p>}
          </div>

          {paymentError && <p className="text-sm text-burgundy">{paymentError}</p>}

          <button
            type="submit"
            disabled={!publicKey || isProcessing}
            className="w-full rounded-full border-2 border-burgundy px-8 py-3 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : `Pay GHS ${request.total}`}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BuyForMePage
