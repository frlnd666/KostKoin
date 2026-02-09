import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase, getCurrentProfile } from './lib/supabase'
import { useAuthStore } from './store'

import LoadingScreen from './components/LoadingScreen'
import ErrorBoundary from './components/ErrorBoundary'

import RenterLayout from './layouts/RenterLayout'
import OwnerLayout from './layouts/OwnerLayout'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import RenterHome from './pages/renter/Home'
import RenterProfile from './pages/renter/Profile'
import RenterOrders from './pages/renter/Orders'
import RenterBooking from './pages/renter/Booking'
import RenterKostDetail from './pages/renter/KostDetail'

import OwnerDashboard from './pages/owner/Dashboard'
import OwnerKosts from './pages/owner/Kosts'
import OwnerBookings from './pages/owner/Bookings'
import OwnerProfile from './pages/owner/Profile'

function App() {
  const { user, profile, loading, setUser, setProfile, setLoading, getCurrentRole, isProfileComplete } =
    useAuthStore()

  useEffect(() => {
    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          await loadProfile()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const initAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await loadProfile()
      }
    } catch (error) {
      console.error('Auth init error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async () => {
    try {
      const userProfile = await getCurrentProfile()
      if (userProfile) setProfile(userProfile)
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  if (loading) return <LoadingScreen />

  const requireAuth = (element) => {
    if (!user) return <Navigate to="/login" replace />
    if (!profile || !isProfileComplete()) return <Navigate to="/register" replace />
    return element
  }

  const role = getCurrentRole()
  const isRenter = role === 'penyewa'

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={user ? <Navigate to={isRenter ? '/renter' : '/owner'} replace /> : <Login />} />
          <Route path="/register" element={user ? <Register /> : <Navigate to="/login" replace />} />

          {/* Renter routes */}
          <Route
            path="/renter"
            element={requireAuth(<RenterLayout />)}
          >
            <Route index element={<RenterHome />} />
            <Route path="kost/:id" element={<RenterKostDetail />} />
            <Route path="booking/:id" element={<RenterBooking />} />
            <Route path="orders" element={<RenterOrders />} />
            <Route path="profile" element={<RenterProfile />} />
          </Route>

          {/* Owner routes */}
          <Route
            path="/owner"
            element={requireAuth(<OwnerLayout />)}
          >
            <Route index element={<OwnerDashboard />} />
            <Route path="kosts" element={<OwnerKosts />} />
            <Route path="bookings" element={<OwnerBookings />} />
            <Route path="profile" element={<OwnerProfile />} />
          </Route>

          {/* Default */}
          <Route
            path="/"
            element={
              user
                ? <Navigate to={isRenter ? '/renter' : '/owner'} replace />
                : <Navigate to="/login" replace />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
