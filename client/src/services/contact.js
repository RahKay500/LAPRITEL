import { api } from './api'

export function submitContactForm(payload) {
  return api.post('/contact', payload)
}
