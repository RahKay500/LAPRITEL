import crypto from 'crypto'
import { beforeAll, describe, expect, it } from 'vitest'
import { isValidWebhookSignature } from './paystack.js'

const secret = 'test-secret-key'
const body = Buffer.from(JSON.stringify({ event: 'charge.success', data: { reference: 'ABC' } }))
const sign = (payload) => crypto.createHmac('sha512', secret).update(payload).digest('hex')

describe('isValidWebhookSignature', () => {
  beforeAll(() => {
    process.env.PAYSTACK_SECRET_KEY = secret
  })

  it('accepts a body signed with the secret key', () => {
    expect(isValidWebhookSignature(body, sign(body))).toBe(true)
  })

  it('rejects a body that was changed after signing', () => {
    const tampered = Buffer.from(body.toString().replace('ABC', 'XYZ'))
    expect(isValidWebhookSignature(tampered, sign(body))).toBe(false)
  })

  it('rejects a missing signature', () => {
    expect(isValidWebhookSignature(body, undefined)).toBe(false)
  })

  it('rejects a signature of the wrong length without throwing', () => {
    expect(isValidWebhookSignature(body, 'abc')).toBe(false)
  })
})
