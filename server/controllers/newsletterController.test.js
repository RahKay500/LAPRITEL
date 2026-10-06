import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ addNewsletterSubscriber: vi.fn() }))
vi.mock('../models/newsletter.js', () => ({ addNewsletterSubscriber: mocks.addNewsletterSubscriber }))

const { subscribe } = await import('./newsletterController.js')

function response() {
  const res = { statusCode: 200, body: null }
  res.status = (code) => ((res.statusCode = code), res)
  res.json = (body) => ((res.body = body), res)
  return res
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.addNewsletterSubscriber.mockResolvedValue()
})

describe('subscribe', () => {
  it('saves the address in lower case without surrounding spaces', async () => {
    const res = response()
    await subscribe({ body: { email: '  Ama@Example.COM ' } }, res)

    expect(mocks.addNewsletterSubscriber).toHaveBeenCalledWith('ama@example.com')
    expect(res.statusCode).toBe(201)
  })

  it('passes a save failure on instead of claiming success', async () => {
    mocks.addNewsletterSubscriber.mockRejectedValue(new Error('database down'))
    await expect(subscribe({ body: { email: 'ama@example.com' } }, response())).rejects.toThrow('database down')
  })
})
