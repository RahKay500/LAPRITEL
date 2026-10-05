import { test, expect } from '@playwright/test'
import { mockApi } from './fixtures.js'

test.beforeEach(async ({ page }) => {
  await mockApi(page)
})

test('the shop lists the colours of a collection', async ({ page }) => {
  await page.goto('/shop?collection=bag-glanzy')

  await expect(page.getByRole('heading', { name: 'Bag Glanzy' })).toBeVisible()
  await expect(page.getByText('Pink', { exact: true })).toBeVisible()
  await expect(page.getByText('Emerald', { exact: true })).toBeVisible()
})

test('quick add puts a bag in the cart', async ({ page }) => {
  await page.goto('/shop?collection=bag-glanzy')
  await page.getByRole('button', { name: 'Quick Add' }).first().click()

  await expect(page.getByRole('dialog', { name: 'Shopping cart' })).toContainText('Pink')
})

test('the product page opens its details and shows other colours', async ({ page }) => {
  await page.goto('/shop/bag-glanzy?color=glanzy-pink')

  await expect(page.getByRole('heading', { name: 'More Colorways' })).toBeVisible()
  await page.getByRole('button', { name: /Size & Care/ }).click()
  await expect(page.getByText(/Approx\. 22cm wide/)).toBeVisible()
})

test('the custom colour section switches to two colours', async ({ page }) => {
  await page.goto('/shop/bag-glanzy?color=glanzy-pink')

  await page.getByRole('button', { name: /Want a different shade/ }).click()
  await page.getByRole('button', { name: 'Two Colours' }).click()

  await expect(page.getByText(/^Top colour/)).toBeVisible()
  await expect(page.getByText(/^Bottom colour/)).toBeVisible()
})
