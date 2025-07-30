// src/services/visitService.js
const API_URL = 'http://localhost:5000/api/visits'

const getToken = () => localStorage.getItem('authToken')

// ✅ Create one visit
export const createVisits = async (data) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to save visit' }))
    throw new Error(error.message)
  }

  return response.json()
}

// ✅ Get all visits for current champion
export const getVisits = async () => {
  const response = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to load visits' }))
    throw new Error(error.message)
  }

  const data = await response.json()
  console.log('📬 Visits received:', data)
  return data
}

// Get single visit by ID
export const getVisitById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to load visit' }))
    throw new Error(error.message)
  }

  return response.json()
}

// Update visit
export const updateVisit = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update visit' }))
    throw new Error(error.message)
  }

  return response.json()
}

// Fetch all visits (admin only)
export const getAdminVisits = async () => {
  const response = await fetch('http://localhost:5000/api/visits/admin/all', {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to load admin visits' }))
    throw new Error(error.message)
  }

  return response.json()
}