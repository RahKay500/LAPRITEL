import { beforeEach, describe, expect, it, vi } from 'vitest'

// A minimal chainable mock of the supabase-js query builder: every chain
// method returns the same builder object, and the builder is itself
// thenable so `await supabase.from(...).select(...).eq(...).order(...)`
// (or any other chain shape used in products.js) resolves to whatever
// `currentResult` is set to at await-time.
let currentResult = { data: null, error: null }
const fromCalls = []

function makeBuilder() {
  const builder = {}
  ;['from', 'select', 'eq', 'order', 'insert', 'update', 'delete', 'single'].forEach((method) => {
    builder[method] = vi.fn((...args) => {
      if (method === 'from') fromCalls.push(args[0])
      return builder
    })
  })
  builder.then = (resolve) => resolve(currentResult)
  builder.storage = { from: () => ({ remove: vi.fn(async () => ({ error: null })) }) }
  return builder
}

const mockSupabase = makeBuilder()

vi.mock('../config/supabase.js', () => ({ supabase: mockSupabase }))

beforeEach(async () => {
  fromCalls.length = 0
  currentResult = { data: [{ id: 'p1', name: 'Bag Ivy' }], error: null }
  // Fresh module instance per test so the in-memory cache doesn't leak
  // between tests -- it's module-scoped state, same as it is in production.
  vi.resetModules()
})

describe('getActiveProducts caching', () => {
  it('serves a second call within the cache window from cache, without querying again', async () => {
    const { getActiveProducts } = await import('./products.js')

    const first = await getActiveProducts()
    const second = await getActiveProducts()

    expect(first).toEqual(second)
    expect(fromCalls.filter((table) => table === 'products')).toHaveLength(1)
  })

  it('refetches after an admin write invalidates the cache', async () => {
    const { getActiveProducts, createVariant } = await import('./products.js')

    await getActiveProducts()
    expect(fromCalls.filter((table) => table === 'products')).toHaveLength(1)

    currentResult = { data: { id: 'v1' }, error: null }
    await createVariant('p1', { colorName: 'Blue', colorSlug: 'blue', hex: '#0000ff', price: 500 })

    currentResult = { data: [{ id: 'p1', name: 'Bag Ivy (updated)' }], error: null }
    const afterInvalidate = await getActiveProducts()

    expect(fromCalls.filter((table) => table === 'products')).toHaveLength(2)
    expect(afterInvalidate).toEqual([{ id: 'p1', name: 'Bag Ivy (updated)' }])
  })

  it('refetches once the cache TTL has elapsed', async () => {
    vi.useFakeTimers()
    try {
      const { getActiveProducts } = await import('./products.js')

      await getActiveProducts()
      expect(fromCalls.filter((table) => table === 'products')).toHaveLength(1)

      vi.advanceTimersByTime(31_000) // TTL is 30s

      await getActiveProducts()
      expect(fromCalls.filter((table) => table === 'products')).toHaveLength(2)
    } finally {
      vi.useRealTimers()
    }
  })

  it('throws a descriptive error when the query fails, and does not cache the failure', async () => {
    const { getActiveProducts } = await import('./products.js')

    currentResult = { data: null, error: { message: 'connection refused' } }
    await expect(getActiveProducts()).rejects.toThrow(/connection refused/)

    currentResult = { data: [{ id: 'p1', name: 'Bag Ivy' }], error: null }
    await expect(getActiveProducts()).resolves.toEqual([{ id: 'p1', name: 'Bag Ivy' }])
  })
})
