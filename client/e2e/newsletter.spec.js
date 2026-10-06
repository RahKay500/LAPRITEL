import { test, expect } from '@playwright/test'
import { mockApi } from './fixtures.js'

test.beforeEach(async ({ page }) => {
  await mockApi(page)
})

test('a visitor can join the newsletter and sees a real confirmation', async ({ page }) => {
  let saved = null
  await page.route('**/api/newsletter', (route) => {
    saved = route.request().postDataJSON()
    return route.fulfill({ status: 201, json: { message: 'Thanks for subscribing!' } })
  })

  await page.goto('/')
  await page.locator('#newsletter-email').fill('ama@example.com')
  await page.getByRole('button', { name: 'Subscribe' }).click()

  await expect(page.getByRole('status')).toHaveText('Thanks for subscribing!')
  expect(saved).toEqual({ email: 'ama@example.com' })
})

test('a failed save shows an error instead of a fake thank you', async ({ page }) => {
  await page.route('**/api/newsletter', (route) =>
    route.fulfill({ status: 500, json: { message: 'Server error' } })
  )

  await page.goto('/')
  await page.locator('#newsletter-email').fill('ama@example.com')
  await page.getByRole('button', { name: 'Subscribe' }).click()

  await expect(page.getByRole('alert')).toBeVisible()
  await expect(page.getByRole('status')).toHaveCount(0)
})
