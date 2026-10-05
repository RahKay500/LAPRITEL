import { supabase } from '../config/supabase.js'

// The active catalog barely changes (only admin edits touch it) but is the
// highest-traffic read in the app -- every Shop/Product/Cart/Wishlist page
// load fetches it. A short in-memory cache collapses a burst of concurrent
// requests (e.g. a promo driving many shoppers in at once) into a single
// Supabase query per cache window per warm serverless instance, instead of
// one query per request. Cleared immediately on any admin write below so
// catalog edits still show up right away rather than waiting out the TTL.
const CACHE_TTL_MS = 30_000
let cache = { data: null, expiresAt: 0 }

function invalidateProductsCache() {
  cache = { data: null, expiresAt: 0 }
}

export async function getActiveProducts() {
  if (cache.data && Date.now() < cache.expiresAt) {
    return cache.data
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('is_active', true)
    .eq('product_variants.is_active', true)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  cache = { data, expiresAt: Date.now() + CACHE_TTL_MS }
  return data
}

export async function getActiveVariantPriceMap() {
  const { data, error } = await supabase
    .from('product_variants')
    .select('color_slug, price')
    .eq('is_active', true)

  if (error) {
    throw new Error(`Failed to fetch variant prices: ${error.message}`)
  }

  return new Map(data.map((variant) => [variant.color_slug, Number(variant.price)]))
}

export async function getActiveVariantMetaMap() {
  const { data, error } = await supabase
    .from('product_variants')
    .select('color_slug, color_name, image_url, is_custom, products(name)')
    .eq('is_active', true)

  if (error) {
    throw new Error(`Failed to fetch variant details: ${error.message}`)
  }

  return new Map(
    data.map((variant) => [
      variant.color_slug,
      {
        imageUrl: variant.image_url,
        colorName: variant.color_name,
        isCustom: variant.is_custom,
        productName: variant.products?.name,
      },
    ])
  )
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

export async function createProduct({ name, slug, description }) {
  const { data, error } = await supabase
    .from('products')
    .insert({ name, slug, description: description || null })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw Object.assign(new Error('A collection with this URL slug already exists'), { status: 409 })
    }
    throw new Error(`Failed to create collection: ${error.message}`)
  }

  invalidateProductsCache()
  return data
}

export async function createVariant(productId, variant) {
  const { data: existing, error: lookupError } = await supabase
    .from('product_variants')
    .select('id')
    .eq('color_slug', variant.colorSlug)

  if (lookupError) {
    throw new Error(`Failed to check colour slug: ${lookupError.message}`)
  }
  if (existing.length > 0) {
    throw Object.assign(
      new Error(`The colour slug "${variant.colorSlug}" is already used. Pick a unique one, e.g. include the collection name.`),
      { status: 409 }
    )
  }

  const { data, error } = await supabase
    .from('product_variants')
    .insert({
      product_id: productId,
      color_name: variant.colorName,
      color_slug: variant.colorSlug,
      hex: variant.hex,
      price: variant.price,
      image_url: variant.imageUrl || null,
      is_custom: variant.isCustom || false,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create variant: ${error.message}`)
  }

  invalidateProductsCache()
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
  if (variant.isCustom !== undefined) updates.is_custom = variant.isCustom
  if (variant.readyToShip !== undefined) updates.ready_to_ship = variant.readyToShip

  const { data, error } = await supabase
    .from('product_variants')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update variant: ${error.message}`)
  }

  invalidateProductsCache()
  return data
}

export async function deleteVariant(id) {
  const { data: variant, error: fetchError } = await supabase
    .from('product_variants')
    .select('image_url')
    .eq('id', id)
    .single()

  if (fetchError) {
    throw new Error(`Failed to fetch variant: ${fetchError.message}`)
  }

  const { error } = await supabase.from('product_variants').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete variant: ${error.message}`)
  }

  invalidateProductsCache()

  const filename = variant.image_url?.split('/product-images/')[1]
  if (filename) {
    const { error: storageError } = await supabase.storage.from('product-images').remove([filename])
    if (storageError) {
      console.error(`Failed to delete variant image ${filename}:`, storageError.message)
    }
  }
}

export async function getVariantProductSlug(colorSlug) {
  const { data, error } = await supabase
    .from('product_variants')
    .select('products(slug)')
    .eq('color_slug', colorSlug)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to look up colour: ${error.message}`)
  }
  return data?.products?.slug ?? null
}
