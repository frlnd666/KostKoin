import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Home, User, ClipboardList } from 'react-feather'
import { useAuthStore } from '../store'
import { signOut } from '../lib/supabase'

export default function RenterLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await signOut()
      logout()
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const currentPath = location.pathname

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <div style={styles.appName}>KostKoin</div>
          <div style={styles.appTagline}>Pas di Saku, Pas di Hati</div>
        </div>
        <button style={styles.avatar} onClick={() => navigate('/renter/profile')}>
          <span>{profile?.full_name?.charAt(0)?.toUpperCase() || 'K'}</span>
        </button>
      </header>

      {/* Content */}
      <main style={styles.main}>
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav style={styles.nav}>
        <NavItem
          icon={<Home size={20} />}
          label="Beranda"
          active={currentPath === '/renter'}
          onClick={() => navigate('/renter')}
        />
        <NavItem
          icon={<ClipboardList size={20} />}
          label="Pesanan"
          active={currentPath.startsWith('/renter/orders')}
          onClick={() => navigate('/renter/orders')}
        />
        <NavItem
          icon={<User size={20} />}
          label="Profil"
          active={currentPath.startsWith('/renter/profile')}
          onClick={() => navigate('/renter/profile')}
        />
      </nav>

      {/* Logout Floating Button */}
      <button style={styles.logoutFab} onClick={handleLogout}>
        Keluar
      </button>
    </div>
  )
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.navItem,
        ...(active ? styles.navItemActive : {}),
      }}
    >
      <div style={styles.navIcon}>{icon}</div>
      <span style={styles.navLabel}>{label}</span>
    </button>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, #0D9488 0%, #0F1419 45%, #020617 100%)',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '4.5rem',
  },
  header: {
    padding: '1.25rem 1.25rem 0.75rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#F8FAFC',
  },
  appTagline: {
    fontSize: '0.75rem',
    color: '#94A3B8',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '999px',
    border: '1px solid rgba(148, 163, 184, 0.5)',
    background: 'rgba(15, 23, 42, 0.9)',
    color: '#E2E8F0',
    fontWeight: 600,
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    padding: '0.75rem 1.25rem 1rem',
  },
  nav: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    padding: '0.5rem 1.25rem 0.75rem',
    background: 'rgba(15, 23, 42, 0.92)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(148, 163, 184, 0.25)',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '0.75rem',
  },
  navItem: {
    flex: 1,
    borderRadius: '999px',
    padding: '0.45rem 0.75rem',
    background: 'transparent',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#94A3B8',
    fontSize: '0.7rem',
  },
  navItemActive: {
    background: 'rgba(20, 184, 166, 0.14)',
    color: '#E5FEFF',
    boxShadow: '0 0 18px rgba(20, 184, 166, 0.4)',
  },
  navIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: '0.7rem',
  },
  logoutFab: {
    position: 'fixed',
    right: '1.25rem',
    bottom: '4.5rem',
    padding: '0.4rem 0.9rem',
    borderRadius: '999px',
    border: 'none',
    fontSize: '0.75rem',
    background: 'rgba(15, 23, 42, 0.95)',
    color: '#F97373',
    borderColor: 'rgba(248, 113, 113, 0.7)',
    borderStyle: 'solid',
    borderWidth: '1px',
    cursor: 'pointer',
  },
}
