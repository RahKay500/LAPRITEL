import { supabase } from '../config/supabase.js'

export async function addNewsletterSubscriber(email) {
  const { error } = await supabase.from('newsletter_subscribers').insert({ email })
  if (error && error.code !== '23505') {
    throw new Error(`Failed to save subscriber: ${error.message}`)
  }
}
