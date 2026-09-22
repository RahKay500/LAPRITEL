import { useEffect, useState } from 'react'
import { fetchAdminCustomers } from '../../services/admin'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function AdminCustomersPage() {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAdminCustomers()
      .then(setCustomers)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <p className="text-ink/60">Loading customers...</p>
  if (error) return <p className="text-sm text-burgundy">{error}</p>
  if (customers.length === 0) return <p className="text-ink/60">No customers yet.</p>

  return (
    <div className="overflow-x-auto border border-black/10">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-burgundy-tint/40 text-xs uppercase tracking-wide text-ink/60">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b border-black/10 last:border-0">
              <td className="px-4 py-3 text-ink">{customer.fullName || '—'}</td>
              <td className="px-4 py-3 text-ink/70">{customer.email}</td>
              <td className="px-4 py-3 text-ink/70">{customer.phone || '—'}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                    customer.role === 'admin'
                      ? 'bg-burgundy text-white'
                      : 'bg-burgundy-tint text-burgundy'
                  }`}
                >
                  {customer.role}
                </span>
              </td>
              <td className="px-4 py-3 text-ink/70">{formatDate(customer.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminCustomersPage
