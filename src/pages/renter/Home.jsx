import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Star, MapPin, Clock } from 'react-feather'
import { searchNearbyKosts } from '../../lib/supabase'
import { useMapStore } from '../../store'
import LocationBar from '../../components/LocationBar'
import MapView from '../../components/MapView'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const { userLocation, nearbyKosts, setNearbyKosts } = useMapStore()
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (userLocation) {
      loadNearbyKosts()
    }
  }, [userLocation])

  const loadNearbyKosts = async () => {
    if (!userLocation) return

    setLoading(true)
    try {
      const kosts = await searchNearbyKosts(userLocation.lat, userLocation.lng, 20)
      setNearbyKosts(kosts)
    } catch (error) {
      console.error('Error loading kosts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredKosts = nearbyKosts.filter(kost => 
    searchQuery ? kost.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return (
    <div className="renter-home">
      <LocationBar />

      <div className="search-section">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Cari kost di Banten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="filter-btn">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <MapView 
        kosts={filteredKosts} 
        onKostClick={(kost) => navigate(`/kost/${kost.slug}`)}
      />

      <div className="kosts-section">
        <div className="section-header">
          <h2>Kost Terdekat</h2>
          <span className="section-count">{filteredKosts.length} kost</span>
        </div>

        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : filteredKosts.length === 0 ? (
          <div className="empty-state">
            <MapPin size={48} />
            <h3>Tidak ada kost di sekitar</h3>
            <p>Coba perluas radius pencarian</p>
          </div>
        ) : (
          <div className="kosts-grid">
            {filteredKosts.map(kost => (
              <KostCard 
                key={kost.id} 
                kost={kost} 
                onClick={() => navigate(`/kost/${kost.slug}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function KostCard({ kost, onClick }) {
  const photo = kost.photos && kost.photos.length > 0 
    ? kost.photos[0] 
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'

  return (
    <div className="kost-card" onClick={onClick}>
      <div className="kost-card-image">
        <img src={photo} alt={kost.name} />
        <div className="kost-card-badge">
          <Clock size={12} />
          <span>Min. {kost.min_duration_hours}j</span>
        </div>
      </div>

      <div className="kost-card-content">
        <h3 className="kost-card-title">{kost.name}</h3>

        <div className="kost-card-location">
          <MapPin size={14} />
          <span>{kost.city} • {kost.distance_km} km</span>
        </div>

        <div className="kost-card-footer">
          <div className="kost-card-price">
            <span className="price-amount">
              Rp {((kost.price_per_hour || 0) * 3).toLocaleString('id-ID')}
            </span>
            <span className="price-unit">/3 jam</span>
          </div>

          <div className="kost-card-rating">
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            <span>{kost.rating_avg || '0.0'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
