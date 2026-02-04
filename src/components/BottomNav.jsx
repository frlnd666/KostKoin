import { Link, useLocation } from 'react-router-dom'
import { Home, Clipboard, Key, User, Grid, Package, Users, Settings } from 'react-feather'
import './BottomNav.css'

function BottomNav({ role }) {
  const location = useLocation()

  const renterNav = [
    { path: '/', icon: Home, label: 'Beranda' },
    { path: '/orders', icon: Clipboard, label: 'Pesanan' },
    { path: '/qr', icon: Key, label: 'Akses' },
    { path: '/profile', icon: User, label: 'Profil' }
  ]

  const ownerNav = [
    { path: '/', icon: Grid, label: 'Dashboard' },
    { path: '/kosts', icon: Package, label: 'Kost' },
    { path: '/bookings', icon: Users, label: 'Booking' },
    { path: '/profile', icon: Settings, label: 'Profil' }
  ]

  const navItems = role === 'pemilik' ? ownerNav : renterNav

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = location.pathname === item.path

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${active ? 'active' : ''}`}
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default BottomNav
