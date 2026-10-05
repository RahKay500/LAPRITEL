import { fetchAdminCustomers } from '../../services/admin'
import { usePagedList } from '../../hooks/usePagedList'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function AdminCustomersPage() {
  const { items: customers, hasMore, isLoading, isLoadingMore, error, loadMore } =
    usePagedList(fetchAdminCustomers)

  if (isLoading) return <p className="text-ink/75">Loading customers...</p>
  if (error) return <p className="text-sm text-burgundy">{error}</p>
  if (customers.length === 0) return <p className="text-ink/75">No customers yet.</p>

  return (
    <div className="overflow-x-auto border border-black/15">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-black/15 bg-burgundy-tint/40 text-xs uppercase tracking-wide text-ink/75">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b border-black/15 last:border-0">
              <td className="px-4 py-3 text-ink">{customer.fullName || '—'}</td>
              <td className="px-4 py-3 text-ink/85">{customer.email}</td>
              <td className="px-4 py-3 text-ink/85">{customer.phone || '—'}</td>
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
              <td className="px-4 py-3 text-ink/85">{formatDate(customer.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {hasMore && (
  <div className="mt-8 text-center">
    <button
      type="button"
      onClick={loadMore}
      disabled={isLoadingMore}
      className="rounded-full border-2 border-burgundy px-8 py-2.5 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoadingMore ? 'Loading...' : 'Load more'}
    </button>
  </div>
)}
    </div>
  )
}

export default AdminCustomersPage
