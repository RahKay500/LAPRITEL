import { api } from './api'

export function createBuyRequest(payload) {
  return api.post('/buy-requests', payload)
}

export function fetchBuyRequest(token) {
  return api.get(`/buy-requests/${encodeURIComponent(token)}`)
}

export function payBuyRequest(token, payload) {
  return api.post(`/buy-requests/${encodeURIComponent(token)}/pay`, payload)
}
