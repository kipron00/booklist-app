// src/components/visits/EditVisitModal.jsx
import { useState, useEffect } from 'react'
import { getVisitById, updateVisit } from '../../services/visitService'

export default function EditVisitModal({ visitId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    contactPerson: '',
    phoneNumber: '',
    email: '',
    purchaseType: 'Complete Booklist',
    booklistStatus: 'Pending',
    remarks: '',
    dateOfVisit: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('') // ✅ Add success state

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getVisitById(visitId)
        setFormData({
          contactPerson: data.contactPerson || '',
          phoneNumber: data.phoneNumber || '',
          email: data.email || '',
          purchaseType: data.purchaseType || 'Complete Booklist',
          booklistStatus: data.booklistStatus || 'Pending',
          remarks: data.remarks || '',
          dateOfVisit: data.dateOfVisit.split('T')[0] // Format for date input
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [visitId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const updated = await updateVisit(visitId, formData)
      setSuccess('✅ Visit updated successfully!')

      // Notify parent
      onSuccess?.(updated)

      // Auto-close after 1.5s
      setTimeout(() => {
        onClose()
      }, 600)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-body">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Edit Visit</h2>
          <button onClick={onClose} className="modal-close">✕</button>
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

              {/* Edit Visit Form */}
              <form onSubmit={handleSubmit} className="modal-form">
                <div>
                  <label>Date of Visit</label>
                  <input
                    type="date"
                    name="dateOfVisit"
                    value={formData.dateOfVisit}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div>
                  <label>Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div>
                  <label>Purchase Type</label>
                  <select
                    name="purchaseType"
                    value={formData.purchaseType}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="Complete Booklist">Complete Booklist</option>
                    <option value="Bookfund">Bookfund</option>
                    <option value="Stationery">Stationery</option>
                  </select>
                </div>

                <div>
                  <label>Booklist Status</label>
                  <select
                    name="booklistStatus"
                    value={formData.booklistStatus}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Successful">Successful</option>
                    <option value="Unsuccessful">Unsuccessful</option>
                  </select>
                </div>

                <div>
                  <label>Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    rows="4"
                    className="form-control"
                  />
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                  <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}