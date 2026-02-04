import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import { useMapStore } from '../store'
import 'leaflet/dist/leaflet.css'
import './MapView.css'

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

function MapController({ center, zoom }) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, zoom)
    }
  }, [center, zoom, map])

  return null
}

function MapView({ kosts = [], onKostClick }) {
  const { mapCenter, mapZoom } = useMapStore()

  return (
    <div className="map-container">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="map-view"
        scrollWheelZoom={false}
      >
        <MapController center={mapCenter} zoom={mapZoom} />

        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {kosts.map((kost) => (
          <Marker
            key={kost.id}
            position={[
              kost.location?.coordinates?.[1] || -6.12,
              kost.location?.coordinates?.[0] || 106.15
            ]}
            eventHandlers={{
              click: () => onKostClick && onKostClick(kost)
            }}
          >
            <Popup>
              <div className="kost-popup">
                <strong>{kost.name}</strong>
                <p>Rp {kost.price_per_hour?.toLocaleString('id-ID')}/jam</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default MapView
