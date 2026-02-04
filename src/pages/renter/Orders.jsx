import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, MapPin, Calendar } from 'react-feather'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { getUserBookings } from '../../lib/supabase'
import { useAuthStore } from '../../store'
import './Orders.css'

function Orders() {
  const navigate = useNavigate()
  const { profile } = useAuthStore()

  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()
  }, [filter])

  const loadBookings = async () => {
    if (!profile) return

    setLoading(true)
    try {
      const statusFilter = filter === 'all' ? null : filter
      const data = await getUserBookings(profile.id, statusFilter)
      setBookings(data)
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      booked: { label: 'Dipesan', class: 'status-booked' },
      active: { label: 'Aktif', class: 'status-active' },
      completed: { label: 'Selesai', class: 'status-completed' },
      cancelled: { label: 'Dibatalkan', class: 'status-cancelled' }
    }
    return statusMap[status] || { label: status, class: '' }
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Pesanan Saya</h1>
      </div>

      <div className="filter-tabs">
        {['all', 'booked', 'active', 'completed'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Semua' : getStatusBadge(f).label}
          </button>
        ))}
      </div>

      <div className="orders-content">
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <Clock size={48} />
            <h3>Belum ada pesanan</h3>
            <p>Mulai sewa kost per jam sekarang</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Cari Kost
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map(booking => (
              <BookingCard 
                key={booking.id} 
                booking={booking}
                onClick={() => {
                  if (booking.status === 'active' || booking.status === 'booked') {
                    navigate(`/qr/${booking.id}`)
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BookingCard({ booking, onClick }) {
  const statusInfo = {
    booked: { label: 'Dipesan', class: 'status-booked' },
    active: { label: 'Aktif', class: 'status-active' },
    completed: { label: 'Selesai', class: 'status-completed' },
    cancelled: { label: 'Dibatalkan', class: 'status-cancelled' }
  }

  const status = statusInfo[booking.status] || { label: booking.status, class: '' }

  return (
    <div className="booking-card" onClick={onClick}>
      <div className="booking-card-header">
        <span className={`status-badge ${status.class}`}>{status.label}</span>
        <span className="booking-code">{booking.booking_code}</span>
      </div>

      <h3 className="booking-kost-name">{booking.kost?.name}</h3>

      <div className="booking-details">
        <div className="booking-detail-item">
          <MapPin size={14} />
          <span>{booking.kost?.city}</span>
        </div>
        <div className="booking-detail-item">
          <Calendar size={14} />
          <span>{format(new Date(booking.start_time), 'dd MMM yyyy, HH:mm', { locale: idLocale })}</span>
        </div>
        <div className="booking-detail-item">
          <Clock size={14} />
          <span>{booking.duration_hours} jam</span>
        </div>
      </div>

      <div className="booking-price">
        <span>Total</span>
        <span className="price-value">Rp {booking.total_price.toLocaleString('id-ID')}</span>
      </div>
    </div>
  )
}

export default Orders
