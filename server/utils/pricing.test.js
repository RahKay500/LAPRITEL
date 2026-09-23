import { describe, expect, it } from 'vitest'
import { grossUpForPaystackFee, PAYSTACK_FEE_RATE } from './pricing.js'

describe('grossUpForPaystackFee', () => {
  it('grosses up so the seller nets the original amount after the fee is deducted', () => {
    const sellerAmount = 50000 // GHS 500.00 in pesewas
    const charged = grossUpForPaystackFee(sellerAmount)
    const netAfterFee = charged * (1 - PAYSTACK_FEE_RATE)
    // The customer absorbs rounding, so the seller must never net less than
    // intended -- only ever the same or a fraction of a pesewa more.
    expect(netAfterFee).toBeGreaterThanOrEqual(sellerAmount)
    expect(netAfterFee - sellerAmount).toBeLessThan(1)
  })

  it('rounds up rather than down, so the seller is never short-changed', () => {
    // 100 pesewas / (1 - 0.0195) = 101.988..., must round up to 102, not 101.
    expect(grossUpForPaystackFee(100)).toBe(102)
  })

  it('returns 0 for a 0 amount', () => {
    expect(grossUpForPaystackFee(0)).toBe(0)
  })
})
