import { api } from './api'

export function fetchFeaturedCustomers() {
  return api.get('/featured-customers')
}
