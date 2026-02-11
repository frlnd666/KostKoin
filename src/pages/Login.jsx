import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn, AlertCircle } from 'react-feather'
import { supabase, getCurrentProfile } from '../../lib/supabase'
import { useAuthStore } from '../../store'

export default function Login() {
  const navigate = useNavigate()
  const { setUser, setProfile } = useAuthStore()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { email, password } = formData

      // Try login first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInData?.user && !signInError) {
        setUser(signInData.user)

        const profile = await getCurrentProfile()
        
        if (!profile) {
          navigate('/register')
          return
        }

        const isProfileIncomplete = 
          !profile.full_name || 
          profile.full_name === 'User' || 
          profile.full_name === 'User Baru' || 
          profile.full_name.trim() === ''

        if (isProfileIncomplete) {
          navigate('/register')
          return
        }

        setProfile(profile)
        
        if (profile.role === 'pemilik') {
          navigate('/owner')
        } else {
          navigate('/renter')
        }
        return
      }

      // If login fails, try signup
      if (signInError?.message?.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/register`
          }
        })

        if (signUpError) throw signUpError

        if (signUpData?.user) {
          setUser(signUpData.user)
          navigate('/register')
          return
        }
      }

      throw signInError || new Error('Login/Signup gagal')

    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoCircle}>
              <span style={styles.logoText}>K</span>
            </div>
          </div>
          <h1 style={styles.title}>KostKoin V3</h1>
          <p style={styles.tagline}>Pas di Saku, Pas di Hati ✨</p>
        </div>

        {/* Form */}
        <form style={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div style={styles.error}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Mail size={18} />
              <span>Email</span>
            </label>
            <input
              type="email"
              style={styles.input}
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Lock size={18} />
              <span>Password</span>
            </label>
            <input
              type="password"
              style={styles.input}
              placeholder="Minimal 6 karakter"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
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
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Masuk / Daftar</span>
              </>
            )}
          </button>
        </form>

        <p style={styles.footer}>
          Belum punya akun? Langsung masuk saja, sistem akan otomatis buatkan akun baru! 🚀
        </p>
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
    maxWidth: '420px',
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
  logo: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  logoCircle: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(20, 184, 166, 0.4)',
  },
  logoText: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#fff',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: '0.5rem',
    background: 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  tagline: {
    color: '#94A3B8',
    fontSize: '0.875rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '0.5rem',
    color: '#EF4444',
    fontSize: '0.875rem',
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
    transition: 'border-color 0.2s, box-shadow 0.2s',
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
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: '0.813rem',
    lineHeight: '1.6',
  }
}
