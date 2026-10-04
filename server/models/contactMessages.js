import { supabase } from '../config/supabase.js'

export async function createContactMessage({ fullName, email, message }) {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({ full_name: fullName, email, message })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save message: ${error.message}`)
  }

  return data
}

export async function getAllContactMessages({ limit, offset = 0 } = {}) {
  let query = supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.range(offset, offset + limit - 1)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`)
  }

  return data
}
