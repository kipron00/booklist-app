// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userStr = localStorage.getItem('currentUser')

    // ✅ Add try/catch for safety
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        setCurrentUser(user)
        console.log('🔐 AuthProvider: Restored user:', user)
      } catch (err) {
        console.error('❌ Failed to parse currentUser:', err)
        localStorage.removeItem('authToken')
        localStorage.removeItem('currentUser')
      }
    }

    setLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('currentUser', JSON.stringify(userData))
    setCurrentUser(userData)

    // ✅ Redirect based on role
    if (userData.role === 'admin') {
      navigate('/admin-dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
    navigate('/')
  }

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export { AuthContext }