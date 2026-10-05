import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getFeaturedCustomers: vi.fn(),
  createFeaturedCustomer: vi.fn(),
  deleteFeaturedCustomer: vi.fn(),
}))
vi.mock('../models/featuredCustomers.js', () => ({
  getFeaturedCustomers: mocks.getFeaturedCustomers,
  createFeaturedCustomer: mocks.createFeaturedCustomer,
  deleteFeaturedCustomer: mocks.deleteFeaturedCustomer,
}))

const { listPublicFeaturedCustomers } = await import('./featuredCustomersController.js')

function response() {
  const res = { statusCode: 200, body: null }
  res.status = (code) => ((res.statusCode = code), res)
  res.json = (body) => ((res.body = body), res)
  return res
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.getFeaturedCustomers.mockResolvedValue([])
})

describe('listPublicFeaturedCustomers', () => {
  it('uses a page size of 24 when no limit is given', async () => {
    await listPublicFeaturedCustomers({ query: {} }, response())

    expect(mocks.getFeaturedCustomers).toHaveBeenCalledWith({ limit: 24, offset: 0 })
  })

  it('caps the page size at 100 so the endpoint cannot be used to dump every row', async () => {
    await listPublicFeaturedCustomers({ query: { limit: '100000' } }, response())

    expect(mocks.getFeaturedCustomers).toHaveBeenCalledWith({ limit: 100, offset: 0 })
  })

  it('ignores a negative or non-numeric offset', async () => {
    await listPublicFeaturedCustomers({ query: { limit: '5', offset: '-3' } }, response())
    await listPublicFeaturedCustomers({ query: { offset: 'abc' } }, response())

    expect(mocks.getFeaturedCustomers).toHaveBeenNthCalledWith(1, { limit: 5, offset: 0 })
    expect(mocks.getFeaturedCustomers).toHaveBeenNthCalledWith(2, { limit: 24, offset: 0 })
  })
})
