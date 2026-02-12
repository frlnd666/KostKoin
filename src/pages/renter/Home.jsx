import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Star, Search } from 'react-feather'

const dummyKosts = [
  {
    id: '1',
    name: 'Kost Harmoni Syariah',
    location: 'Cikole, Serang',
    pricePerHour: 15000,
    rating: 4.8,
    reviews: 120,
    distance: '450 m',
    tag: 'Dekat kampus',
  },
  {
    id: '2',
    name: 'Kost Premium Sudirman',
    location: 'Cipare, Serang',
    pricePerHour: 22000,
    rating: 4.9,
    reviews: 98,
    distance: '1.2 km',
    tag: 'AC + Wifi kencang',
  },
  {
    id: '3',
    name: 'Kost Simple Harian',
    location: 'Kaliwadas',
    pricePerHour: 12000,
    rating: 4.6,
    reviews: 64,
    distance: '800 m',
    tag: 'Murah & bersih',
  },
]

export default function RenterHome() {
  const navigate = useNavigate()

  return (
    <div style={styles.wrapper}>
      {/* Search */}
      <div style={styles.searchCard}>
        <div style={styles.searchTopRow}>
          <div style={styles.searchTitle}>Cari kost per jam</div>
          <div style={styles.chip}>Live</div>
        </div>
        <div style={styles.searchBox}>
          <Search size={18} color="#64748B" />
          <input
            style={styles.searchInput}
            placeholder="Cari nama kost atau lokasi"
          />
        </div>
        <div style={styles.searchMeta}>
          <span style={styles.metaItem}>
            <Clock size={14} />
            Bayar per jam
          </span>
          <span style={styles.metaItem}>
            <MapPin size={14} />
            Dekat lokasi kamu
          </span>
        </div>
      </div>

      {/* Recommended list */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Rekomendasi untukmu</h2>
        <span style={styles.sectionSubtitle}>Pilih dan booking dalam hitungan detik</span>
      </div>

      <div style={styles.list}>
        {dummyKosts.map((kost) => (
          <button
            key={kost.id}
            style={styles.card}
            onClick={() => navigate(`/renter/kost/${kost.id}`)}
          >
            <div style={styles.cardLeft}>
              <div style={styles.badge}>{kost.tag}</div>
              <h3 style={styles.cardTitle}>{kost.name}</h3>
              <div style={styles.cardLocation}>
                <MapPin size={14} />
                <span>{kost.location}</span>
              </div>
              <div style={styles.cardMetaRow}>
                <span style={styles.price}>
                  Rp {kost.pricePerHour.toLocaleString('id-ID')}/jam
                </span>
                <span style={styles.distance}>{kost.distance}</span>
              </div>
              <div style={styles.ratingRow}>
                <Star size={14} color="#FBBF24" fill="#FBBF24" />
                <span style={styles.ratingText}>
                  {kost.rating} • {kost.reviews}+ ulasan
                </span>
              </div>
            </div>
            <div style={styles.cardRight}>
              <div style={styles.thumbnailSkeleton}></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  searchCard: {
    background: 'linear-gradient(145deg, #0F172A, #020617)',
    borderRadius: '1.25rem',
    padding: '1.25rem',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    boxShadow: '0 18px 60px rgba(15, 23, 42, 0.8)',
  },
  searchTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  searchTitle: {
    color: '#E5E7EB',
    fontSize: '1.1rem',
    fontWeight: 600,
  },
  chip: {
    fontSize: '0.75rem',
    padding: '0.25rem 0.65rem',
    borderRadius: '999px',
    border: '1px solid rgba(45, 212, 191, 0.7)',
    color: '#6EE7B7',
    background: 'rgba(6, 95, 70, 0.35)',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 0.75rem',
    borderRadius: '0.75rem',
    background: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid rgba(55, 65, 81, 0.9)',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: '#E5E7EB',
    fontSize: '0.9rem',
    width: '100%',
  },
  searchMeta: {
    marginTop: '0.65rem',
    display: 'flex',
    gap: '0.75rem',
    fontSize: '0.75rem',
    color: '#9CA3AF',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  sectionHeader: {
    marginTop: '0.25rem',
    marginBottom: '0.25rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    color: '#E5E7EB',
    marginBottom: '0.15rem',
  },
  sectionSubtitle: {
    fontSize: '0.75rem',
    color: '#9CA3AF',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: '0.9rem',
    borderRadius: '1rem',
    border: '1px solid rgba(31, 41, 55, 0.9)',
    background: 'rgba(15, 23, 42, 0.95)',
    cursor: 'pointer',
  },
  cardLeft: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  badge: {
    alignSelf: 'flex-start',
    padding: '0.18rem 0.55rem',
    borderRadius: '999px',
    fontSize: '0.65rem',
    color: '#A5F3FC',
    background: 'rgba(56, 189, 248, 0.15)',
  },
  cardTitle: {
    fontSize: '0.95rem',
    color: '#F9FAFB',
  },
  cardLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.75rem',
    color: '#9CA3AF',
  },
  cardMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.25rem',
  },
  price: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#6EE7B7',
  },
  distance: {
    fontSize: '0.75rem',
    color: '#9CA3AF',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    marginTop: '0.15rem',
    fontSize: '0.75rem',
    color: '#E5E7EB',
  },
  ratingText: {
    fontSize: '0.75rem',
  },
  cardRight: {
    width: '90px',
    marginLeft: '0.75rem',
  },
  thumbnailSkeleton: {
    width: '100%',
    height: '90px',
    borderRadius: '0.75rem',
    background: 'linear-gradient(135deg, #111827, #020617)',
    border: '1px solid rgba(55, 65, 81, 0.9)',
  },
}
