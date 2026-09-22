// Sea Blue and Rainbow were originally seeded as Bag Ivy colorways, but
// they're actually their own bags: "Bag Marine" and "Bag Daisy". This creates
// them as separate products (each with a single fixed-color variant,
// reusing the photo already uploaded for the old Bag Ivy colorway) and
// deactivates the old Bag Ivy variants so they drop out of Bag Ivy's
// color picker without breaking any past order that referenced them.
//
// Usage: node scripts/addNewProducts.js
import 'dotenv/config'
import { supabase } from '../config/supabase.js'

const BUCKET = 'product-images'

const newProducts = [
  {
    name: 'Bag Marine',
    slug: 'marine',
    description:
      'Bag Marine is hand-beaded by skilled artisans in a deep sea blue, taking hours of careful work to complete.',
    variant: { colorName: 'Sea Blue', colorSlug: 'sea-blue', hex: '#2a6f97', storageFile: 'sea-blue.jpg' },
  },
  {
    name: 'Bag Daisy',
    slug: 'daisy',
    description:
      'Bag Daisy is hand-beaded by skilled artisans in a vibrant rainbow mix, taking hours of careful work to complete.',
    variant: {
      colorName: 'Rainbow',
      colorSlug: 'rainbow',
      hex: 'linear-gradient(135deg, #ff1493, #ff8c00, #ffd700, #8bc34a, #2a6f97, #7c3aed)',
      storageFile: 'rainbow.jpg',
    },
  },
]

const PRICE = 500

async function main() {
  const { data: ivyBag, error: ivyError } = await supabase
    .from('products')
    .select('id')
    .eq('slug', 'ivy-bag')
    .single()

  if (ivyError || !ivyBag) {
    console.error('Could not find "ivy-bag" product:', ivyError?.message)
    process.exit(1)
  }

  for (const item of newProducts) {
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('slug', item.slug)
      .maybeSingle()

    let productId = existingProduct?.id

    if (!productId) {
      const { data: product, error } = await supabase
        .from('products')
        .insert({ name: item.name, slug: item.slug, description: item.description })
        .select()
        .single()

      if (error) {
        console.error(`Failed to create product ${item.name}:`, error.message)
        continue
      }
      productId = product.id
      console.log(`Created product: ${item.name}`)
    } else {
      console.log(`Product "${item.name}" already exists, reusing it.`)
    }

    const { data: imageData } = supabase.storage.from(BUCKET).getPublicUrl(item.variant.storageFile)

    const { error: variantError } = await supabase.from('product_variants').upsert(
      {
        product_id: productId,
        color_name: item.variant.colorName,
        color_slug: item.variant.colorSlug,
        hex: item.variant.hex,
        price: PRICE,
        image_url: imageData.publicUrl,
        is_active: true,
        is_custom: false,
      },
      { onConflict: 'product_id,color_slug' }
    )

    if (variantError) {
      console.error(`Failed to seed variant for ${item.name}:`, variantError.message)
    } else {
      console.log(`Seeded variant for ${item.name}: ${item.variant.colorName}`)
    }
  }

  const { error: deactivateError } = await supabase
    .from('product_variants')
    .update({ is_active: false })
    .eq('product_id', ivyBag.id)
    .in('color_slug', ['sea-blue', 'rainbow'])

  if (deactivateError) {
    console.error('Failed to deactivate old Bag Ivy variants:', deactivateError.message)
  } else {
    console.log('Deactivated old Bag Ivy "sea-blue" and "rainbow" variants.')
  }

  console.log('Done.')
}

main()
