import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store'
import { signOut } from '../../lib/supabase'
import { User, Mail, Phone, ArrowLeft } from 'react-feather'

export default function RenterProfile() {
  const { user, profile, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      logout()
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={styles.title}>Profil</h1>
      </div>

      <div style={styles.card}>
        <div style={styles.avatar}>
          <span>{profile?.full_name?.charAt(0)?.toUpperCase() || 'P'}</span>
        </div>
        <div style={styles.name}>{profile?.full_name || 'User KostKoin'}</div>
        <div style={styles.roleBadge}>Penyewa</div>
      </div>

      <div style={styles.card}>
        <div style={styles.row}>
          <User size={16} />
          <div style={styles.rowContent}>
            <div style={styles.rowLabel}>Nama</div>
            <div style={styles.rowValue}>{profile?.full_name || '-'}</div>
          </div>
        </div>

        <div style={styles.row}>
          <Mail size={16} />
          <div style={styles.rowContent}>
            <div style={styles.rowLabel}>Email</div>
            <div style={styles.rowValue}>{user?.email || '-'}</div>
          </div>
        </div>

        <div style={styles.row}>
          <Phone size={16} />
          <div style={styles.rowContent}>
            <div style={styles.rowLabel}>Nomor HP</div>
            <div style={styles.rowValue}>{profile?.phone || '-'}</div>
          </div>
        </div>
      </div>

      <button style={styles.logoutButton} onClick={handleLogout}>
        Keluar dari KostKoin
      </button>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  backButton: {
    width: '32px',
    height: '32px',
    borderRadius: '999px',
    border: 'none',
    background: 'rgba(15, 23, 42, 0.9)',
    color: '#E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  title: {
    fontSize: '1.1rem',
    color: '#E5E7EB',
  },
  card: {
    background: 'rgba(15, 23, 42, 0.95)',
    borderRadius: '1.1rem',
    padding: '1rem',
    border: '1px solid rgba(31, 41, 55, 0.9)',
  },
  avatar: {
    width: '70px',
    height: '70px',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#E5E7EB',
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  },
  name: {
    fontSize: '1rem',
    color: '#F9FAFB',
    marginBottom: '0.25rem',
  },
  roleBadge: {
    fontSize: '0.75rem',
    color: '#A5F3FC',
    background: 'rgba(56, 189, 248, 0.15)',
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    display: 'inline-block',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingTop: '0.65rem',
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: '0.75rem',
    color: '#9CA3AF',
    marginBottom: '0.1rem',
  },
  rowValue: {
    fontSize: '0.9rem',
    color: '#E5E7EB',
  },
  logoutButton: {
    marginTop: '0.25rem',
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.75rem',
    border: '1px solid rgba(239, 68, 68, 0.7)',
    background: 'rgba(127, 29, 29, 0.25)',
    color: '#FCA5A5',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
}
