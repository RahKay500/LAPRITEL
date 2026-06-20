import { useEffect, useState } from 'react'
import { fetchProducts } from '../services/products'

function toVariant(variant) {
  return {
    name: variant.color_name,
    slug: variant.color_slug,
    hex: variant.hex,
    price: Number(variant.price),
    image: variant.image_url || undefined,
  }
}

export function useIvyBagVariants() {
  const [product, setProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    fetchProducts()
      .then((products) => {
        if (!isMounted) return
        const ivyBag = products.find((item) => item.slug === 'ivy-bag')
        setProduct(ivyBag ? { name: ivyBag.name, description: ivyBag.description } : null)
        setVariants(ivyBag ? ivyBag.product_variants.map(toVariant) : [])
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
  }, [])

  return { product, variants, isLoading, error }
}
