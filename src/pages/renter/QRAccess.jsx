import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Clock } from 'react-feather'
import QRCode from 'qrcode.react'
import { format, differenceInSeconds } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { getBookingById } from '../../lib/supabase'
import './QRAccess.css'

function QRAccess() {
  const { bookingId } = useParams()
  const navigate = useNavigate()

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    loadBooking()
  }, [bookingId])

  useEffect(() => {
    if (!booking) return

    const timer = setInterval(() => {
      const now = new Date()
      const end = new Date(booking.end_time)
      const seconds = differenceInSeconds(end, now)

      if (seconds <= 0) {
        setTimeLeft(null)
        clearInterval(timer)
      } else {
        setTimeLeft(seconds)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [booking])

  const loadBooking = async () => {
    try {
      const data = await getBookingById(bookingId)
      setBooking(data)
    } catch (error) {
      console.error('Error loading booking:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    if (!seconds) return '00:00:00'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  if (loading) return <div className="loading-state">Loading...</div>
  if (!booking) return <div className="error-page">Booking tidak ditemukan</div>

  const isActive = booking.status === 'active'
  const isBooked = booking.status === 'booked'

  return (
    <div className="qr-access-page">
      <div className="qr-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1>Akses Kost</h1>
      </div>

      <div className="qr-content">
        <div className="qr-section">
          <div className="qr-code-container">
            <QRCode
              value={booking.checkin_code || booking.booking_code}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="qr-instruction">Tunjukkan QR code ini ke pemilik kost</p>
        </div>

        {(isActive || isBooked) && timeLeft !== null && (
          <div className="countdown-section">
            <Clock size={32} />
            <div className="countdown-info">
              <span className="countdown-label">Waktu tersisa</span>
              <span className="countdown-value">{formatTime(timeLeft)}</span>
            </div>
          </div>
        )}

        <div className="booking-info-section">
          <h2 className="info-title">Detail Booking</h2>

          <div className="info-group">
            <span className="info-label">Kode Booking</span>
            <span className="info-value">{booking.booking_code}</span>
          </div>

          <div className="info-group">
            <span className="info-label">Kost</span>
            <span className="info-value">{booking.kost?.name}</span>
          </div>

          <div className="info-group">
            <span className="info-label">Kamar</span>
            <span className="info-value">{booking.room?.room_number} - {booking.room?.room_type}</span>
          </div>

          <div className="info-group">
            <span className="info-label">Check-in</span>
            <span className="info-value">
              {format(new Date(booking.start_time), 'dd MMMM yyyy, HH:mm', { locale: idLocale })}
            </span>
          </div>

          <div className="info-group">
            <span className="info-label">Check-out</span>
            <span className="info-value">
              {format(new Date(booking.end_time), 'dd MMMM yyyy, HH:mm', { locale: idLocale })}
            </span>
          </div>

          <div className="info-group">
            <span className="info-label">Durasi</span>
            <span className="info-value">{booking.duration_hours} jam</span>
          </div>

          <div className="info-group total">
            <span className="info-label">Total Pembayaran</span>
            <span className="info-value price">Rp {booking.total_price.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRAccess
