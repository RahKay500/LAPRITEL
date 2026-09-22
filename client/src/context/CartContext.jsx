import { useEffect, useState } from 'react'
import { CartContext } from './cart-context'
import { fetchProducts } from '../services/products'

const STORAGE_KEY = 'lapritel_cart'

// Cart entries only remember {slug, quantity} — product details (name, image,
// price, hex) are always resolved fresh from the live variant list below, so
// a price/image change, a color renamed in the admin dashboard, or a custom
// color added after the fact can never leave a stale cart item pointing at
// data that no longer exists.
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

function resolveItems(entries, variants) {
  return entries
    .map((entry) => {
      const variant = variants.find((item) => item.slug === entry.slug)
      return variant ? { ...variant, quantity: entry.quantity } : null
    })
    .filter(Boolean)
}

export function CartProvider({ children }) {
  const [entries, setEntries] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [variants, setVariants] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    let isMounted = true
    fetchProducts()
      .then((products) => {
        if (!isMounted) return
        const ivyBag = products.find((item) => item.slug === 'ivy-bag')
        setVariants(ivyBag ? ivyBag.product_variants.map(toVariant) : [])
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  function openDrawer() {
    setIsDrawerOpen(true)
  }

  function closeDrawer() {
    setIsDrawerOpen(false)
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  function addItem(product, quantity = 1) {
    setEntries((current) => {
      const existing = current.find((entry) => entry.slug === product.slug)
      if (existing) {
        return current.map((entry) =>
          entry.slug === product.slug
            ? { slug: entry.slug, quantity: entry.quantity + quantity }
            : entry
        )
      }
      return [...current, { slug: product.slug, quantity }]
    })
  }

  function removeItem(slug) {
    setEntries((current) => current.filter((entry) => entry.slug !== slug))
  }

  function updateQuantity(slug, quantity) {
    setEntries((current) =>
      current.map((entry) => (entry.slug === slug ? { slug: entry.slug, quantity } : entry))
    )
  }

  function clearCart() {
    setEntries([])
  }

  const items = resolveItems(entries, variants)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        count,
        subtotal,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
