import { useEffect, useState } from 'react'
import { CartContext } from './cart-context'
import { fetchProducts } from '../services/products'

const STORAGE_KEY = 'lapritel_cart'

// Cart entries only remember {slug, quantity} — product details (name, image,
// price, hex) are always resolved fresh from the live variant list below, so
// a price/image change, a color renamed in the admin dashboard, or a custom
// color added after the fact can never leave a stale cart item pointing at
// data that no longer exists.
function toVariant(variant, productName) {
  return {
    name: variant.color_name,
    slug: variant.color_slug,
    hex: variant.hex,
    price: Number(variant.price),
    image: variant.image_url || undefined,
    isCustom: Boolean(variant.is_custom),
    productName,
  }
}

// color_slug is only unique per product, not globally, so if two active
// products ever reuse the same color_slug this resolves to whichever one
// appears first -- fine today since active slugs don't collide across
// products, but worth knowing if that ever changes.
//
// entry.key identifies a cart line and defaults to entry.slug. A two-tone
// custom order carries a real variant slug (for price/checkout validation)
// but a distinct key of `${slug}::${customName}`, so it never merges with a
// plain single-color line for the same base slug. entry.customName/
// customTopHex/customBottomHex, when present, override the resolved
// variant's display name and swatch colors without touching its slug or
// price.
function resolveItems(entries, variants) {
  return entries
    .map((entry) => {
      const variant = variants.find((item) => item.slug === entry.slug)
      if (!variant) return null
      const isTwoTone = Boolean(entry.customTopHex && entry.customBottomHex)
      return {
        ...variant,
        quantity: entry.quantity,
        key: entry.key || entry.slug,
        name: entry.customName || variant.name,
        isTwoTone,
        topHex: isTwoTone ? entry.customTopHex : undefined,
        bottomHex: isTwoTone ? entry.customBottomHex : undefined,
      }
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
  // Tracks which lines are excluded from checkout, not which are included --
  // that way a line is selected by default the moment it's added, with
  // nothing to keep in sync. Not persisted: every reload starts with
  // everything selected, which is safer than silently excluding an item a
  // customer forgot they'd unchecked in a previous session.
  const [deselectedKeys, setDeselectedKeys] = useState(() => new Set())

  useEffect(() => {
    let isMounted = true
    fetchProducts()
      .then((products) => {
        if (!isMounted) return
        setVariants(
          products.flatMap((item) =>
            item.product_variants.map((variant) => toVariant(variant, item.name))
          )
        )
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

  function addItem(product, quantity = 1, customColor = null) {
    const key = customColor ? `${product.slug}::${customColor.name}` : product.slug
    setEntries((current) => {
      const existing = current.find((entry) => (entry.key || entry.slug) === key)
      if (existing) {
        return current.map((entry) =>
          (entry.key || entry.slug) === key
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        )
      }
      const entry = { key, slug: product.slug, quantity }
      if (customColor) {
        entry.customName = customColor.name
        entry.customTopHex = customColor.topHex
        entry.customBottomHex = customColor.bottomHex
      }
      return [...current, entry]
    })
  }

  function removeItem(key) {
    setEntries((current) => current.filter((entry) => (entry.key || entry.slug) !== key))
    setDeselectedKeys((current) => {
      if (!current.has(key)) return current
      const next = new Set(current)
      next.delete(key)
      return next
    })
  }

  function toggleItemSelected(key) {
    setDeselectedKeys((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function updateQuantity(key, quantity) {
    setEntries((current) =>
      current.map((entry) => ((entry.key || entry.slug) === key ? { ...entry, quantity } : entry))
    )
  }

  function clearCart() {
    setEntries([])
  }

  const items = resolveItems(entries, variants).map((item) => ({
    ...item,
    isSelected: !deselectedKeys.has(item.key),
  }))
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const selectedItems = items.filter((item) => item.isSelected)
  const selectedSubtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

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
        toggleItemSelected,
        selectedItems,
        selectedSubtotal,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
