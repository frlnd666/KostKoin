import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase, getCurrentProfile } from './lib/supabase'
import { useAuthStore } from './store'

import RenterLayout from './layouts/RenterLayout'
import OwnerLayout from './layouts/OwnerLayout'

import RenterHome from './pages/renter/Home'
import KostDetail from './pages/renter/KostDetail'
import Booking from './pages/renter/Booking'
import Orders from './pages/renter/Orders'
import QRAccess from './pages/renter/QRAccess'
import RenterProfile from './pages/renter/Profile'

import OwnerDashboard from './pages/owner/Dashboard'
import OwnerKosts from './pages/owner/Kosts'
import OwnerBookings from './pages/owner/Bookings'
import OwnerProfile from './pages/owner/Profile'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import LoadingScreen from './components/LoadingScreen'
import ErrorBoundary from './components/ErrorBoundary'

import './App.css'

function App() {
  const { user, profile, currentRole, loading, setUser, setProfile, setLoading } = useAuthStore()

  useEffect(() => {
    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const initAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await loadProfile(session.user.id)
      }
    } catch (error) {
      console.error('Auth init error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async (userId) => {
    try {
      const userProfile = await getCurrentProfile()
      if (userProfile) setProfile(userProfile)
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  if (loading) return <LoadingScreen />

  if (!user || !profile) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    )
  }

  const isRenterView = currentRole === 'penyewa'

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {isRenterView ? (
            <Route element={<RenterLayout />}>
              <Route path="/" element={<RenterHome />} />
              <Route path="/kost/:slug" element={<KostDetail />} />
              <Route path="/booking/:kostId" element={<Booking />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/qr/:bookingId" element={<QRAccess />} />
              <Route path="/profile" element={<RenterProfile />} />
            </Route>
          ) : (
            <Route element={<OwnerLayout />}>
              <Route path="/" element={<OwnerDashboard />} />
              <Route path="/kosts" element={<OwnerKosts />} />
              <Route path="/bookings" element={<OwnerBookings />} />
              <Route path="/profile" element={<OwnerProfile />} />
            </Route>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
