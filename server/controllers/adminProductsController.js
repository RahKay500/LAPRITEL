import { randomUUID } from 'crypto'
import { supabase } from '../config/supabase.js'
import {
  getAllProductsForAdmin,
  createProduct,
  createVariant,
  updateVariant,
  deleteVariant,
} from '../models/products.js'

export async function listProducts(req, res) {
  const products = await getAllProductsForAdmin()
  res.json(products)
}

export async function addProduct(req, res) {
  const product = await createProduct(req.body)
  res.status(201).json(product)
}

export async function addVariant(req, res) {
  const { productId } = req.params
  const variant = await createVariant(productId, req.body)
  res.status(201).json(variant)
}

export async function editVariant(req, res) {
  const { id } = req.params
  const variant = await updateVariant(id, req.body)
  res.json(variant)
}

export async function removeVariant(req, res) {
  await deleteVariant(req.params.id)
  res.json({ message: 'Variant deleted' })
}

const IMAGE_TYPES = {
  jpg: { contentType: 'image/jpeg', matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  png: {
    contentType: 'image/png',
    matches: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  webp: {
    contentType: 'image/webp',
    matches: (b) =>
      b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP',
  },
}

function detectImageType(buffer) {
  return Object.keys(IMAGE_TYPES).find((ext) => IMAGE_TYPES[ext].matches(buffer)) || null
}

export async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' })
  }

  const extension = detectImageType(req.file.buffer)
  if (!extension) {
    return res.status(400).json({ message: 'Only JPEG, PNG or WebP images are allowed' })
  }

  const filename = `${randomUUID()}.${extension}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filename, req.file.buffer, { contentType: IMAGE_TYPES[extension].contentType })

  if (error) {
    return res.status(500).json({ message: `Upload failed: ${error.message}` })
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(filename)
  res.json({ imageUrl: data.publicUrl })
}
