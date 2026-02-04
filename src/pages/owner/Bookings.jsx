import { useState, useEffect } from 'react'
import { Clock, User, CheckCircle } from 'react-feather'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { getOwnerBookings, updateBooking } from '../../lib/supabase'
import { useAuthStore } from '../../store'
import './Bookings.css'

function Bookings() {
  const { profile } = useAuthStore()
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    if (!profile) return

    try {
      const data = await getOwnerBookings(profile.id)
      setBookings(data)
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (bookingId) => {
    if (!confirm('Tandai booking ini sebagai selesai?')) return

    try {
      await updateBooking(bookingId, { status: 'completed' })
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'completed' } : b
      ))
    } catch (error) {
      console.error('Error completing booking:', error)
      alert('Gagal menyelesaikan booking')
    }
  }

  const filteredBookings = bookings.filter(b => 
    filter === 'all' ? true : b.status === filter
  )

  return (
    <div className="owner-bookings-page">
      <div className="bookings-header">
        <h1>Booking Masuk</h1>
      </div>

      <div className="filter-tabs">
        {['all', 'booked', 'active', 'completed'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Semua' : f}
          </button>
        ))}
      </div>

      <div className="bookings-content">
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-state">
            <Clock size={48} />
            <h3>Belum ada booking</h3>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map(booking => (
              <BookingCard 
                key={booking.id} 
                booking={booking}
                onComplete={() => handleComplete(booking.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BookingCard({ booking, onComplete }) {
  const canComplete = booking.status === 'active'

  return (
    <div className="owner-booking-card">
      <div className="booking-header">
        <span className={`status-badge status-${booking.status}`}>
          {booking.status}
        </span>
        <span className="booking-code">{booking.booking_code}</span>
      </div>

      <div className="booking-info">
        <div className="info-row">
          <User size={16} />
          <span>{booking.user?.full_name}</span>
        </div>
        <div className="info-row">
          <Clock size={16} />
          <span>
            {format(new Date(booking.start_time), 'dd MMM, HH:mm', { locale: idLocale })}
            {' - '}
            {booking.duration_hours} jam
          </span>
        </div>
      </div>

      <div className="booking-footer">
        <span className="booking-price">
          Rp {booking.total_price.toLocaleString('id-ID')}
        </span>
        {canComplete && (
          <button className="btn-complete" onClick={onComplete}>
            <CheckCircle size={16} />
            Selesai
          </button>
        )}
      </div>
    </div>
  )
}

export default Bookings
