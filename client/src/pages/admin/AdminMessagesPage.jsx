import { useEffect, useState } from 'react'
import { fetchAdminContactMessages } from '../../services/admin'

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
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAdminContactMessages()
      .then(setMessages)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <p className="text-ink/60">Loading messages...</p>
  if (error) return <p className="text-sm text-burgundy">{error}</p>
  if (messages.length === 0) return <p className="text-ink/60">No messages yet.</p>

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="rounded-2xl border border-black/10 p-6">
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
            <p className="text-xs text-ink/60">{formatDate(message.created_at)}</p>
          </div>

          <p className="mt-4 whitespace-pre-wrap text-sm text-ink/80">{message.message}</p>
        </div>
      ))}
    </div>
  )
}

export default AdminMessagesPage
