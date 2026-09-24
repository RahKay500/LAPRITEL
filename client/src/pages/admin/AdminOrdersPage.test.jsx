import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AdminOrdersPage from './AdminOrdersPage'
import { fetchAdminOrders } from '../../services/admin'

vi.mock('../../services/admin', () => ({
  ORDER_STATUSES: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'],
  fetchAdminOrders: vi.fn(),
  updateAdminOrderStatus: vi.fn(),
}))

function makeOrder(reference) {
  return {
    id: reference,
    reference,
    created_at: '2026-09-24T00:00:00Z',
    customer_name: 'Test Customer',
    customer_email: 'test@example.com',
    customer_phone: '0200000000',
    delivery_address: '1 Test Lane',
    delivery_city: 'Accra',
    delivery_region: 'Greater Accra',
    status: 'paid',
    subtotal: 500,
    order_items: [
      { id: `${reference}-item`, product_name: 'Bag Ivy', color_name: 'Red', quantity: 1, is_custom: false, line_total: 500 },
    ],
  }
}

beforeEach(() => {
  fetchAdminOrders.mockReset()
})

describe('AdminOrdersPage pagination', () => {
  it('shows page controls once the total exceeds one page, and fetches the next page on click', async () => {
    fetchAdminOrders
      .mockResolvedValueOnce({ orders: [makeOrder('PAGE1-ORDER')], total: 25 })
      .mockResolvedValueOnce({ orders: [makeOrder('PAGE2-ORDER')], total: 25 })

    const user = userEvent.setup()
    render(<AdminOrdersPage />)

    await waitFor(() => expect(screen.getByText('Order PAGE1-ORDER')).toBeInTheDocument())
    expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument()
    expect(screen.getByText(/25 orders/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Next' }))

    await waitFor(() => expect(screen.getByText('Order PAGE2-ORDER')).toBeInTheDocument())
    expect(screen.getByText(/Page 2 of 2/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled()

    expect(fetchAdminOrders).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2, limit: 20 })
    )
  })

  it('hides pagination controls when everything fits on one page', async () => {
    fetchAdminOrders.mockResolvedValueOnce({ orders: [makeOrder('ONLY-ORDER')], total: 3 })

    render(<AdminOrdersPage />)

    await waitFor(() => expect(screen.getByText('Order ONLY-ORDER')).toBeInTheDocument())
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument()
  })

  it('resets to page 1 and refetches when the status filter changes', async () => {
    fetchAdminOrders
      .mockResolvedValueOnce({ orders: [makeOrder('PAGE1-ORDER')], total: 25 })
      .mockResolvedValueOnce({ orders: [makeOrder('PAGE2-ORDER')], total: 25 })
      .mockResolvedValueOnce({ orders: [makeOrder('PAID-ORDER')], total: 1 })

    const user = userEvent.setup()
    render(<AdminOrdersPage />)
    await waitFor(() => expect(screen.getByText('Order PAGE1-ORDER')).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: 'Next' }))
    await waitFor(() => expect(screen.getByText('Order PAGE2-ORDER')).toBeInTheDocument())

    await user.selectOptions(screen.getByDisplayValue('All statuses'), 'paid')

    await waitFor(() => expect(screen.getByText('Order PAID-ORDER')).toBeInTheDocument())
    expect(fetchAdminOrders).toHaveBeenLastCalledWith(
      expect.objectContaining({ status: 'paid', page: 1 })
    )
  })
})
