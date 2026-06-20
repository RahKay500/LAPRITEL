import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function RequireAdmin({ children }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="px-4 py-20 text-center sm:px-6 lg:px-12">
        <p className="text-ink/60">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default RequireAdmin
