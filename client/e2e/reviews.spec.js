import { test, expect } from '@playwright/test'
import { mockApi } from './fixtures.js'

const customer = { id: 'cust-1', email: 'ama@example.com', fullName: 'Ama Mensah', phone: '0241234567', role: 'customer' }
const deliveredOrder = {
  id: 'o1',
  reference: 'REF-DELIVERED',
  status: 'delivered',
  subtotal: 800,
  created_at: '2026-09-01T10:00:00Z',
  order_items: [
    { id: 'i1', product_name: 'Bag Glanzy', color_name: 'Pink', color_slug: 'glanzy-pink', quantity: 1, line_total: 800 },
  ],
}

test.beforeEach(async ({ page }) => {
  await mockApi(page)
  await page.route('**/api/auth/me', (route) => route.fulfill({ json: { user: customer } }))
  await page.route('**/api/orders', (route) => route.fulfill({ json: [deliveredOrder] }))
  await page.route('**/api/reviews/mine', (route) => route.fulfill({ json: [] }))
  await page.route('**/api/reviews?product=**', (route) =>
    route.fulfill({
      json: {
        average: 4.5,
        count: 2,
        reviews: [
          { id: 'r1', rating: 5, body: 'Lovely bag, arrived quickly.', author_name: 'Efua', created_at: '2026-09-10T10:00:00Z' },
          { id: 'r2', rating: 4, body: 'Beautiful beadwork, very happy.', author_name: 'Kofi', created_at: '2026-09-11T10:00:00Z' },
        ],
      },
    })
  )
})

test('a customer can review a delivered bag from My Orders', async ({ page }) => {
  let submitted = null
  await page.route('**/api/reviews', (route) => {
    if (route.request().method() === 'POST') {
      submitted = route.request().postDataJSON()
      return route.fulfill({ status: 201, json: { message: 'Thank you. Your review will appear once it has been approved.' } })
    }
    return route.fallback()
  })

  await page.goto('/orders')
  await page.getByRole('button', { name: 'Leave a review' }).click()
  await page.getByRole('radio', { name: '4 stars' }).click()
  await page.getByPlaceholder(/Tell us about the bag/).fill('Beautiful beadwork and a lovely finish.')
  await page.getByRole('button', { name: 'Submit review' }).click()

  await expect(page.getByText(/Your review will appear once it has been approved/)).toBeVisible()
  expect(submitted).toMatchObject({ orderReference: 'REF-DELIVERED', colorSlug: 'glanzy-pink', rating: 4 })
})

test('the review form refuses a missing rating and a too-short review', async ({ page }) => {
  await page.goto('/orders')
  await page.getByRole('button', { name: 'Leave a review' }).click()
  await page.getByRole('button', { name: 'Submit review' }).click()
  await expect(page.getByText('Choose a star rating.')).toBeVisible()

  await page.getByRole('radio', { name: '5 stars' }).click()
  await page.getByPlaceholder(/Tell us about the bag/).fill('Nice')
  await page.getByRole('button', { name: 'Submit review' }).click()
  await expect(page.getByText('Please write at least 10 characters.')).toBeVisible()
})

test('the product page shows the average rating and approved reviews', async ({ page }) => {
  await page.goto('/shop/bag-glanzy?color=glanzy-pink')

  await expect(page.getByRole('heading', { name: 'Reviews' })).toBeVisible()
  await expect(page.getByText(/4\.5 out of 5 · 2 reviews/)).toBeVisible()
  await expect(page.getByText('Lovely bag, arrived quickly.')).toBeVisible()
})
