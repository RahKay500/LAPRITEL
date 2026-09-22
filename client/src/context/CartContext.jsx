import { useEffect, useState } from 'react'
import { CartContext } from './cart-context'
import { ivyBagVariants } from '../data/ivyBagVariants'

const STORAGE_KEY = 'lapritel_cart'

// Cart entries only remember {slug, quantity} — product details (name, image,
// price, hex) are always resolved fresh from ivyBagVariants below, so a
// price/image change or asset rename can never leave a stale cart item
// pointing at data that no longer exists.
function resolveItems(entries) {
  return entries
    .map((entry) => {
      const variant = ivyBagVariants.find((item) => item.slug === entry.slug)
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

  const items = resolveItems(entries)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}
