import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Smartphone, ArrowRight } from 'react-feather'
import { signInWithOTP, verifyOTP, getCurrentProfile } from '../../lib/supabase'
import { useAuthStore } from '../../store'
import './Auth.css'

function Login() {
  const navigate = useNavigate()
  const { setUser, setProfile } = useAuthStore()
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')

    if (!phone || phone.length < 10) {
      setError('Nomor telepon tidak valid')
      return
    }

    setLoading(true)
    try {
      const formattedPhone = phone.startsWith('0') 
        ? `+62${phone.slice(1)}` 
        : phone.startsWith('+62') 
        ? phone 
        : `+62${phone}`

      await signInWithOTP(formattedPhone)
      setStep('otp')
    } catch (err) {
      setError(err.message || 'Gagal mengirim kode OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')

    if (!otp || otp.length !== 6) {
      setError('Kode OTP harus 6 digit')
      return
    }

    setLoading(true)
    try {
      const formattedPhone = phone.startsWith('0') 
        ? `+62${phone.slice(1)}` 
        : phone.startsWith('+62') 
        ? phone 
        : `+62${phone}`

      const { session } = await verifyOTP(formattedPhone, otp)
      setUser(session.user)

      const profile = await getCurrentProfile()

      if (!profile) {
        navigate('/register')
      } else {
        setProfile(profile)
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Kode OTP salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="logo-large">K</div>
          <h1>KostKoin</h1>
          <p>Pas di Saku, Pas di Waktu</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="auth-form">
            <div className="form-group">
              <label>
                <Smartphone size={16} />
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                placeholder="081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Kode OTP'}
              <ArrowRight size={20} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="auth-form">
            <div className="form-group">
              <label>Kode OTP</label>
              <input
                type="text"
                className="otp-input"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                disabled={loading}
              />
              <p className="form-hint">Kode dikirim ke {phone}</p>
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
            </button>

            <button 
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep('phone')}
              disabled={loading}
            >
              Ubah Nomor
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login
