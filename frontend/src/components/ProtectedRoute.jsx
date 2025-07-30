// src/components/ProtectedRoute.jsx
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!currentUser) return <Navigate to="/" replace />

  return children
}