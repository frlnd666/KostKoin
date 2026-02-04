import { User, LogOut, RefreshCw } from 'react-feather'
import { signOut } from '../../lib/supabase'
import { useAuthStore } from '../../store'
import './Profile.css'

function Profile() {
  const { profile, logout, switchRole } = useAuthStore()

  const handleLogout = async () => {
    if (confirm('Yakin ingin keluar?')) {
      await signOut()
      logout()
    }
  }

  const handleSwitchRole = () => {
    if (profile?.role === 'both') {
      switchRole('pemilik')
      window.location.reload()
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name} />
          ) : (
            <div className="avatar-placeholder">
              {profile?.full_name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h1 className="profile-name">{profile?.full_name}</h1>
        <p className="profile-phone">{profile?.phone}</p>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">{profile?.total_bookings || 0}</span>
          <span className="stat-label">Booking</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            Rp {((profile?.total_spent || 0) / 1000).toFixed(0)}K
          </span>
          <span className="stat-label">Total Pengeluaran</span>
        </div>
      </div>

      <div className="profile-menu">
        {profile?.role === 'both' && (
          <button className="menu-item" onClick={handleSwitchRole}>
            <RefreshCw size={20} />
            <span>Beralih ke Mode Pemilik</span>
          </button>
        )}

        <button className="menu-item danger" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  )
}

export default Profile
