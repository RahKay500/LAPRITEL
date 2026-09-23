import { describe, expect, it } from 'vitest'
import { isRiskyStatusChange } from './orderStatusRisk'

describe('isRiskyStatusChange', () => {
  it('is not risky when the status does not change', () => {
    expect(isRiskyStatusChange('paid', 'paid')).toBe(false)
  })

  it('is not risky moving forward through the normal flow', () => {
    expect(isRiskyStatusChange('pending', 'paid')).toBe(false)
    expect(isRiskyStatusChange('paid', 'processing')).toBe(false)
    expect(isRiskyStatusChange('processing', 'shipped')).toBe(false)
    expect(isRiskyStatusChange('shipped', 'delivered')).toBe(false)
  })

  it('flags the exact mistake this guard exists for: paid dropped back to pending', () => {
    expect(isRiskyStatusChange('paid', 'pending')).toBe(true)
  })

  it('flags any backward move in the normal flow', () => {
    expect(isRiskyStatusChange('shipped', 'processing')).toBe(true)
    expect(isRiskyStatusChange('delivered', 'paid')).toBe(true)
  })

  it('flags moving to a terminal state regardless of direction', () => {
    expect(isRiskyStatusChange('paid', 'cancelled')).toBe(true)
    expect(isRiskyStatusChange('pending', 'failed')).toBe(true)
  })

  it('flags moving out of a terminal state', () => {
    expect(isRiskyStatusChange('cancelled', 'paid')).toBe(true)
    expect(isRiskyStatusChange('failed', 'pending')).toBe(true)
  })
})
