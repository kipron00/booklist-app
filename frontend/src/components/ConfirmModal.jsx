// src/components/ConfirmModal.jsx
export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button onClick={onCancel} className="modal-close">
            ×
          </button>
        </div>

        <div className="modal-body">
          <p>{message}</p>

          <div className="modal-footer" style={{ marginTop: '1.5rem' }}>
            <button onClick={onConfirm} className="btn btn-danger">
              Delete
            </button>
            <button onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}