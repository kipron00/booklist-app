// src/components/ui/Navbar.jsx
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const handleHomeClick = () => {
    if (!currentUser) return
    if (currentUser.role === 'admin') {
      navigate('/admin-dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <nav className="navbar-sticky">
      <div className="navbar-container">
        {/* Logo + Home Link */}
        <div
          className="navbar-logo clickable"
          onClick={handleHomeClick}
        >
          <img
            src="/tbc.png"
            alt="SchoolTrack Logo"
          />

          <h1 className="navbar-title">SchoolTrack</h1>
        </div>

        {/* Right Side: Admin Login or User Info */}
        <div className="navbar-right">
          {currentUser ? (
            // Logged in: Show user info
            <div className="navbar-user-info">
              <span className="navbar-role">
                {currentUser.role === 'admin' ? 'Admin' : 'Champion'}:{' '}
                <strong>{currentUser.name}</strong>
              </span>
            </div>
          ) : (
            // Not logged in: Show Admin Login link
            <a
              href="/admin-login"
              className="navbar-link"
            >
              Admin Login
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}