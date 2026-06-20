// Paystack's Ghana rate is 1.95% of the transaction, deducted before payout.
// Mirrored in client/src/utils/pricing.js — keep both in sync if this changes.
export const PAYSTACK_FEE_RATE = 0.0195

// Grosses up an amount (in pesewas) so that after Paystack deducts its fee,
// the seller still nets the original amount. Rounds up so the seller never
// receives less than intended; the customer absorbs the rounding.
export function grossUpForPaystackFee(amountInPesewas) {
  return Math.ceil(amountInPesewas / (1 - PAYSTACK_FEE_RATE))
}
