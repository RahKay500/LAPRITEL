import { useEffect, useState } from 'react'
import { AuthContext } from './auth-context'
import { api } from '../services/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .get('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  async function register(payload) {
    const data = await api.post('/auth/register', payload)
    setUser(data.user)
    return data.user
  }

  async function login(payload) {
    const data = await api.post('/auth/login', payload)
    setUser(data.user)
    return data.user
  }

  async function logout() {
    await api.post('/auth/logout')
    setUser(null)
  }

  async function updateProfile(payload) {
    const data = await api.patch('/auth/me', payload)
    setUser(data.user)
    return data.user
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, register, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}
