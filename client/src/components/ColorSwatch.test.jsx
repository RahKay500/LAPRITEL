import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ColorSwatch from './ColorSwatch'

describe('ColorSwatch', () => {
  it('renders a solid circle with the given hex when no image or two-tone data is given', () => {
    const { container } = render(<ColorSwatch hex="#ff0000" />)
    const span = container.firstChild
    expect(span.style.background).toBe('rgb(255, 0, 0)')
  })

  it('renders an image when one is provided, even if hex/two-tone props are also present', () => {
    render(
      <ColorSwatch
        hex="#ff0000"
        isTwoTone
        topHex="#00ff00"
        bottomHex="#0000ff"
        image="/red.jpg"
        alt="Red"
      />
    )
    const img = screen.getByRole('img', { name: 'Red' })
    expect(img).toHaveAttribute('src', '/red.jpg')
  })

  it('renders two stacked solid halves for a two-tone swatch with no image', () => {
    const { container } = render(
      <ColorSwatch isTwoTone topHex="#7c3aed" bottomHex="#ffd400" />
    )
    const halves = container.querySelectorAll('span > span')
    expect(halves).toHaveLength(2)
    expect(halves[0].style.background).toBe('rgb(124, 58, 237)')
    expect(halves[1].style.background).toBe('rgb(255, 212, 0)')
  })
})
