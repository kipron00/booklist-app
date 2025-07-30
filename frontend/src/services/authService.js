// src/services/authService.js
const API_URL = 'http://localhost:5000/api/auth'

export const login = async (identifier, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }))
    throw new Error(error.message)
  }

  return response.json() // Just return data — no redirect!
}

export const getAuthHeader = () => {
  const token = localStorage.getItem('authToken')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}