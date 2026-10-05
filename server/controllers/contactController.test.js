import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ createContactMessage: vi.fn() }))
vi.mock('../models/contactMessages.js', () => ({ createContactMessage: mocks.createContactMessage }))

const { submitContactMessage } = await import('./contactController.js')

function response() {
  const res = { statusCode: 200, body: null }
  res.status = (code) => ((res.statusCode = code), res)
  res.json = (body) => ((res.body = body), res)
  return res
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.createContactMessage.mockResolvedValue({ id: 'm1' })
})

describe('submitContactMessage', () => {
  it('stores the message and confirms it to the visitor', async () => {
    const res = response()
    await submitContactMessage(
      { body: { fullName: 'Ama Mensah', email: 'ama@example.com', message: 'Do you deliver to Kumasi?' } },
      res
    )

    expect(mocks.createContactMessage).toHaveBeenCalledWith({
      fullName: 'Ama Mensah',
      email: 'ama@example.com',
      message: 'Do you deliver to Kumasi?',
    })
    expect(res.statusCode).toBe(201)
  })
})
