import { api } from './api'

export function submitReview(payload) {
  return api.post('/reviews', payload)
}

export function fetchProductReviews(productSlug) {
  return api.get(`/reviews?product=${encodeURIComponent(productSlug)}`)
}

export function fetchMyReviews() {
  return api.get('/reviews/mine')
}

export function fetchAdminReviews(status) {
  return api.get(`/admin/reviews${status ? `?status=${encodeURIComponent(status)}` : ''}`)
}

export function updateAdminReview(id, status) {
  return api.patch(`/admin/reviews/${encodeURIComponent(id)}`, { status })
}
