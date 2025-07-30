import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getVisits } from '../services/visitService'

// Import your new modal components
import AddVisitModal from '../components/visits/AddVisitModal'
import EditVisitModal from '../components/visits/EditVisitModal'

export default function Dashboard() {
  const { currentUser, logout } = useAuth()
  const [visits, setVisits] = useState([])
  const [isAddingVisit, setIsAddingVisit] = useState(false)
  const [editingVisit, setEditingVisit] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVisits = async () => {
      try {
        const data = await getVisits()
        console.log('✅ Setting visits:', data)
        setVisits(data)
      } catch (err) {
        console.error('💥 Failed to load visits:', err)
      } finally {
        setLoading(false)
      }
    }
    loadVisits()
  }, [])

  return (
    <div className="container mt-4">
      {/* Navbar */}
      <nav className="navbar-sticky">
        <div className="navbar-container">
          <img src="/tbc.png" alt="SchoolTrack Logo"/>
          <h1 className="navbar-title"> <strong>{currentUser?.name}</strong>'s School Visits</h1>
          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </nav>

      {/* Loading, Empty, or Table */}
      {loading ? (
        <p>Loading visits...</p>
      ) : visits.length === 0 ? (
        <p>No visits recorded yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>School Name</th>
                <th>Purchase Type</th>
                <th>Location</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr key={visit.id}>
                  <td>{visit.schoolName}</td>
                  <td>{visit.purchaseType}</td>
                  <td>{visit.location}</td>
                  <td>{visit.contactPerson}</td>
                  <td>{visit.phoneNumber}</td>
                  <td>
                    <span
                      className={`status-badge status-${visit.booklistStatus.toLowerCase()}`}
                    >
                      {visit.booklistStatus}
                    </span>
                  </td>
                  <td>{new Date(visit.dateOfVisit).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => setEditingVisit(visit)}
                      className="btn btn-sm btn-primary"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Action Buttons */}
      <div className="btn">
        <button
          onClick={() => setIsAddingVisit(true)}
          className="btn btn-primary"
        >
          + Add New Visit
        </button>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-secondary"
        >
          🔁 Refresh
        </button>
      </div>

      {/* Add Visit Modal */}
      {isAddingVisit && (
        <AddVisitModal
          onClose={() => setIsAddingVisit(false)}
          onSuccess={(newVisit) => {
            setVisits(prev => [newVisit, ...prev]) 
          }}
        />
      )}

      {/* Edit Visit Modal */}
      {editingVisit && (
        <EditVisitModal
          visitId={editingVisit.id}
          onClose={() => setEditingVisit(null)}
          onSuccess={(updated) => {
            setVisits(prev => prev.map(v => v.id === updated.id ? updated : v))
          }}
        />
      )}
    </div>
  )
}