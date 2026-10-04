import { api } from './api'

export const ORDER_STATUSES = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'failed',
]

export function fetchAdminOrders({ status, search, page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (search) params.set('search', search)
  params.set('page', page)
  params.set('limit', limit)
  return api.get(`/admin/orders?${params.toString()}`)
}

export function updateAdminOrderStatus(reference, status) {
  return api.patch(`/admin/orders/${encodeURIComponent(reference)}/status`, { status })
}

export function fetchAdminCustomers() {
  return api.get('/admin/customers')
}

export function fetchAdminContactMessages() {
  return api.get('/admin/contact-messages')
}

export function fetchAdminFeaturedCustomers() {
  return api.get('/admin/featured-customers')
}

export function createAdminFeaturedCustomer(payload) {
  return api.post('/admin/featured-customers', payload)
}

export function deleteAdminFeaturedCustomer(id) {
  return api.delete(`/admin/featured-customers/${id}`)
}

export function fetchAdminProducts() {
  return api.get('/admin/products')
}

export function createAdminProduct(payload) {
  return api.post('/admin/products', payload)
}

export function createAdminVariant(productId, payload) {
  return api.post(`/admin/products/${productId}/variants`, payload)
}

export function updateAdminVariant(id, payload) {
  return api.patch(`/admin/products/variants/${id}`, payload)
}

export function deleteAdminVariant(id) {
  return api.delete(`/admin/products/variants/${id}`)
}

export function uploadAdminImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  return api.upload('/admin/products/upload-image', formData)
}
