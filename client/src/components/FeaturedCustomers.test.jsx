import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import FeaturedCustomers from './FeaturedCustomers'
import { fetchFeaturedCustomers } from '../services/featuredCustomers'

vi.mock('../services/featuredCustomers', () => ({
  fetchFeaturedCustomers: vi.fn(),
}))

beforeEach(() => {
  fetchFeaturedCustomers.mockReset()
})

describe('FeaturedCustomers', () => {
  it('renders nothing when no one is featured', async () => {
    fetchFeaturedCustomers.mockResolvedValue([])
    const { container } = render(<MemoryRouter><FeaturedCustomers /></MemoryRouter>)

    await waitFor(() => expect(fetchFeaturedCustomers).toHaveBeenCalled())
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the request fails, so the homepage still loads', async () => {
    fetchFeaturedCustomers.mockRejectedValue(new Error('down'))
    const { container } = render(<MemoryRouter><FeaturedCustomers /></MemoryRouter>)

    await waitFor(() => expect(fetchFeaturedCustomers).toHaveBeenCalled())
    expect(container).toBeEmptyDOMElement()
  })

  it('shows each featured customer as a photo with their first name', async () => {
    fetchFeaturedCustomers.mockResolvedValue([
      { id: '1', first_name: 'Ama', quote: 'I wear it everywhere.', image_url: 'https://example.com/ama.jpg' },
    ])
    render(<MemoryRouter><FeaturedCustomers /></MemoryRouter>)

    expect(await screen.findByText('Ama')).toBeInTheDocument()
    expect(screen.getByAltText('A LAPRITEL bag carried by Ama')).toHaveAttribute(
      'src',
      'https://example.com/ama.jpg'
    )
  })
})
