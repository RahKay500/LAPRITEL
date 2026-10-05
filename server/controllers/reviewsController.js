import { getOrderByReference } from '../models/orders.js'
import { getVariantProductSlug } from '../models/products.js'
import {
  createReview,
  listApprovedReviews,
  listReviewsByStatus,
  listReviewsForUser,
  setReviewStatus,
} from '../models/reviews.js'

export async function submitReview(req, res) {
  const { orderReference, colorSlug, rating, body } = req.body
  const order = await getOrderByReference(orderReference)

  if (!order || order.user_id !== req.user.id) {
    return res.status(404).json({ message: 'Order not found' })
  }
  if (order.status !== 'delivered') {
    return res.status(400).json({ message: 'You can review a bag once your order has been delivered.' })
  }
  if (!order.items.some((item) => item.color_slug === colorSlug)) {
    return res.status(400).json({ message: 'That bag is not part of this order.' })
  }

  const productSlug = await getVariantProductSlug(colorSlug)
  if (!productSlug) {
    return res.status(400).json({ message: 'That bag is no longer available for reviews.' })
  }

  const review = await createReview({
    order_id: order.id,
    product_slug: productSlug,
    color_slug: colorSlug,
    rating: Number(rating),
    body: body.trim(),
    author_name: (order.customer_name || 'Customer').split(' ')[0],
  })
  if (!review) {
    return res.status(409).json({ message: 'You have already reviewed this bag.' })
  }

  res.status(201).json({ message: 'Thank you. Your review will appear once it has been approved.' })
}

export async function getProductReviews(req, res) {
  const productSlug = String(req.query.product || '')
  if (!productSlug) {
    return res.status(400).json({ message: 'Choose a product.' })
  }

  const reviews = await listApprovedReviews(productSlug)
  const count = reviews.length
  const average = count ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10 : null
  res.json({ average, count, reviews })
}

export async function getMyReviews(req, res) {
  res.json(await listReviewsForUser(req.user.id))
}

export async function listAdminReviews(req, res) {
  const status = req.query.status || null
  res.json(await listReviewsByStatus(status))
}

export async function updateReviewStatus(req, res) {
  const updated = await setReviewStatus(req.params.id, req.body.status)
  if (!updated) {
    return res.status(404).json({ message: 'Review not found' })
  }
  res.json({ message: 'Review updated' })
}
