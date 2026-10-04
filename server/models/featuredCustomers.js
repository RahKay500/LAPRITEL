import { supabase } from '../config/supabase.js'

export async function getFeaturedCustomers() {
  const { data, error } = await supabase
    .from('featured_customers')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch featured customers: ${error.message}`)
  }

  return data
}

export async function createFeaturedCustomer({ firstName, quote, imageUrl }) {
  const { data, error } = await supabase
    .from('featured_customers')
    .insert({ first_name: firstName, quote, image_url: imageUrl })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save featured customer: ${error.message}`)
  }

  return data
}

export async function deleteFeaturedCustomer(id) {
  const { error } = await supabase.from('featured_customers').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete featured customer: ${error.message}`)
  }
}
