import { useState, useEffect } from 'react'
import { DollarSign, Home, Users, TrendingUp } from 'react-feather'
import { getOwnerKosts, getOwnerBookings } from '../../lib/supabase'
import { useAuthStore } from '../../store'
import './Dashboard.css'

function Dashboard() {
  const { profile } = useAuthStore()
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalKosts: 0,
    totalBookings: 0,
    activeBookings: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    if (!profile) return

    try {
      const [kosts, bookings] = await Promise.all([
        getOwnerKosts(profile.id),
        getOwnerBookings(profile.id)
      ])

      const revenue = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.total_price, 0)

      const activeBookings = bookings.filter(b => 
        b.status === 'active' || b.status === 'booked'
      ).length

      setStats({
        totalRevenue: revenue,
        totalKosts: kosts.length,
        totalBookings: bookings.length,
        activeBookings
      })
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading-state">Loading...</div>

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Selamat datang, {profile?.full_name}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <DollarSign size={32} />
          <div className="stat-content">
            <span className="stat-label">Total Pendapatan</span>
            <span className="stat-value">
              Rp {(stats.totalRevenue / 1000).toFixed(0)}K
            </span>
          </div>
        </div>

        <div className="stat-card">
          <Home size={32} />
          <div className="stat-content">
            <span className="stat-label">Jumlah Kost</span>
            <span className="stat-value">{stats.totalKosts}</span>
          </div>
        </div>

        <div className="stat-card">
          <Users size={32} />
          <div className="stat-content">
            <span className="stat-label">Booking Aktif</span>
            <span className="stat-value">{stats.activeBookings}</span>
          </div>
        </div>

        <div className="stat-card">
          <TrendingUp size={32} />
          <div className="stat-content">
            <span className="stat-label">Total Booking</span>
            <span className="stat-value">{stats.totalBookings}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
