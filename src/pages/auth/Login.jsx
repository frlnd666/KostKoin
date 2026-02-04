import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Smartphone, Mail, ArrowRight } from 'react-feather'
import { supabase, getCurrentProfile } from '../../lib/supabase'
import { useAuthStore } from '../../store'
import './Auth.css'

function Login() {
  const navigate = useNavigate()
  const { setUser, setProfile } = useAuthStore()

  const [loginMethod, setLoginMethod] = useState('email') // 'email' or 'phone'
  const [step, setStep] = useState('input') // 'input' or 'otp'

  // Email states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Phone states
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Email Login
  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email dan password harus diisi')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      setUser(data.user)
      const profile = await getCurrentProfile()

      if (!profile) {
        navigate('/register')
      } else {
        setProfile(profile)
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Email atau password salah')
    } finally {
      setLoading(false)
    }
  }

  // Phone OTP
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

      const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone })
      if (error) throw error

      setStep('otp')
    } catch (err) {
      setError(err.message || 'Gagal mengirim OTP')
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

      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      })

      if (error) throw error

      setUser(data.user)
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

        {/* Method Selector */}
        <div className="login-method-selector">
          <button
            className={`method-btn ${loginMethod === 'email' ? 'active' : ''}`}
            onClick={() => {
              setLoginMethod('email')
              setStep('input')
              setError('')
            }}
          >
            <Mail size={20} />
            <span>Email</span>
          </button>
          <button
            className={`method-btn ${loginMethod === 'phone' ? 'active' : ''}`}
            onClick={() => {
              setLoginMethod('phone')
              setStep('input')
              setError('')
            }}
          >
            <Smartphone size={20} />
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Email Form */}
        {loginMethod === 'email' && (
          <form onSubmit={handleEmailLogin} className="auth-form">
            <div className="form-group">
              <label>
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
              <ArrowRight size={20} />
            </button>

            <p className="form-footer">
              Belum punya akun? Daftar saat pertama login
            </p>
          </form>
        )}

        {/* Phone Form - Input */}
        {loginMethod === 'phone' && step === 'input' && (
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
        )}

        {/* Phone Form - OTP */}
        {loginMethod === 'phone' && step === 'otp' && (
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
              onClick={() => setStep('input')}
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
