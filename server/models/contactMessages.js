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
