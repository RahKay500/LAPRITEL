import { test, expect } from '@playwright/test'
import { mockApi, buyToken } from './fixtures.js'

const cartWithPinkBag = [{ key: 'glanzy-pink', slug: 'glanzy-pink', quantity: 1 }]

async function seedCart(page) {
  await page.addInitScript((entries) => {
    localStorage.setItem('lapritel_cart', JSON.stringify(entries))
  }, cartWithPinkBag)
}

async function fillDelivery(page) {
  await page.locator('#fullName').fill('Ama Mensah')
  await page.locator('#email').fill('ama@example.com')
  await page.locator('#phone').fill('0241234567')
  await page.locator('#address').fill('12 Osu Street')
  await page.locator('#city').fill('Accra')
  await page.locator('#region').selectOption('Greater Accra')
}

test.beforeEach(async ({ page }) => {
  await mockApi(page)
  await seedCart(page)
})

test('an empty checkout form shows field errors instead of paying', async ({ page }) => {
  await page.goto('/checkout')
  await page.getByRole('button', { name: 'Checkout', exact: true }).click()

  await expect(page.getByText('Enter a valid email address')).toBeVisible()
  await expect(page.getByText('Delivery address is required')).toBeVisible()
})

test('buy for me creates a shareable link from the checkout details', async ({ page }) => {
  await page.goto('/checkout')
  await fillDelivery(page)
  await page.getByRole('button', { name: 'Buy for me' }).click()

  await expect(page.getByText(`/buy-for-me/${buyToken}`)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Copy link' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Share on WhatsApp' })).toHaveAttribute(
    'href',
    /wa\.me/
  )
})

test('the buy for me page shows the requested bags and total', async ({ page }) => {
  await page.goto(`/buy-for-me/${buyToken}`)

  await expect(page.getByRole('heading', { name: 'Buy for Ama' })).toBeVisible()
  await expect(page.getByText('GHS 800', { exact: true }).last()).toBeVisible()
  await expect(page.getByRole('button', { name: /Pay GHS 800/ })).toBeVisible()
})

test('an unknown buy for me link says it is no longer available', async ({ page }) => {
  await page.goto('/buy-for-me/unknown-token')

  await expect(page.getByText('This link is no longer available.')).toBeVisible()
})
