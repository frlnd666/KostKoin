import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, getCurrentProfile } from '../../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { email, password } = formData

      // Coba login dulu
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      // Jika login berhasil
      if (signInData?.user && !signInError) {
        setUser(signInData.user)

        // Cek profile - apakah sudah lengkap?
        const profile = await getCurrentProfile()

        if (!profile) {
          // Profile tidak ada (seharusnya sudah dibuat oleh trigger)
          // Redirect ke register untuk isi data
          navigate('/register')
          return
        }

        // Cek apakah full_name masih default ('User' atau 'User Baru')
        const isProfileIncomplete = 
          !profile.full_name || 
          profile.full_name === 'User' || 
          profile.full_name === 'User Baru' ||
          profile.full_name.trim() === ''

        if (isProfileIncomplete) {
          // Profile belum lengkap -> redirect ke register
          navigate('/register')
          return
        }

        // Profile sudah lengkap -> redirect sesuai role
        if (profile.role === 'pemilik') {
          navigate('/owner')
        } else {
          navigate('/renter')
        }
        return
      }

      // Jika login gagal (user tidak ada), coba SIGNUP
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

          // User baru -> selalu redirect ke register untuk isi data
          navigate('/register')
          return
        }
      }

      // Error lainnya
      throw signInError || new Error('Login/Signup gagal')

    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">KostKoin</h1>
          <p className="text-gray-600">Pas di Saku, Pas di Hati</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Masuk / Daftar'}
          </button>
        </form>

        {/* Info */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Belum punya akun? Langsung masuk saja, sistem akan otomatis buatkan akun baru!
        </p>
      </div>
    </div>
  )
}
