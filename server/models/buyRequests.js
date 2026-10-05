import crypto from 'crypto'
import { supabase } from '../config/supabase.js'

export async function createBuyRequest({ items, requester, expiresAt }) {
  const { data, error } = await supabase
    .from('buy_requests')
    .insert({
      token: crypto.randomBytes(24).toString('hex'),
      items,
      requester,
      expires_at: expiresAt,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create buy request: ${error.message}`)
  }
  return data
}

export async function getBuyRequestByToken(token) {
  const { data, error } = await supabase
    .from('buy_requests')
    .select('*')
    .eq('token', token)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch buy request: ${error.message}`)
  }
  return data
}

export function isBuyRequestOpen(request) {
  return Boolean(request) && request.status === 'open' && new Date(request.expires_at) > new Date()
}

export async function markBuyRequestPaid(id) {
  const { error } = await supabase
    .from('buy_requests')
    .update({ status: 'paid' })
    .eq('id', id)
    .eq('status', 'open')

  if (error) {
    throw new Error(`Failed to mark buy request paid: ${error.message}`)
  }
}
