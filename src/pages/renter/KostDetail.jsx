import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Star, Clock, ChevronLeft, Heart } from 'react-feather'
import { getKostBySlug, getKostReviews, addFavorite, removeFavorite, isFavorite } from '../../lib/supabase'
import { useAuthStore } from '../../store'
import './KostDetail.css'

function KostDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuthStore()

  const [kost, setKost] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    loadKostDetail()
  }, [slug])

  const loadKostDetail = async () => {
    try {
      const kostData = await getKostBySlug(slug)
      setKost(kostData)

      const reviewsData = await getKostReviews(kostData.id)
      setReviews(reviewsData)

      if (profile) {
        const favStatus = await isFavorite(profile.id, kostData.id)
        setIsFav(favStatus)
      }
    } catch (error) {
      console.error('Error loading kost:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async () => {
    if (!profile || !kost) return

    try {
      if (isFav) {
        await removeFavorite(profile.id, kost.id)
        setIsFav(false)
      } else {
        await addFavorite(profile.id, kost.id)
        setIsFav(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  if (loading) return <div className="loading-state">Loading...</div>
  if (!kost) return <div className="error-page">Kost tidak ditemukan</div>

  const photos = kost.photos && kost.photos.length > 0 
    ? kost.photos 
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200']

  const availableRooms = kost.rooms?.filter(r => r.status === 'available').length || 0

  return (
    <div className="kost-detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <button className="favorite-btn" onClick={handleFavorite}>
          <Heart size={24} fill={isFav ? '#EF4444' : 'none'} color={isFav ? '#EF4444' : '#fff'} />
        </button>
      </div>

      <div className="photo-gallery">
        <img src={photos[0]} alt={kost.name} className="main-photo" />
      </div>

      <div className="detail-content">
        <div className="detail-section">
          <h1 className="detail-title">{kost.name}</h1>

          <div className="detail-meta">
            <div className="meta-item">
              <MapPin size={16} />
              <span>{kost.address}, {kost.city}</span>
            </div>
            <div className="meta-item">
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <span>{kost.rating_avg || '0.0'} ({kost.total_reviews} ulasan)</span>
            </div>
            <div className="meta-item">
              <Clock size={16} />
              <span>Min. {kost.min_duration_hours} jam</span>
            </div>
          </div>
        </div>

        <div className="detail-section price-section">
          <div className="price-info">
            <span className="price-label">Mulai dari</span>
            <div className="price-value">
              <span className="price-amount">Rp {((kost.price_per_hour || 0) * 3).toLocaleString('id-ID')}</span>
              <span className="price-unit">/3 jam</span>
            </div>
            <span className="price-hourly">Rp {(kost.price_per_hour || 0).toLocaleString('id-ID')}/jam</span>
          </div>
          <div className="availability-info">
            <span className="availability-badge">{availableRooms} kamar tersedia</span>
          </div>
        </div>

        {kost.description && (
          <div className="detail-section">
            <h2 className="section-title">Deskripsi</h2>
            <p className="description-text">{kost.description}</p>
          </div>
        )}

        {kost.facilities && kost.facilities.length > 0 && (
          <div className="detail-section">
            <h2 className="section-title">Fasilitas</h2>
            <div className="facilities-grid">
              {kost.facilities.map((facility, idx) => (
                <div key={idx} className="facility-item">
                  <span>{facility}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="booking-footer">
        <div className="footer-price">
          <span className="footer-price-label">Mulai dari</span>
          <span className="footer-price-value">
            Rp {((kost.price_per_hour || 0) * 3).toLocaleString('id-ID')}
          </span>
        </div>
        <button className="btn-book" onClick={() => navigate(`/booking/${kost.id}`)}>
          Pesan Sekarang
        </button>
      </div>
    </div>
  )
}

export default KostDetail
