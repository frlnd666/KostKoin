import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Users, Phone, ArrowRight } from 'react-feather'
import { createProfile, getCurrentUser } from '../../lib/supabase'
import { useAuthStore } from '../../store'

export default function Register() {
  const navigate = useNavigate()
  const { setProfile } = useAuthStore()
  const [formData, setFormData] = useState({
    full_name: '',
    role: 'penyewa',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.full_name || formData.full_name.length < 3) {
      setError('Nama lengkap minimal 3 karakter')
      return
    }

    setLoading(true)

    try {
      const user = await getCurrentUser()
      if (!user) {
        setError('Sesi login tidak ditemukan')
        navigate('/login')
        return
      }

      const profile = await createProfile(user.id, {
        full_name: formData.full_name,
        role: formData.role,
        phone: formData.phone || user.phone
      })

      setProfile(profile)

      // Redirect based on role
      if (profile.role === 'pemilik') {
        navigate('/owner')
      } else {
        navigate('/renter')
      }

    } catch (err) {
      setError(err.message || 'Gagal membuat profil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <Users size={32} color="#14B8A6" />
          </div>
          <h1 style={styles.title}>Lengkapi Profil</h1>
          <p style={styles.subtitle}>
            Kami butuh beberapa informasi untuk melanjutkan
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div style={styles.error}>{error}</div>
          )}

          {/* Nama Lengkap */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <User size={18} />
              <span>Nama Lengkap</span>
            </label>
            <input
              type="text"
              style={styles.input}
              placeholder="Masukkan nama lengkap"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              minLength={3}
              disabled={loading}
            />
          </div>

          {/* Role */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Users size={18} />
              <span>Saya adalah</span>
            </label>
            <div style={styles.roleContainer}>
              <button
                type="button"
                style={{
                  ...styles.roleButton,
                  ...(formData.role === 'penyewa' ? styles.roleButtonActive : {})
                }}
                onClick={() => setFormData({ ...formData, role: 'penyewa' })}
                disabled={loading}
              >
                <div style={styles.roleIcon}>🏠</div>
                <div>
                  <div style={styles.roleTitle}>Penyewa</div>
                  <div style={styles.roleDesc}>Cari kost per jam</div>
                </div>
              </button>

              <button
                type="button"
                style={{
                  ...styles.roleButton,
                  ...(formData.role === 'pemilik' ? styles.roleButtonActive : {})
                }}
                onClick={() => setFormData({ ...formData, role: 'pemilik' })}
                disabled={loading}
              >
                <div style={styles.roleIcon}>🔑</div>
                <div>
                  <div style={styles.roleTitle}>Pemilik</div>
                  <div style={styles.roleDesc}>Sewakan kost</div>
                </div>
              </button>
            </div>
          </div>

          {/* Phone (Optional) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Phone size={18} />
              <span>Nomor HP (opsional)</span>
            </label>
            <input
              type="tel"
              style={styles.input}
              placeholder="08xxx"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div style={styles.spinner}></div>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <span>Lanjutkan</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#0F1419',
    padding: '1rem',
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    background: '#1E252E',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  iconCircle: {
    width: '64px',
    height: '64px',
    background: 'rgba(20, 184, 166, 0.1)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: '0.875rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  error: {
    padding: '0.875rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '0.5rem',
    color: '#EF4444',
    fontSize: '0.875rem',
    textAlign: 'center',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#F8FAFC',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    background: '#141B22',
    border: '1px solid #2D3748',
    borderRadius: '0.5rem',
    color: '#F8FAFC',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  roleContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  roleButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    background: '#141B22',
    border: '2px solid #2D3748',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
  },
  roleButtonActive: {
    background: 'rgba(20, 184, 166, 0.1)',
    borderColor: '#14B8A6',
    boxShadow: '0 0 20px rgba(20, 184, 166, 0.2)',
  },
  roleIcon: {
    fontSize: '1.5rem',
  },
  roleTitle: {
    color: '#F8FAFC',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  roleDesc: {
    color: '#94A3B8',
    fontSize: '0.75rem',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem',
    background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
    transition: 'transform 0.2s',
    marginTop: '0.5rem',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  }
}
