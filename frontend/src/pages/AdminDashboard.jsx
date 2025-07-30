import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getAdminVisits } from '@/services/visitService'
import { getChampions } from '@/services/adminService'
import AddChampionForm from '../components/forms/AddChampionForm'
import EditChampionForm from '../components/forms/EditChampionForm'
import ConfirmModal from '../components/ConfirmModal'
import * as XLSX from 'xlsx'

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const [visits, setVisits] = useState([])
  const [champions, setChampions] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [isManaging, setIsManaging] = useState(false)
  const [editingChampion, setEditingChampion] = useState(null)
  const [championToDelete, setChampionToDelete] = useState(null)
  const [loading, setLoading] = useState(true)

  // ✅ Filter state
  const [filters, setFilters] = useState({
    championId: '',
    date: '',
    purchaseType: '',
    booklistStatus: ''
  })

  // ✅ Filter modal visibility
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  // Load visits and champions on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [visitsData, championsData] = await Promise.all([
          getAdminVisits(),
          getChampions()
        ])
        setVisits(visitsData)
        setChampions(championsData)
      } catch (err) {
        console.error('Failed to load ', err)
        alert('Failed to load data. Please log in again.')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [navigate])

  // Delete champion
  const handleDeleteChampion = async (id) => {
    const champion = champions.find(c => c.id === id)
    setChampionToDelete(champion)
  }

  const handleConfirmDelete = async () => {
    const id = championToDelete.id
    try {
      const response = await fetch(`http://localhost:5000/api/admin/champions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete champion')
      }

      // Remove from state
      setChampions(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setChampionToDelete(null)
    }
  }

  const handleCloseManage = () => {
    setIsManaging(false)
  }

  // ✅ Apply filters
  const filteredVisits = visits.filter(visit => {
    return (
      (filters.championId === '' || visit.championId == filters.championId) &&
      (filters.date === '' || visit.dateOfVisit.startsWith(filters.date)) &&
      (filters.purchaseType === '' || visit.purchaseType === filters.purchaseType) &&
      (filters.booklistStatus === '' || visit.booklistStatus === filters.booklistStatus)
    )
  })

  // ✅ Clear all filters
  const clearFilters = () => {
    setFilters({
      championId: '',
      date: '',
      purchaseType: '',
      booklistStatus: ''
    })
  }

  // ✅ Download visits as Excel
  const downloadExcel = (visitList, filename) => {
    // Map visits to Excel rows
    const worksheetData = visitList.map(visit => {
      const champion = champions.find(c => c.id == visit.championId)
      return {
        'Champion': champion?.name || 'Unknown',
        'School': visit.schoolName,
        'Location': visit.location,
        'Contact Person': visit.contactPerson,
        'Phone': visit.phoneNumber,
        'Email': visit.email,
        'Purchase Type': visit.purchaseType,
        'Booklist Status': visit.booklistStatus,
        'Date of Visit': new Date(visit.dateOfVisit).toLocaleDateString(),
        'Remarks': visit.remarks
      }
    })

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(worksheetData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Visits')

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="navbar-sticky">
        <div className="navbar-container">
          <img src="/tbc.png" alt="SchoolTrack Logo"/>
          <h1 className="card-title flex items-center"> <strong>{currentUser?.name}</strong>'s Dashboard </h1>
          <div className="navbar-right">
            <button onClick={logout} className="btn btn-secondary">Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container main-content">

        {/* Champion Management */}
        <div className="card mt-6">
          <h2 className="card-title">Champion Management</h2>
          <p className="card-text">Add new champions or manage existing ones.</p>

          <div className="flex gap-4 flex-wrap">
            {/* Add Button */}
            <button
              type="button"
              onClick={() => {
                setIsAdding(true)
                setIsManaging(false)
              }}
              className={`btn ${isAdding ? 'btn-primary' : 'btn-secondary'}`}
            >
              + Add Champion
            </button>

            {/* Manage Button */}
            <button
              type="button"
              onClick={() => {
                setIsManaging(true)
                setIsAdding(false)
              }}
              className={`btn ${isManaging ? 'btn-primary' : 'btn-secondary'}`}
            >
              🔍 Manage Champions
            </button>
          </div>

          {/* Add Champion Form */}
          {isAdding && (
            <div className="border-t pt-4 mt-4">
              <AddChampionForm 
                onChampionAdded={(newChamp) => {
                  setChampions(prev => [...prev, newChamp])
                  setTimeout(() => setIsAdding(false), 600)
                }}
                onClose={() => setIsAdding(false)}
              />
            </div>
          )}

          {/* ✅ Manage Champions as Modal */}
          {isManaging && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title">All Champions</h2>
                  <button onClick={() => setIsManaging(false)} className="modal-close">×</button>
                </div>

                <div className="modal-body">
                  {champions.length === 0 ? (
                    <p>No champions added yet.</p>
                  ) : (
                    <div className="table-container">
                      <table className='manage-champion-table'>
                        <thead>
                          <tr className = "manage-champion-tr">
                            <th>Name</th>
                            <th>Payroll Number</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {champions.map(c => (
                            <tr key={c.id}>
                              <td>{c.name}</td>
                              <td>{c.payrollNumber}</td>
                              <td className="flex gap-2">
                                <button
                                  onClick={() => setEditingChampion(c)}
                                  className="btn btn-sm btn-secondary"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteChampion(c.id)}
                                  className="btn btn-sm btn-danger"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="modal-footer mt-4">
                  <button
                    onClick={() => setIsManaging(false)}
                    className="btn btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Visits Table */}
        <div className="card mt-6">
          {/* Header with Filter Button on Right */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">All School Visits</h2>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="btn btn-secondary text-sm px-4"
            >
              🔍 Filter Visits
            </button>
          </div>

          {loading ? (
            <p>Loading visits...</p>
          ) : filteredVisits.length === 0 ? (
            <p>No visits match the selected filters.</p>
          ) : (
            <div className="table-container">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th>Champion</th>
                    <th>School</th>
                    <th>Location</th>
                    <th>Contact</th>
                    <th>Purchase Type</th>
                    <th>Status</th>
                    <th>Date</th>
                    {/* ✅ Remarks Column Added */}
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisits.map((visit) => {
                    const champion = champions.find(c => c.id == visit.championId)
                    const championName = champion?.name || 'Unknown'
                    return (
                      <tr key={visit.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{championName}</td>
                        <td className="py-3 px-4">{visit.schoolName}</td>
                        <td className="py-3 px-4">{visit.location}</td>
                        <td className="py-3 px-4">{visit.contactPerson} | {visit.phoneNumber}</td>
                        <td className="py-3 px-4">{visit.purchaseType}</td>
                        <td className="py-3 px-4">
                          <span className={`status-badge status-${visit.booklistStatus.toLowerCase()}`}>
                            {visit.booklistStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(visit.dateOfVisit).toLocaleDateString()}
                        </td>
                        {/* ✅ Show Remarks */}
                        <td className="py-3 px-4">{visit.remarks || '-'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Download Buttons */}
        <div className="flex gap-6 justify-center mt-8">
          <button
            type="button"
            onClick={() => downloadExcel(filteredVisits, 'Filtered_Visits')}
            className="btn btn-primary px-6 py-2"
          >
            📥 Download Filtered Visits
          </button>
          <button
            type="button"
            onClick={() => downloadExcel(visits, 'All_Visits')}
            className="btn btn-secondary px-6 py-2"
          >
            📥 Download All Visits
          </button>
        </div>
      </main>

      {/* Edit Modal */}
      {editingChampion && (
        <EditChampionForm
          champion={editingChampion}
          onClose={() => setEditingChampion(null)}
          onUpdate={(updated) => {
            setChampions(prev => prev.map(c => c.id === updated.id ? updated : c))
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!championToDelete}
        title="Delete Champion"
        message={`Are you sure you want to delete "${championToDelete?.name}"? This cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setChampionToDelete(null)}
      />

      {/* Filter Visits Modal */}
      {isFilterModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Filter Visits</h2>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Filter by Champion */}
                <div>
                  <label className="block text-gray-700 mb-1">Champion</label>
                  <select
                    value={filters.championId}
                    onChange={(e) => setFilters(prev => ({ ...prev, championId: e.target.value }))}
                    className="form-control"
                  >
                    <option value="">All Champions</option>
                    {champions.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter by Date */}
                <div>
                  <label className="block text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                    className="form-control"
                  />
                </div>

                {/* Filter by Purchase Type */}
                <div>
                  <label className="block text-gray-700 mb-1">Purchase Type</label>
                  <select
                    value={filters.purchaseType}
                    onChange={(e) => setFilters(prev => ({ ...prev, purchaseType: e.target.value }))}
                    className="form-control"
                  >
                    <option value="">All Types</option>
                    <option value="Booklist">Booklist</option>
                    <option value="Bookfund">Bookfund</option>
                    <option value="Stationery">Stationery</option>
                  </select>
                </div>

                {/* Filter by Booklist Status */}
                <div>
                  <label className="block text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.booklistStatus}
                    onChange={(e) => setFilters(prev => ({ ...prev, booklistStatus: e.target.value }))}
                    className="form-control"
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Successful">Successful</option>
                    <option value="Unsuccessful">Unsuccessful</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer mt-6">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn btn-secondary"
                >
                  Clear Filters
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="btn btn-primary"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}