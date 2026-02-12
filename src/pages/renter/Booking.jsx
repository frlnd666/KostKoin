import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Clock, Calendar, ArrowLeft } from 'react-feather'

export default function Booking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hours, setHours] = useState(2)

  const kost = {
    id,
    name: 'Kost Harmoni Syariah',
    pricePerHour: 15000,
  }

  const total = hours * kost.pricePerHour

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={styles.title}>Atur Jadwal</h1>
      </div>

      <div style={styles.card}>
        <div style={styles.kostName}>{kost.name}</div>
        <div style={styles.kostPrice}>
          Rp {kost.pricePerHour.toLocaleString('id-ID')}
          <span style={styles.priceUnit}> / jam</span>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardLabel}>
          <Calendar size={16} />
          <span>Tanggal</span>
        </div>
        <input
          type="date"
          style={styles.input}
          defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </div>

      <div style={styles.card}>
        <div style={styles.cardLabel}>
          <Clock size={16} />
          <span>Durasi (jam)</span>
        </div>
        <div style={styles.hourSelector}>
          {[2, 3, 4, 6, 8].map((h) => (
            <button
              key={h}
              style={{
                ...styles.hourChip,
                ...(hours === h ? styles.hourChipActive : {}),
              }}
              onClick={() => setHours(h)}
            >
              {h} jam
            </button>
          ))}
        </div>
      </div>

      <div style={styles.bottomBar}>
        <div>
          <div style={styles.totalLabel}>Total</div>
          <div style={styles.totalValue}>
            Rp {total.toLocaleString('id-ID')}
          </div>
        </div>
        <button
          style={styles.ctaButton}
          onClick={() => {
            alert('Ini hanya dummy booking. Integrasi pembayaran bisa ditambahkan nanti.')
            navigate('/renter/orders')
          }}
        >
          Konfirmasi
        </button>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    paddingBottom: '4rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  backButton: {
    width: '32px',
    height: '32px',
    borderRadius: '999px',
    border: 'none',
    background: 'rgba(15, 23, 42, 0.9)',
    color: '#E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  title: {
    fontSize: '1.1rem',
    color: '#E5E7EB',
  },
  card: {
    background: 'rgba(15, 23, 42, 0.95)',
    borderRadius: '1rem',
    padding: '1rem',
    border: '1px solid rgba(31, 41, 55, 0.9)',
    marginBottom: '0.9rem',
  },
  kostName: {
    fontSize: '0.95rem',
    color: '#E5E7EB',
    marginBottom: '0.25rem',
  },
  kostPrice: {
    fontSize: '0.85rem',
    color: '#9CA3AF',
  },
  priceUnit: {
    fontSize: '0.75rem',
    color: '#6B7280',
    marginLeft: '0.2rem',
  },
  cardLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginBottom: '0.5rem',
    color: '#E5E7EB',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    background: '#020617',
    borderRadius: '0.75rem',
    border: '1px solid rgba(51, 65, 85, 0.9)',
    padding: '0.7rem 0.8rem',
    color: '#E5E7EB',
    fontSize: '0.9rem',
  },
  hourSelector: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  hourChip: {
    padding: '0.5rem 0.8rem',
    borderRadius: '999px',
    border: '1px solid rgba(55, 65, 81, 0.9)',
    background: '#020617',
    color: '#E5E7EB',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  hourChipActive: {
    background: 'rgba(20, 184, 166, 0.2)',
    borderColor: '#14B8A6',
    color: '#A5F3FC',
  },
  bottomBar: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: '3.9rem',
    padding: '0.65rem 1.25rem',
    background: 'rgba(15, 23, 42, 0.97)',
    borderTop: '1px solid rgba(31, 41, 55, 0.9)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: '0.8rem',
    color: '#9CA3AF',
  },
  totalValue: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#6EE7B7',
  },
  ctaButton: {
    padding: '0.75rem 1.25rem',
    borderRadius: '999px',
    border: 'none',
    background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    color: '#F9FAFB',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
}
