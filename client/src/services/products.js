import { api } from './api'

export function fetchProducts() {
  return api.get('/products')
}
