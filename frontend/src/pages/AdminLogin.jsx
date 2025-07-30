// src/pages/AdminLogin.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' 
import { login as authService } from '../services/authService'

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login: authContextLogin } = useAuth() 

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const data = await authService(identifier, password)

      // ✅ Confirm it's an admin
      if (data.user.role !== 'admin') {
        return setError('Access denied. Admin privileges required.')
      }

      // ✅ Use AuthProvider's login — this updates state AND redirects
      authContextLogin(data.user, data.token)

      // ✅ No need for navigate() — login() handles it
    } catch (err) {
      console.error('❌ Login error:', err)
      setError(err.message || 'Invalid credentials')
    }
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Admin Login</h1>

      {error && (<div className="alert-error"> {error} </div>)}

      <form onSubmit={handleSubmit} className = "login-form">
        <div>
          <label>Name / Payroll No</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Name or payroll number"
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login as Admin
        </button>
      </form>

      <p className="btn">
        <button
          onClick={() => navigate('/')}
          className="btn btn-secondary"
        >
          ← Champion Login
        </button>
      </p>
    </div>
  )
}