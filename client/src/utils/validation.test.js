import { describe, expect, it } from 'vitest'
import { EMAIL_PATTERN, NAME_PATTERN, PHONE_PATTERN, SLUG_PATTERN } from '../shared/validation'

describe('shared validation rules', () => {
  it('accepts plain names and rejects emojis and digits', () => {
    expect(NAME_PATTERN.test("Ama O'Brien-Mensah")).toBe(true)
    expect(NAME_PATTERN.test('Ama 😀')).toBe(false)
    expect(NAME_PATTERN.test('Ama2')).toBe(false)
  })

  it('requires exactly ten digits for phone numbers', () => {
    expect(PHONE_PATTERN.test('0241234567')).toBe(true)
    expect(PHONE_PATTERN.test('024123456')).toBe(false)
    expect(PHONE_PATTERN.test('+233241234567')).toBe(false)
  })

  it('accepts a basic email and rejects one with spaces', () => {
    expect(EMAIL_PATTERN.test('ama@example.com')).toBe(true)
    expect(EMAIL_PATTERN.test('ama @example.com')).toBe(false)
  })

  it('accepts lowercase hyphenated slugs only', () => {
    expect(SLUG_PATTERN.test('bag-glanzy')).toBe(true)
    expect(SLUG_PATTERN.test('Bag Glanzy')).toBe(false)
  })
})
