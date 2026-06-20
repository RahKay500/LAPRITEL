import 'dotenv/config'
import { supabase } from '../config/supabase.js'

const STORAGE_BASE =
  'https://osihwkzmtohecfkidjgn.supabase.co/storage/v1/object/public/product-images'

const variants = [
  { colorName: 'Red', colorSlug: 'red', hex: '#c41e3a', price: 500 },
  {
    colorName: 'Hot Pink',
    colorSlug: 'hot-pink',
    hex: '#ff1493',
    price: 500,
    imageUrl: `${STORAGE_BASE}/ivy-bag-hot-pink.jpeg`,
  },
  { colorName: 'Light Pink', colorSlug: 'light-pink', hex: '#f7cad0', price: 500 },
  {
    colorName: 'Green',
    colorSlug: 'green',
    hex: '#8bc34a',
    price: 500,
    imageUrl: `${STORAGE_BASE}/ivy-bag-green.jpeg`,
  },
  {
    colorName: 'White',
    colorSlug: 'white',
    hex: '#f5f5f0',
    price: 500,
    imageUrl: `${STORAGE_BASE}/ivy-bag-white.jpeg`,
  },
  { colorName: 'Black', colorSlug: 'black', hex: '#1a1a1a', price: 500 },
  { colorName: 'Sea Blue', colorSlug: 'sea-blue', hex: '#2a6f97', price: 500 },
  { colorName: 'Purple', colorSlug: 'purple', hex: '#7c3aed', price: 500 },
]

const { data: existingProduct } = await supabase
  .from('products')
  .select('id')
  .eq('slug', 'ivy-bag')
  .maybeSingle()

let productId = existingProduct?.id

if (!productId) {
  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name: 'The Ivy Bag',
      slug: 'ivy-bag',
      description:
        'Each Ivy Bag is hand-beaded by skilled artisans, taking hours of careful work to complete. A statement piece designed to be worn for years to come.',
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create product:', error.message)
    process.exit(1)
  }

  productId = product.id
  console.log('Created product: The Ivy Bag')
} else {
  console.log('Product "The Ivy Bag" already exists, reusing it.')
}

for (const variant of variants) {
  const { error } = await supabase.from('product_variants').upsert(
    {
      product_id: productId,
      color_name: variant.colorName,
      color_slug: variant.colorSlug,
      hex: variant.hex,
      price: variant.price,
      image_url: variant.imageUrl || null,
    },
    { onConflict: 'product_id,color_slug' }
  )

  if (error) {
    console.error(`Failed to seed variant ${variant.colorName}:`, error.message)
  } else {
    console.log(`Seeded variant: ${variant.colorName}`)
  }
}

console.log('Done.')
