import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getOrderByReference: vi.fn(),
  getVariantProductSlug: vi.fn(),
  createReview: vi.fn(),
  listApprovedReviews: vi.fn(),
}))

vi.mock('../models/orders.js', () => ({ getOrderByReference: mocks.getOrderByReference }))
vi.mock('../models/products.js', () => ({ getVariantProductSlug: mocks.getVariantProductSlug }))
vi.mock('../models/reviews.js', () => ({
  createReview: mocks.createReview,
  listApprovedReviews: mocks.listApprovedReviews,
  listReviewsByStatus: vi.fn(),
  listReviewsForUser: vi.fn(),
  setReviewStatus: vi.fn(),
}))

const { submitReview, getProductReviews } = await import('./reviewsController.js')

function response() {
  const res = { statusCode: 200, body: null }
  res.status = (code) => ((res.statusCode = code), res)
  res.json = (body) => ((res.body = body), res)
  return res
}

const delivered = {
  id: 'o1',
  user_id: 'owner',
  status: 'delivered',
  customer_name: 'Ama Mensah',
  items: [{ color_slug: 'glanzy-pink' }],
}

const request = (overrides = {}) => ({
  user: { id: 'owner' },
  body: { orderReference: 'REF1', colorSlug: 'glanzy-pink', rating: 5, body: 'Beautiful, exactly as pictured.', ...overrides },
})

beforeEach(() => {
  vi.clearAllMocks()
  mocks.getOrderByReference.mockResolvedValue(delivered)
  mocks.getVariantProductSlug.mockResolvedValue('bag-glanzy')
  mocks.createReview.mockResolvedValue({ id: 'r1' })
})

describe('submitReview', () => {
  it('stores a pending review under the first name only', async () => {
    const res = response()
    await submitReview(request(), res)

    expect(res.statusCode).toBe(201)
    expect(mocks.createReview).toHaveBeenCalledWith(
      expect.objectContaining({ product_slug: 'bag-glanzy', color_slug: 'glanzy-pink', rating: 5, author_name: 'Ama' })
    )
  })

  it('does not reveal someone else\'s order', async () => {
    const res = response()
    await submitReview({ ...request(), user: { id: 'someone-else' } }, res)

    expect(res.statusCode).toBe(404)
    expect(mocks.createReview).not.toHaveBeenCalled()
  })

  it('refuses a review before the order is delivered', async () => {
    mocks.getOrderByReference.mockResolvedValue({ ...delivered, status: 'shipped' })
    const res = response()
    await submitReview(request(), res)

    expect(res.statusCode).toBe(400)
    expect(mocks.createReview).not.toHaveBeenCalled()
  })

  it('refuses a colour that was not in the order', async () => {
    const res = response()
    await submitReview(request({ colorSlug: 'glanzy-red' }), res)

    expect(res.statusCode).toBe(400)
    expect(mocks.createReview).not.toHaveBeenCalled()
  })

  it('refuses a second review of the same colour from the same order', async () => {
    mocks.createReview.mockResolvedValue(null)
    const res = response()
    await submitReview(request(), res)

    expect(res.statusCode).toBe(409)
  })
})

describe('getProductReviews', () => {
  it('returns the average and count from approved reviews only', async () => {
    mocks.listApprovedReviews.mockResolvedValue([
      { rating: 5, body: 'Lovely bag, arrived quickly.' },
      { rating: 4, body: 'Beautiful beadwork, very happy.' },
    ])
    const res = response()
    await getProductReviews({ query: { product: 'bag-glanzy' } }, res)

    expect(res.body.average).toBe(4.5)
    expect(res.body.count).toBe(2)
  })

  it('returns no average when a bag has no reviews yet', async () => {
    mocks.listApprovedReviews.mockResolvedValue([])
    const res = response()
    await getProductReviews({ query: { product: 'bag-glanzy' } }, res)

    expect(res.body).toEqual({ average: null, count: 0, reviews: [] })
  })
})
