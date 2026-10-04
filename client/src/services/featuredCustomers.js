import { api } from './api'

export function fetchFeaturedCustomers({ limit, offset = 0 } = {}) {
  const params = new URLSearchParams()
  if (limit) params.set('limit', limit)
  if (offset) params.set('offset', offset)
  const query = params.toString()
  return api.get(`/featured-customers${query ? `?${query}` : ''}`)
}
