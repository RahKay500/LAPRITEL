// Re-uploads the now-optimized local product photos to Supabase Storage
// under their existing filenames (upsert), so image_url values already
// stored in product_variants keep working unchanged -- this just replaces
// the bytes behind them with the resized/recompressed versions.
//
// Usage: node scripts/reuploadOptimizedImages.js
import 'dotenv/config'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'
import { supabase } from '../config/supabase.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = path.resolve(__dirname, '../../client/src/assets/images')
const BUCKET = 'product-images'

const files = [
  { local: 'ivy_bag_black.jpg', storage: 'black.jpg' },
  { local: 'ivy_bag_green.jpeg', storage: 'green.jpeg' },
  { local: 'ivy_bag_hotpink.jpg', storage: 'hot-pink.jpg' },
  { local: 'ivy_bag_lightpink.jpg', storage: 'light-pink.jpg' },
  { local: 'ivy_bag_orange.jpg', storage: 'orange.jpg' },
  { local: 'ivy_bag_purple.jpg', storage: 'purple.jpg' },
  { local: 'ivy_bag_rainbow.jpg', storage: 'rainbow.jpg' },
  { local: 'ivy_bag_red.jpg', storage: 'red.jpg' },
  { local: 'ivy_bag_seablue.jpg', storage: 'sea-blue.jpg' },
  { local: 'ivy_bag_white.jpeg', storage: 'white.jpeg' },
]

async function main() {
  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file.local)
    const fileBuffer = await readFile(filePath)
    const extension = path.extname(file.local).slice(1)
    const contentType = extension === 'jpeg' || extension === 'jpg' ? 'image/jpeg' : `image/${extension}`

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(file.storage, fileBuffer, { contentType, upsert: true })

    if (error) {
      console.error(`Failed to re-upload ${file.storage}:`, error.message)
    } else {
      console.log(`Re-uploaded: ${file.storage} (${Math.round(fileBuffer.length / 1024)}KB)`)
    }
  }

  console.log('Done.')
}

main()
