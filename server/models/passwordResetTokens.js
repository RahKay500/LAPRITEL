import crypto from 'crypto'
import { supabase } from '../config/supabase.js'

const TOKEN_TTL_MS = 60 * 60 * 1000

function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex')
}

export async function createResetToken(userId) {
  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = hashToken(rawToken)
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString()

  const { error } = await supabase
    .from('password_reset_tokens')
    .insert({ user_id: userId, token_hash: tokenHash, expires_at: expiresAt })

  if (error) {
    throw new Error(`Failed to create reset token: ${error.message}`)
  }

  return rawToken
}

export async function findValidResetToken(rawToken) {
  const tokenHash = hashToken(rawToken)

  const { data, error } = await supabase
    .from('password_reset_tokens')
    .select('id, user_id, expires_at, used_at')
    .eq('token_hash', tokenHash)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to look up reset token: ${error.message}`)
  }

  if (!data || data.used_at || new Date(data.expires_at) < new Date()) {
    return null
  }

  return data
}

export async function invalidateResetTokensForUser(userId) {
  const { error } = await supabase
    .from('password_reset_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('used_at', null)

  if (error) {
    throw new Error(`Failed to invalidate reset tokens: ${error.message}`)
  }
}
