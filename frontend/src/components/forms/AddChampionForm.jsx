// src/components/forms/AddChampionForm.jsx
import { useState } from 'react'
import { getAuthHeader } from '../../services/authService'

export default function AddChampionForm({ onChampionAdded, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    payrollNumber: '',
    password: ''
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:5000/api/admin/create-champion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Failed to create champion' }))
        throw new Error(err.message)
      }

      const newChamp = await response.json()
      setSuccess('✅ Champion added successfully!')

      // Reset form
      setFormData({ name: '', payrollNumber: '', password: '' })

      // Notify parent
      onChampionAdded?.(newChamp)

      // Do NOT close yet — let user see success
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCancel = () => {
    onClose?.()
  }

  // If no `onClose`, render inline (fallback)
  if (!onClose) {
    return (
      <>
        {success && (
          <div className="alert-success" style={{ marginBottom: '1rem' }}>
            {success}
          </div>
        )}
        {error && (
          <div className="alert-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}
      </>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Add New Champion</h2>
          <button onClick={handleCancel} className="modal-close" aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* ✅ Show success message full-screen */}
          {success ? (
            <div className="text-center py-8">
              <div className="alert-success" style={{ margin: '0 auto 0.5rem', borderRadius: '8px', padding: '1rem' }}>
                {success}
              </div>
            </div>
          ) : (
            <>
              {/* Show error above form */}
              {error && (
                <div className="alert-error" style={{ marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              {/* Add Champion Form */}
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter champion's full name"
                      required
                    />
                  </div>

                  <div>
                    <label>Payroll Number</label>
                    <input
                      type="text"
                      name="payrollNumber"
                      value={formData.payrollNumber}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter payroll number"
                      required
                    />
                  </div>

                  <div>
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Set a secure password"
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Add Champion
                  </button>
                  <button type="button" onClick={handleCancel} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}