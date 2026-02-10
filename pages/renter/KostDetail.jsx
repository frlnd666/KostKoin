import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Star, ArrowLeft, Clock } from 'react-feather'

export default function KostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const kost = {
    id,
    name: 'Kost Harmoni Syariah',
    location: 'Cikole, Serang',
    pricePerHour: 15000,
    rating: 4.8,
    reviews: 120,
    facilities: ['AC', 'WiFi', 'Kamar mandi dalam', 'Parkir motor'],
    description:
      'Kost harian / per jam yang bersih dan nyaman, cocok untuk istirahat singkat atau WFH. Dekat kampus dan pusat kuliner.',
  }

  return (
    <div style={styles.wrapper}>
      {/* Header image */}
      <div style={styles.hero}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <div style={styles.heroTag}>Tersedia</div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h1 style={styles.title}>{kost.name}</h1>

        <div style={styles.row}>
          <div style={styles.location}>
            <MapPin size={14} />
            <span>{kost.location}</span>
          </div>
          <div style={styles.rating}>
            <Star size={14} color="#FBBF24" fill="#FBBF24" />
            <span>{kost.rating}</span>
            <span style={styles.ratingReviews}>({kost.reviews}+)</span>
          </div>
        </div>

        <div style={styles.priceCard}>
          <div>
            <div style={styles.priceLabel}>Mulai dari</div>
            <div style={styles.priceValue}>
              Rp {kost.pricePerHour.toLocaleString('id-ID')}
              <span style={styles.priceUnit}> / jam</span>
            </div>
          </div>
          <div style={styles.priceBadge}>
            <Clock size={14} />
            <span>Bayar sesuai durasi</span>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Fasilitas</div>
          <div style={styles.facilityList}>
            {kost.facilities.map((f) => (
              <span key={f} style={styles.facilityChip}>{f}</span>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Deskripsi</div>
          <p style={styles.description}>{kost.description}</p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={styles.bottomBar}>
        <div>
          <div style={styles.bottomPrice}>
            Rp {kost.pricePerHour.toLocaleString('id-ID')}
            <span style={styles.priceUnit}> / jam</span>
          </div>
          <div style={styles.bottomSub}>Minimal 2 jam, fleksibel</div>
        </div>
        <button
          style={styles.ctaButton}
          onClick={() => navigate(`/renter/booking/${kost.id}`)}
        >
          Pilih Jam
        </button>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'relative',
    paddingBottom: '4rem',
  },
  hero: {
    height: '160px',
    borderRadius: '1.25rem',
    background:
      'radial-gradient(circle at top left, #14B8A6 0%, #020617 45%, #000 100%)',
    position: 'relative',
    marginBottom: '1rem',
    overflow: 'hidden',
    border: '1px solid rgba(55, 65, 81, 0.9)',
  },
  backButton: {
    position: 'absolute',
    top: '0.75rem',
    left: '0.75rem',
    width: '32px',
    height: '32px',
    borderRadius: '999px',
    border: 'none',
    background: 'rgba(15, 23, 42, 0.85)',
    color: '#E5E7EB',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTag: {
    position: 'absolute',
    bottom: '0.85rem',
    left: '0.85rem',
    padding: '0.25rem 0.7rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    color: '#BBF7D0',
    background: 'rgba(22, 163, 74, 0.45)',
    border: '1px solid rgba(74, 222, 128, 0.8)',
  },
  content: {
    padding: '0 0.25rem',
  },
  title: {
    fontSize: '1.15rem',
    color: '#F9FAFB',
    marginBottom: '0.35rem',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    color: '#9CA3AF',
    fontSize: '0.8rem',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem',
    color: '#FACC15',
    fontSize: '0.8rem',
  },
  ratingReviews: {
    color: '#9CA3AF',
    fontSize: '0.75rem',
  },
  priceCard: {
    borderRadius: '1rem',
    padding: '0.9rem 1rem',
    background: 'rgba(15, 23, 42, 0.95)',
    border: '1px solid rgba(31, 41, 55, 0.9)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.9rem',
  },
  priceLabel: {
    fontSize: '0.75rem',
    color: '#9CA3AF',
    marginBottom: '0.25rem',
  },
  priceValue: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#6EE7B7',
  },
  priceUnit: {
    fontSize: '0.75rem',
    color: '#9CA3AF',
    marginLeft: '0.25rem',
  },
  priceBadge: {
    padding: '0.4rem 0.7rem',
    borderRadius: '0.75rem',
    background: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid rgba(55, 65, 81, 0.9)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: '#E5E7EB',
    fontSize: '0.75rem',
  },
  section: {
    marginTop: '1rem',
  },
  sectionTitle: {
    fontSize: '0.9rem',
    color: '#E5E7EB',
    marginBottom: '0.35rem',
  },
  facilityList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
  },
  facilityChip: {
    fontSize: '0.75rem',
    color: '#E5E7EB',
    padding: '0.2rem 0.55rem',
    borderRadius: '999px',
    background: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid rgba(55, 65, 81, 0.9)',
  },
  description: {
    fontSize: '0.85rem',
    color: '#CBD5F5',
    lineHeight: 1.6,
  },
  bottomBar: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: '3.9rem',
    padding: '0.65rem 1.25rem',
    background: 'rgba(15, 23, 42, 0.97)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(31, 41, 55, 0.9)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomPrice: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#6EE7B7',
  },
  bottomSub: {
    fontSize: '0.75rem',
    color: '#9CA3AF',
  },
  ctaButton: {
    padding: '0.75rem 1.2rem',
    borderRadius: '999px',
    border: 'none',
    background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    color: '#F9FAFB',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(20, 184, 166, 0.45)',
  },
}
