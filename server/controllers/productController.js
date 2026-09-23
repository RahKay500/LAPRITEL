import { getActiveProducts } from '../models/products.js'

export async function listActiveProducts(req, res) {
  const products = await getActiveProducts()
  // Public, non-user-specific catalog data -- lets Vercel's edge and
  // browsers serve repeat requests without hitting this function at all,
  // which matters most during a traffic spike (e.g. a promo).
  res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=300')
  res.json(products)
}
