// Seeds the Ivy Bag product + all 10 current colorways into a fresh
// Supabase project, uploading each variant's photo from the client's own
// asset folder so image_url always points at files that actually exist in
// *this* project's storage bucket (the previous version hardcoded a URL to
// the old, now-deleted project's bucket).
//
// Usage: node scripts/seedProducts.js
import 'dotenv/config'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'
import { supabase } from '../config/supabase.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = path.resolve(__dirname, '../../client/src/assets/images')
const BUCKET = 'product-images'

const variants = [
  { colorName: 'Red', colorSlug: 'red', hex: '#c41e3a', price: 500, file: 'ivy_bag_red.jpg' },
  {
    colorName: 'Hot Pink',
    colorSlug: 'hot-pink',
    hex: '#ff1493',
    price: 500,
    file: 'ivy_bag_hotpink.jpg',
  },
  {
    colorName: 'Light Pink',
    colorSlug: 'light-pink',
    hex: '#f7cad0',
    price: 500,
    file: 'ivy_bag_lightpink.jpg',
  },
  {
    colorName: 'Green',
    colorSlug: 'green',
    hex: '#8bc34a',
    price: 500,
    file: 'ivy_bag_green.jpeg',
  },
  {
    colorName: 'White',
    colorSlug: 'white',
    hex: '#f5f5f0',
    price: 500,
    file: 'ivy_bag_white.jpeg',
  },
  {
    colorName: 'Black',
    colorSlug: 'black',
    hex: '#1a1a1a',
    price: 500,
    file: 'ivy_bag_black.jpg',
  },
  {
    colorName: 'Sea Blue',
    colorSlug: 'sea-blue',
    hex: '#2a6f97',
    price: 500,
    file: 'ivy_bag_seablue.jpg',
  },
  {
    colorName: 'Purple',
    colorSlug: 'purple',
    hex: '#7c3aed',
    price: 500,
    file: 'ivy_bag_purple.jpg',
  },
  {
    colorName: 'Orange',
    colorSlug: 'orange',
    hex: '#ff8c00',
    price: 500,
    file: 'ivy_bag_orange.jpg',
  },
  {
    colorName: 'Rainbow',
    colorSlug: 'rainbow',
    hex: 'linear-gradient(135deg, #ff1493, #ff8c00, #ffd700, #8bc34a, #2a6f97, #7c3aed)',
    price: 500,
    file: 'ivy_bag_rainbow.jpg',
  },
]

async function ensureBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets()
  if (error) {
    console.error('Failed to list storage buckets:', error.message)
    process.exit(1)
  }

  if (buckets.some((bucket) => bucket.name === BUCKET)) return

  const { error: createError } = await supabase.storage.createBucket(BUCKET, { public: true })
  if (createError) {
    console.error(`Failed to create "${BUCKET}" bucket:`, createError.message)
    process.exit(1)
  }
  console.log(`Created public storage bucket "${BUCKET}".`)
}

async function uploadVariantImage(variant) {
  const filePath = path.join(IMAGES_DIR, variant.file)
  const fileBuffer = await readFile(filePath)
  const extension = path.extname(variant.file).slice(1)
  const storagePath = `${variant.colorSlug}.${extension}`
  const contentType = extension === 'jpeg' || extension === 'jpg' ? 'image/jpeg' : `image/${extension}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, { contentType, upsert: true })

  if (error) {
    throw new Error(`Failed to upload ${variant.file}: ${error.message}`)
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

async function main() {
  await ensureBucket()

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
    let imageUrl = null
    try {
      imageUrl = await uploadVariantImage(variant)
    } catch (uploadError) {
      console.error(uploadError.message)
    }

    const { error } = await supabase.from('product_variants').upsert(
      {
        product_id: productId,
        color_name: variant.colorName,
        color_slug: variant.colorSlug,
        hex: variant.hex,
        price: variant.price,
        image_url: imageUrl,
      },
      { onConflict: 'product_id,color_slug' }
    )

    if (error) {
      console.error(`Failed to seed variant ${variant.colorName}:`, error.message)
    } else {
      console.log(`Seeded variant: ${variant.colorName}${imageUrl ? '' : ' (no image)'}`)
    }
  }

  console.log('Done.')
}

main()
