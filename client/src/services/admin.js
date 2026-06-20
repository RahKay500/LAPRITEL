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

export function fetchAdminOrders() {
  return api.get('/admin/orders')
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

export function fetchAdminProducts() {
  return api.get('/admin/products')
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
