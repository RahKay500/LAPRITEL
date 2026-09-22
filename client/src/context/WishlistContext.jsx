import { useEffect, useState } from 'react'
import { WishlistContext } from './wishlist-context'
import { fetchProducts } from '../services/products'

const STORAGE_KEY = 'lapritel_wishlist'

// Wishlist entries only remember {productSlug, slug} — everything else
// (name, image, price, hex) is resolved fresh from the live catalog below,
// same pattern as CartContext, so a renamed color or price change never
// leaves a stale wishlist entry pointing at data that no longer exists.
function toEntry(variant, product) {
  return {
    productSlug: product.slug,
    productName: product.name,
    slug: variant.color_slug,
    name: variant.color_name,
    hex: variant.hex,
    price: Number(variant.price),
    image: variant.image_url || undefined,
    isCustom: Boolean(variant.is_custom),
  }
}

function resolveItems(keys, catalog) {
  return keys
    .map((key) =>
      catalog.find((entry) => entry.productSlug === key.productSlug && entry.slug === key.slug)
    )
    .filter(Boolean)
}

export function WishlistProvider({ children }) {
  const [keys, setKeys] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [catalog, setCatalog] = useState([])

  useEffect(() => {
    let isMounted = true
    fetchProducts()
      .then((products) => {
        if (!isMounted) return
        setCatalog(
          products.flatMap((product) =>
            product.product_variants.map((variant) => toEntry(variant, product))
          )
        )
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
  }, [keys])

  function isWishlisted(productSlug, slug) {
    return keys.some((key) => key.productSlug === productSlug && key.slug === slug)
  }

  function toggleWishlist(productSlug, slug) {
    setKeys((current) => {
      const exists = current.some((key) => key.productSlug === productSlug && key.slug === slug)
      if (exists) {
        return current.filter((key) => !(key.productSlug === productSlug && key.slug === slug))
      }
      return [...current, { productSlug, slug }]
    })
  }

  function removeWishlist(productSlug, slug) {
    setKeys((current) =>
      current.filter((key) => !(key.productSlug === productSlug && key.slug === slug))
    )
  }

  const items = resolveItems(keys, catalog)

  return (
    <WishlistContext.Provider
      value={{
        items,
        count: items.length,
        isWishlisted,
        toggleWishlist,
        removeWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
