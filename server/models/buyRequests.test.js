import { describe, expect, it, vi } from 'vitest'

vi.mock('../config/supabase.js', () => ({ supabase: {} }))

const { isBuyRequestOpen } = await import('./buyRequests.js')

const future = new Date(Date.now() + 60_000).toISOString()
const past = new Date(Date.now() - 60_000).toISOString()

describe('isBuyRequestOpen', () => {
  it('is open before expiry and before it is paid', () => {
    expect(isBuyRequestOpen({ status: 'open', expires_at: future })).toBe(true)
  })

  it('is closed once it has expired', () => {
    expect(isBuyRequestOpen({ status: 'open', expires_at: past })).toBe(false)
  })

  it('is closed once it has been paid', () => {
    expect(isBuyRequestOpen({ status: 'paid', expires_at: future })).toBe(false)
  })

  it('is closed when the link does not exist', () => {
    expect(isBuyRequestOpen(null)).toBe(false)
  })
})
