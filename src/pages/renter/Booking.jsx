import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Calendar, Clock } from 'react-feather'
import { format, addHours } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { getKostById, getAvailableRooms, createBooking } from '../../lib/supabase'
import { useAuthStore } from '../../store'
import './Booking.css'

function Booking() {
  const { kostId } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuthStore()

  const [kost, setKost] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedRoom, setSelectedRoom] = useState(null)
  const [duration, setDuration] = useState(3)
  const [startTime, setStartTime] = useState(new Date())

  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadBookingData()
  }, [kostId])

  const loadBookingData = async () => {
    try {
      const kostData = await getKostById(kostId)
      setKost(kostData)
      setDuration(kostData.min_duration_hours)

      const now = new Date()
      const endTime = addHours(now, kostData.min_duration_hours)

      const availableRooms = await getAvailableRooms(kostId, now.toISOString(), endTime.toISOString())
      setRooms(availableRooms)

      if (availableRooms.length > 0) {
        setSelectedRoom(availableRooms[0].id)
      }
    } catch (error) {
      console.error('Error loading booking data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!kost || !selectedRoom || !profile) return

    setProcessing(true)
    try {
      const endTime = addHours(startTime, duration)

      const booking = await createBooking({
        user_id: profile.id,
        kost_id: kost.id,
        room_id: selectedRoom,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration_hours: duration,
        price_per_hour: kost.price_per_hour,
        total_price: kost.price_per_hour * duration
      })

      navigate(`/qr/${booking.id}`)
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Gagal membuat booking')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <div className="loading-state">Loading...</div>
  if (!kost) return <div className="error-page">Kost tidak ditemukan</div>

  const totalPrice = kost.price_per_hour * duration

  return (
    <div className="booking-page">
      <div className="booking-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1>Pesan Kost</h1>
      </div>

      <div className="booking-content">
        <div className="booking-kost-info">
          <h2>{kost.name}</h2>
          <p>{kost.address}, {kost.city}</p>
        </div>

        <div className="booking-section">
          <h3><Clock size={18} /> Durasi Sewa</h3>
          <div className="duration-options">
            {[3, 6, 12, 24].map(h => (
              <button
                key={h}
                className={`duration-btn ${duration === h ? 'active' : ''}`}
                onClick={() => setDuration(h)}
                disabled={h < kost.min_duration_hours}
              >
                {h} jam
              </button>
            ))}
          </div>
        </div>

        <div className="booking-section">
          <h3>Pilih Kamar</h3>
          {rooms.length === 0 ? (
            <p className="no-rooms">Tidak ada kamar tersedia</p>
          ) : (
            <div className="rooms-list">
              {rooms.map(room => (
                <label key={room.id} className="room-option">
                  <input
                    type="radio"
                    name="room"
                    value={room.id}
                    checked={selectedRoom === room.id}
                    onChange={() => setSelectedRoom(room.id)}
                  />
                  <span>Kamar {room.room_number} - {room.room_type}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="booking-section">
          <h3>Detail Pembayaran</h3>
          <div className="payment-detail">
            <div className="payment-row">
              <span>Harga per jam</span>
              <span>Rp {kost.price_per_hour.toLocaleString('id-ID')}</span>
            </div>
            <div className="payment-row">
              <span>Durasi</span>
              <span>{duration} jam</span>
            </div>
            <div className="payment-row total">
              <span>Total</span>
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-footer">
        <div className="footer-total">
          <span>Total Pembayaran</span>
          <span className="total-value">Rp {totalPrice.toLocaleString('id-ID')}</span>
        </div>
        <button 
          className="btn-confirm" 
          onClick={handleBooking}
          disabled={processing || !selectedRoom || rooms.length === 0}
        >
          {processing ? 'Memproses...' : 'Konfirmasi Booking'}
        </button>
      </div>
    </div>
  )
}

export default Booking
