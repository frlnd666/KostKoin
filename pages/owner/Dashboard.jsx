import { useAuthStore } from '../../store'
import { BarChart2, Users, Calendar, Clock } from 'react-feather'

export default function OwnerDashboard() {
  const { profile } = useAuthStore()

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>
        Halo, {profile?.full_name?.split(' ')[0] || 'Pemilik'} 👋
      </h1>
      <p style={styles.subtitle}>
        Pantau performa kost per jam kamu hari ini
      </p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Booking Hari Ini</div>
          <div style={styles.cardValue}>8</div>
          <div style={styles.cardMeta}>
            <Clock size={14} />
            <span>2 sedang berlangsung</span>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Pendapatan Hari Ini</div>
          <div style={styles.cardValue}>Rp 420.000</div>
          <div style={styles.cardMeta}>
            <BarChart2 size={14} />
            <span>Naik 12% dari kemarin</span>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Total Kost Aktif</div>
          <div style={styles.cardValue}>3</div>
          <div style={styles.cardMeta}>
            <Users size={14} />
            <span>24 kamar tersedia</span>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Booking Bulan Ini</div>
          <div style={styles.cardValue}>126</div>
          <div style={styles.cardMeta}>
            <Calendar size={14} />
            <span>Rata-rata 4.8 rating</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  title: {
    fontSize: '1.1rem',
    color: '#E5E7EB',
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#9CA3AF',
    marginBottom: '0.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  card: {
    background: 'rgba(15, 23, 42, 0.96)',
    borderRadius: '1rem',
    padding: '0.75rem',
    border: '1px solid rgba(45, 212, 191, 0.25)',
  },
  cardLabel: {
    fontSize: '0.75rem',
    color: '#9CA3AF',
    marginBottom: '0.25rem',
  },
  cardValue: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#E5E7EB',
    marginBottom: '0.3rem',
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.75rem',
    color: '#A5F3FC',
  },
}
