import { fetchAdminContactMessages } from '../../services/admin'
import { usePagedList } from '../../hooks/usePagedList'

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function AdminMessagesPage() {
  const { items: messages, hasMore, isLoading, isLoadingMore, error, loadMore } =
    usePagedList(fetchAdminContactMessages)

  if (isLoading) return <p className="text-ink/75">Loading messages...</p>
  if (error) return <p className="text-sm text-burgundy">{error}</p>
  if (messages.length === 0) return <p className="text-ink/75">No messages yet.</p>

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="border border-black/15 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">{message.full_name}</p>
              <a
                href={`mailto:${message.email}`}
                className="text-sm text-burgundy hover:underline"
              >
                {message.email}
              </a>
            </div>
            <p className="text-xs text-ink/75">{formatDate(message.created_at)}</p>
          </div>

          <p className="mt-4 whitespace-pre-wrap text-sm text-ink/80">{message.message}</p>
        </div>
      ))}
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

export default AdminMessagesPage
