import { useAuthStore } from '../store'
import { User, Bell } from 'react-feather'
import './Header.css'

function Header() {
  const { profile } = useAuthStore()

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">K</div>
          <span className="logo-text">KostKoin</span>
        </div>
        <div className="header-actions">
          <button className="header-btn">
            <Bell size={20} />
          </button>
          <button className="header-btn">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="avatar" />
            ) : (
              <User size={20} />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
