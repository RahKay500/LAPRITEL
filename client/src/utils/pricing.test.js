import { describe, expect, it } from 'vitest'
import { grossUpForPaystackFee, PAYSTACK_FEE_RATE } from './pricing'

// This file is mirrored from server/utils/pricing.js on purpose (see that
// file's comment) -- the client shows the pre-checkout total the customer
// sees, the server independently recomputes it to validate the actual
// Paystack charge, and the two must agree or legitimate payments get
// rejected. Testing both copies guards against them silently drifting apart.
describe('grossUpForPaystackFee (client copy)', () => {
  it('grosses up so the seller nets the original amount after the fee is deducted', () => {
    const sellerAmount = 50000
    const charged = grossUpForPaystackFee(sellerAmount)
    const netAfterFee = charged * (1 - PAYSTACK_FEE_RATE)
    expect(netAfterFee).toBeGreaterThanOrEqual(sellerAmount)
    expect(netAfterFee - sellerAmount).toBeLessThan(1)
  })

  it('matches the server copy for the same input', () => {
    expect(grossUpForPaystackFee(100)).toBe(102)
  })
})
