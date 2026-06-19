import { useEffect, useState } from 'react'
import { CartContext } from './cart-context'

const STORAGE_KEY = 'lapritel_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(product, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.slug === product.slug)
      if (existing) {
        return current.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...current, { ...product, quantity }]
    })
  }

  function removeItem(slug) {
    setItems((current) => current.filter((item) => item.slug !== slug))
  }

  function updateQuantity(slug, quantity) {
    setItems((current) =>
      current.map((item) => (item.slug === slug ? { ...item, quantity } : item))
    )
  }

  function clearCart() {
    setItems([])
  }

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
