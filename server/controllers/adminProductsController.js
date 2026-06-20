import { randomUUID } from 'crypto'
import { supabase } from '../config/supabase.js'
import {
  getAllProductsForAdmin,
  createVariant,
  updateVariant,
  deleteVariant,
} from '../models/products.js'

export async function listProducts(req, res) {
  const products = await getAllProductsForAdmin()
  res.json(products)
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

export async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' })
  }

  const extension = req.file.originalname.split('.').pop()
  const filename = `${randomUUID()}.${extension}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filename, req.file.buffer, { contentType: req.file.mimetype })

  if (error) {
    return res.status(500).json({ message: `Upload failed: ${error.message}` })
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(filename)
  res.json({ imageUrl: data.publicUrl })
}
