import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { login as authService } from '../services/authService'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login: authLogin } = useAuth() // from AuthContext

  // ✅ handleSubmit goes here
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

  try {
    const data = await authService(identifier, password)
    authLogin(data.user, data.token) // Saves to localStorage + redirects
  } catch (err) {
    setError(err.message)
    setLoading(false)
  }
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Champion Login</h1>
      
      {error && <p className='alert-error'>{error}</p>}

      <form onSubmit={handleSubmit} className='login-form'>
        <div>
          <label> Name/ Payroll no </label>
          <input
            id = "identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Name or payroll number"
            required
          />
        </div>

        <div>
          <label> Password </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {loading ? (
              <p>Authenticating...</p>
            ) : error ? (
              <p>{error}</p>
            ) : null}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className='btn'>
        <a href="/admin-login" className="btn btn-secondary">
          Admin?{' '} Admin Login
        </a>
      </p>
    </div>
  )
}