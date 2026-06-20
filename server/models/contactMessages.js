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

export async function getAllContactMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`)
  }

  return data
}
