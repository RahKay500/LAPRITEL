import { getActiveProducts } from '../models/products.js'

export async function listActiveProducts(req, res) {
  const products = await getActiveProducts()
  res.json(products)
}
