export const products = [
  {
    name: 'Bag Glanzy',
    slug: 'bag-glanzy',
    description: 'Test description',
    product_variants: [
      { color_name: 'Pink', color_slug: 'glanzy-pink', hex: '#F472B6', price: 800, image_url: 'https://example.com/pink.jpg', is_active: true, is_custom: false, created_at: '2000-01-01T00:00:01Z' },
      { color_name: 'Emerald', color_slug: 'glanzy-emerald', hex: '#0F7A3E', price: 800, image_url: 'https://example.com/emerald.jpg', is_active: true, is_custom: false, created_at: '2000-01-01T00:00:04Z' },
    ],
  },
]

export const buyToken = 'test-token-0123456789'

export const buyRequest = {
  requesterName: 'Ama',
  items: [{ name: 'Pink', productName: 'Bag Glanzy', price: 800, quantity: 1 }],
  total: 800,
  expiresAt: '2099-01-01T00:00:00Z',
}

export async function mockApi(page) {
  await page.route('**/api/products', (route) => route.fulfill({ json: products }))
  await page.route('**/api/featured-customers**', (route) => route.fulfill({ json: [] }))
  await page.route('**/api/auth/me', (route) => route.fulfill({ status: 401, json: { user: null } }))
  await page.route('**/api/buy-requests', (route) => {
    if (route.request().method() === 'POST') {
      return route.fulfill({ status: 201, json: { token: buyToken, expiresAt: buyRequest.expiresAt } })
    }
    return route.fallback()
  })
  await page.route(`**/api/buy-requests/${buyToken}`, (route) => route.fulfill({ json: buyRequest }))
  await page.route('**/api/buy-requests/unknown-token', (route) =>
    route.fulfill({ status: 404, json: { message: 'This link is no longer available.' } })
  )
}
