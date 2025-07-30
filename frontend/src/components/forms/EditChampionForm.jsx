// src/components/forms/EditChampionForm.jsx
import { useState, useEffect } from 'react'
import { updateChampion } from '@/services/adminService'

export default function EditChampionForm({ champion, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: '',
    payrollNumber: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load champion data
  useEffect(() => {
    if (champion) {
      setFormData({
        name: champion.name,
        payrollNumber: champion.payrollNumber,
        password: ''
      })
    }
  }, [champion])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const updated = await updateChampion(champion.id, formData)
      setSuccess('Champion updated successfully!')
      setTimeout(() => {
        onUpdate?.(updated)
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  // ✅ Only render if champion exists
  if (!champion) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Edit Champion</h2>
          <button onClick={onClose} className="modal-close" aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          {success ? (
            <div className="alert-success">{success}</div>
          ) : (
            <>
              {error && <div className="alert-error">{error}</div>}

              <form onSubmit={handleSubmit} className="modal-form">
                <div>
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
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
                    required
                  />
                </div>

                <div>
                  <label>New Password (optional)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary"
                  >
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