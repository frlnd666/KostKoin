import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, ArrowRight } from 'react-feather'
import { createProfile, getCurrentUser } from '../../lib/supabase'
import { useAuthStore } from '../../store'
import './Auth.css'

function Register() {
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
      navigate('/')
    } catch (err) {
      setError(err.message || 'Gagal membuat profil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Lengkapi Profil</h1>
          <p>Kami butuh beberapa informasi untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>
              <User size={16} />
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Nama Anda"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Saya ingin:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="penyewa"
                  checked={formData.role === 'penyewa'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                <span>Sewa kost per jam (Penyewa)</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="pemilik"
                  checked={formData.role === 'pemilik'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                <span>Sewakan kost saya (Pemilik)</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="both"
                  checked={formData.role === 'both'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                <span>Keduanya</span>
              </label>
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Lanjutkan'}
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
