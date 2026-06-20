import { supabase } from '../config/supabase.js'

export async function getActiveProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('is_active', true)
    .eq('product_variants.is_active', true)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  return data
}

export async function getAllProductsForAdmin() {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  return data
}

export async function createVariant(productId, variant) {
  const { data, error } = await supabase
    .from('product_variants')
    .insert({
      product_id: productId,
      color_name: variant.colorName,
      color_slug: variant.colorSlug,
      hex: variant.hex,
      price: variant.price,
      image_url: variant.imageUrl || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create variant: ${error.message}`)
  }

  return data
}

export async function updateVariant(id, variant) {
  const updates = {}
  if (variant.colorName !== undefined) updates.color_name = variant.colorName
  if (variant.colorSlug !== undefined) updates.color_slug = variant.colorSlug
  if (variant.hex !== undefined) updates.hex = variant.hex
  if (variant.price !== undefined) updates.price = variant.price
  if (variant.imageUrl !== undefined) updates.image_url = variant.imageUrl
  if (variant.isActive !== undefined) updates.is_active = variant.isActive

  const { data, error } = await supabase
    .from('product_variants')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update variant: ${error.message}`)
  }

  return data
}

export async function deleteVariant(id) {
  const { error } = await supabase.from('product_variants').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete variant: ${error.message}`)
  }
}
