// frontend/src/services/adminService.js

const API_URL = 'http://localhost:5000/api/admin';

// Get the auth header with JWT token
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Get all champions
export const getChampions = async () => {
  const response = await fetch(`${API_URL}/champions`, {
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to load champions' }));
    throw new Error(error.message);
  }

  return response.json();
};

// Update a champion
export const updateChampion = async (id, data) => {
  const response = await fetch(`${API_URL}/champions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update champion' }));
    throw new Error(error.message);
  }

  return response.json();
};