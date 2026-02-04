import { useState, useEffect } from 'react'
import { Plus, ToggleLeft, ToggleRight } from 'react-feather'
import { getOwnerKosts, updateKost } from '../../lib/supabase'
import { useAuthStore } from '../../store'
import './Kosts.css'

function Kosts() {
  const { profile } = useAuthStore()
  const [kosts, setKosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadKosts()
  }, [])

  const loadKosts = async () => {
    if (!profile) return

    try {
      const data = await getOwnerKosts(profile.id)
      setKosts(data)
    } catch (error) {
      console.error('Error loading kosts:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleKostStatus = async (kostId, currentStatus) => {
    try {
      await updateKost(kostId, { is_active: !currentStatus })
      setKosts(prev => prev.map(k => 
        k.id === kostId ? { ...k, is_active: !currentStatus } : k
      ))
    } catch (error) {
      console.error('Error toggling kost:', error)
      alert('Gagal mengubah status kost')
    }
  }

  return (
    <div className="kosts-page">
      <div className="kosts-header">
        <h1>Kost Saya</h1>
        <button className="btn-add">
          <Plus size={20} />
          Tambah Kost
        </button>
      </div>

      <div className="kosts-content">
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : kosts.length === 0 ? (
          <div className="empty-state">
            <h3>Belum ada kost</h3>
            <p>Mulai tambahkan kost Anda</p>
          </div>
        ) : (
          <div className="kosts-list">
            {kosts.map(kost => (
              <KostItem 
                key={kost.id} 
                kost={kost}
                onToggle={() => toggleKostStatus(kost.id, kost.is_active)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function KostItem({ kost, onToggle }) {
  return (
    <div className="kost-item">
      <div className="kost-item-header">
        <div>
          <h3 className="kost-name">{kost.name}</h3>
          <p className="kost-address">{kost.city}</p>
        </div>
        <button 
          className={`toggle-btn ${kost.is_active ? 'active' : ''}`}
          onClick={onToggle}
        >
          {kost.is_active ? (
            <ToggleRight size={32} />
          ) : (
            <ToggleLeft size={32} />
          )}
        </button>
      </div>

      <div className="kost-item-stats">
        <div className="kost-stat">
          <span className="stat-label">Harga</span>
          <span className="stat-value">
            Rp {kost.price_per_hour.toLocaleString('id-ID')}/jam
          </span>
        </div>
        <div className="kost-stat">
          <span className="stat-label">Total Booking</span>
          <span className="stat-value">{kost.total_bookings || 0}</span>
        </div>
        <div className="kost-stat">
          <span className="stat-label">Rating</span>
          <span className="stat-value">{kost.rating_avg || '0.0'}</span>
        </div>
      </div>
    </div>
  )
}

export default Kosts
