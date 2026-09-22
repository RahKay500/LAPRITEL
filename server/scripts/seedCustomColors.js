// Seeds the "custom color" variants the artisan can bead on request but
// doesn't keep photographed/in-stock. These are marked is_custom: true so
// they're excluded from the Shop grid and the "More Colorways" list, and
// only ever surface in the Product Page's "Custom Colors" picker.
//
// Requires the `is_custom` column to already exist on product_variants
// (run the ALTER TABLE statement from schema.sql first if it doesn't).
//
// Usage: node scripts/seedCustomColors.js
import 'dotenv/config'
import { supabase } from '../config/supabase.js'

const customVariants = [
  { colorName: 'Red', colorSlug: 'custom-red', hex: '#c41e3a' },
  { colorName: 'Orange', colorSlug: 'custom-orange', hex: '#ff8c00' },
  { colorName: 'Sea Blue', colorSlug: 'custom-sea-blue', hex: '#2a6f97' },
  { colorName: 'Hot Pink', colorSlug: 'custom-hot-pink', hex: '#ff1493' },
  { colorName: 'Light Pink', colorSlug: 'custom-light-pink', hex: '#f7cad0' },
  { colorName: 'Purple', colorSlug: 'custom-purple', hex: '#7c3aed' },
  { colorName: 'Neon Green', colorSlug: 'custom-neon-green', hex: '#39ff14' },
  { colorName: 'Light Green', colorSlug: 'custom-light-green', hex: '#90ee90' },
  { colorName: 'Black', colorSlug: 'custom-black', hex: '#1a1a1a' },
  { colorName: 'White', colorSlug: 'custom-white', hex: '#f5f5f0' },
  { colorName: 'Champagne Gold', colorSlug: 'custom-champagne-gold', hex: '#c9a66b' },
  { colorName: 'Yellow', colorSlug: 'custom-yellow', hex: '#ffd400' },
]

const PRICE = 500

async function main() {
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id')
    .eq('slug', 'ivy-bag')
    .single()

  if (productError || !product) {
    console.error('Could not find "ivy-bag" product:', productError?.message)
    process.exit(1)
  }

  for (const variant of customVariants) {
    const { error } = await supabase.from('product_variants').upsert(
      {
        product_id: product.id,
        color_name: variant.colorName,
        color_slug: variant.colorSlug,
        hex: variant.hex,
        price: PRICE,
        image_url: null,
        is_custom: true,
      },
      { onConflict: 'product_id,color_slug' }
    )

    if (error) {
      console.error(`Failed to seed custom variant ${variant.colorName}:`, error.message)
    } else {
      console.log(`Seeded custom variant: ${variant.colorName}`)
    }
  }

  console.log('Done.')
}

main()
