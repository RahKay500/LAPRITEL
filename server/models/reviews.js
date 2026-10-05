import { supabase } from '../config/supabase.js'

export async function createReview(review) {
  const { data, error } = await supabase.from('reviews').insert(review).select().single()
  if (error) {
    if (error.code === '23505') return null
    throw new Error(`Failed to create review: ${error.message}`)
  }
  return data
}

export async function listApprovedReviews(productSlug) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, body, author_name, created_at')
    .eq('product_slug', productSlug)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Failed to fetch reviews: ${error.message}`)
  return data
}

export async function listReviewsByStatus(status) {
  let query = supabase
    .from('reviews')
    .select('id, product_slug, color_slug, rating, body, author_name, status, created_at')
    .order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch reviews: ${error.message}`)
  return data
}

export async function listReviewsForUser(userId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('color_slug, status, orders!inner(user_id, reference)')
    .eq('orders.user_id', userId)
  if (error) throw new Error(`Failed to fetch your reviews: ${error.message}`)
  return data.map((row) => ({ colorSlug: row.color_slug, status: row.status, reference: row.orders.reference }))
}

export async function setReviewStatus(id, status) {
  const { data, error } = await supabase
    .from('reviews')
    .update({ status })
    .eq('id', id)
    .select('id')
    .maybeSingle()
  if (error) throw new Error(`Failed to update review: ${error.message}`)
  return data
}
