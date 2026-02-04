import { useState, useEffect } from 'react'
import { MapPin, RefreshCw } from 'react-feather'
import { useMapStore } from '../store'
import './LocationBar.css'

function LocationBar() {
  const { userLocation, setUserLocation } = useMapStore()
  const [locationName, setLocationName] = useState('Mendeteksi lokasi...')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    detectLocation()
  }, [])

  const detectLocation = () => {
    setLoading(true)

    if (!navigator.geolocation) {
      setLocationName('Geolokasi tidak tersedia')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })
        setLocationName('Provinsi Banten')
        setLoading(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        setLocationName('Provinsi Banten')
        setUserLocation({ lat: -6.12, lng: 106.15 })
        setLoading(false)
      }
    )
  }

  return (
    <div className="location-bar">
      <div className="location-icon">
        <MapPin size={18} />
      </div>
      <div className="location-text">
        <span className="location-label">Lokasi Anda</span>
        <span className="location-value">{locationName}</span>
      </div>
      <button className="location-refresh" onClick={detectLocation} disabled={loading}>
        <RefreshCw size={16} className={loading ? 'spinning' : ''} />
      </button>
    </div>
  )
}

export default LocationBar
