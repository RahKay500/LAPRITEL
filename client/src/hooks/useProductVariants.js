import { useEffect, useState } from 'react'
import { fetchProducts } from '../services/products'

function toVariant(variant) {
  return {
    name: variant.color_name,
    slug: variant.color_slug,
    hex: variant.hex,
    price: Number(variant.price),
    image: variant.image_url || undefined,
    isCustom: Boolean(variant.is_custom),
  }
}

export function useProductVariants(slug) {
  const [product, setProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    fetchProducts()
      .then((products) => {
        if (!isMounted) return
        const match = products.find((item) => item.slug === slug)
        setProduct(match ? { name: match.name, slug: match.slug, description: match.description } : null)
        setVariants(match ? match.product_variants.map(toVariant) : [])
      })
      .catch((err) => {
        if (isMounted) setError(err.message)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  return { product, variants, isLoading, error }
}
