import LeadTimeNote from '../LeadTimeNote'

export default function OrderSummary({
  checkoutItems,
  subtotal,
  totalToPay,
  saveDetails,
  setSaveDetails,
  publicKey,
  paymentError,
  isProcessing,
  isCreatingLink,
  buyLink,
  onBuyForMe,
}) {
  return (
    <div>
      <div className="border border-black/10 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">
          Order Summary
        </h2>
        <div className="mt-4 space-y-3">
          {checkoutItems.map((item) => (
            <div key={item.key} className="flex justify-between text-sm">
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
          <LeadTimeNote items={checkoutItems} className="text-right" />
        </div>

        <div className="mt-4 flex justify-between border-t border-black/10 pt-4 text-base">
          <span className="font-medium text-ink">Total to Pay</span>
          <span className="text-xl font-extrabold text-burgundy">
            GHS {totalToPay.toFixed(2)}
          </span>
        </div>
        <p className="mt-2 text-right text-xs text-ink/60">
          A payment processing fee may be added by Paystack at the final payment.
        </p>

        <label className="mt-6 flex items-start gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={saveDetails}
            onChange={(event) => setSaveDetails(event.target.checked)}
            className="mt-1 h-4 w-4 accent-burgundy"
          />
          <span>Save my details on this device for next time</span>
        </label>

        {!publicKey && (
          <p className="mt-4 text-xs text-burgundy">
            Online payment is unavailable right now. Please try again shortly.
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

        <button
          type="button"
          onClick={onBuyForMe}
          disabled={isCreatingLink || checkoutItems.length === 0}
          className="mt-3 w-full rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-widest text-burgundy underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCreatingLink ? 'Creating link...' : 'Buy for me'}
        </button>

        {buyLink && (
          <div className="mt-4 space-y-3 border border-black/10 p-4 text-left text-sm">
            <p className="text-ink/80">
              Send this link to the friend who will pay. Your order is delivered to you.
            </p>
            <p className="break-all text-xs text-ink/70">{buyLink}</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(buyLink)}
                className="rounded-full border border-burgundy px-4 py-2 text-xs font-bold uppercase tracking-widest text-burgundy"
              >
                Copy link
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Buy for me on LAPRITEL: ${buyLink}`)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-burgundy px-4 py-2 text-xs font-bold uppercase tracking-widest text-burgundy"
              >
                Share on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
