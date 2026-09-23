import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CartProvider } from './CartContext'
import { useCart } from './useCart'

vi.mock('../services/products', () => ({
  fetchProducts: vi.fn(async () => [
    {
      name: 'Bag Ivy',
      slug: 'ivy-bag',
      product_variants: [
        {
          color_slug: 'red',
          color_name: 'Red',
          hex: '#c41e3a',
          price: '500',
          image_url: 'https://example.com/red.jpg',
          is_custom: false,
        },
        {
          color_slug: 'custom-purple',
          color_name: 'Purple',
          hex: '#7c3aed',
          price: '500',
          image_url: null,
          is_custom: true,
        },
      ],
    },
  ]),
}))

function wrapper({ children }) {
  return <CartProvider>{children}</CartProvider>
}

async function renderCart() {
  const view = renderHook(() => useCart(), { wrapper })
  // Cart entries only resolve to real items once the mocked catalog fetch
  // finishes, same as in production.
  await waitFor(() => expect(view.result.current.items).toBeDefined())
  return view
}

beforeEach(() => {
  localStorage.clear()
})

describe('CartContext', () => {
  it('adds a standard item and resolves its catalog details', async () => {
    const { result } = await renderCart()

    act(() => {
      result.current.addItem({ slug: 'red' }, 1)
    })

    await waitFor(() => expect(result.current.items).toHaveLength(1))
    const [item] = result.current.items
    expect(item.name).toBe('Red')
    expect(item.price).toBe(500)
    expect(item.key).toBe('red')
    expect(result.current.count).toBe(1)
    expect(result.current.subtotal).toBe(500)
  })

  it('merges quantity when the same plain slug is added twice', async () => {
    const { result } = await renderCart()

    act(() => {
      result.current.addItem({ slug: 'red' }, 1)
    })
    act(() => {
      result.current.addItem({ slug: 'red' }, 2)
    })

    await waitFor(() => expect(result.current.items).toHaveLength(1))
    expect(result.current.items[0].quantity).toBe(3)
  })

  it('keeps two different two-tone combos on the same base slug as separate lines', async () => {
    const { result } = await renderCart()

    act(() => {
      result.current.addItem(
        { slug: 'custom-purple' },
        1,
        { name: 'Purple (Top) & Yellow (Bottom)', topHex: '#7c3aed', bottomHex: '#ffd400' }
      )
    })
    act(() => {
      result.current.addItem(
        { slug: 'custom-purple' },
        1,
        { name: 'Purple (Top) & Green (Bottom)', topHex: '#7c3aed', bottomHex: '#22c55e' }
      )
    })

    await waitFor(() => expect(result.current.items).toHaveLength(2))
    const names = result.current.items.map((item) => item.name).sort()
    expect(names).toEqual(['Purple (Top) & Green (Bottom)', 'Purple (Top) & Yellow (Bottom)'])
    // Regression check for the bug caught earlier this session: a two-tone
    // line must carry its own topHex/bottomHex, not the plain catalog hex.
    result.current.items.forEach((item) => {
      expect(item.isTwoTone).toBe(true)
      expect(item.topHex).toBe('#7c3aed')
      expect(item.bottomHex).toBeTruthy()
    })
  })

  it('merges quantity when the exact same two-tone combo is added twice', async () => {
    const { result } = await renderCart()
    const customColor = { name: 'Purple (Top) & Yellow (Bottom)', topHex: '#7c3aed', bottomHex: '#ffd400' }

    act(() => {
      result.current.addItem({ slug: 'custom-purple' }, 1, customColor)
    })
    act(() => {
      result.current.addItem({ slug: 'custom-purple' }, 1, customColor)
    })

    await waitFor(() => expect(result.current.items).toHaveLength(1))
    expect(result.current.items[0].quantity).toBe(2)
  })

  it('removes and updates quantity by key, not by slug, so it targets the right line', async () => {
    const { result } = await renderCart()

    act(() => {
      result.current.addItem({ slug: 'red' }, 1)
    })
    act(() => {
      result.current.addItem(
        { slug: 'custom-purple' },
        1,
        { name: 'Purple (Top) & Yellow (Bottom)', topHex: '#7c3aed', bottomHex: '#ffd400' }
      )
    })

    await waitFor(() => expect(result.current.items).toHaveLength(2))
    const twoToneKey = result.current.items.find((item) => item.isTwoTone).key

    act(() => {
      result.current.updateQuantity(twoToneKey, 5)
    })
    await waitFor(() =>
      expect(result.current.items.find((item) => item.key === twoToneKey).quantity).toBe(5)
    )

    act(() => {
      result.current.removeItem(twoToneKey)
    })
    await waitFor(() => expect(result.current.items).toHaveLength(1))
    expect(result.current.items[0].key).toBe('red')
  })
})
