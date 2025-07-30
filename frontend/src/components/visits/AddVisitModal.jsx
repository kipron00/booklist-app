// src/components/visits/AddVisitModal.jsx
import { useState } from 'react'
import { createVisits } from '../../services/visitService'

export default function AddVisitModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    dateOfVisit: new Date().toISOString().split('T')[0],
    schoolName: '',
    location: '',
    contactPerson: '',
    phoneNumber: '',
    email: '',
    purchaseType: 'Complete Booklist',
    booklistStatus: 'Pending',
    remarks: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const newVisit = await createVisits(formData)
      setSuccess('✅ Visit recorded successfully!')

      // Notify parent
      onSuccess?.(newVisit)

      // Auto-close after 1.5s
      setTimeout(() => {
        onClose()
      }, 600)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Record School Visit</h2>
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

              {/* Add Visit Form */}
              <form onSubmit={handleSubmit} className="modal-form">
                {/* Date of Visit */}
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

                {/* School Name */}
                <div>
                  <label>School Name</label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    placeholder="Enter school name"
                    className="form-control"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter school location"
                    className="form-control"
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label>Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Enter contact person's name"
                    className="form-control"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="0712345678"
                    className="form-control"
                  />
                </div>

                {/* Email */}
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter contact email address"
                    className="form-control"
                  />
                </div>

                {/* Purchase Type */}
                <div>
                  <label>Purchase Type</label>
                  <select
                    name="purchaseType"
                    value={formData.purchaseType}
                    onChange={handleChange}
                    className="form-control"
                    required
                  >
                    <option value="Complete Booklist">Complete Booklist</option>
                    <option value="Bookfund">Bookfund</option>
                    <option value="Stationery">Stationery</option>
                  </select>
                </div>

                {/* Booklist Status */}
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

                {/* Remarks */}
                <div>
                  <label>Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Enter any additional information or notes about the visit"
                    rows="4"
                    className="form-control"
                  />
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">Save Visit</button>
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