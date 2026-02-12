import { Calendar, Clock, User } from 'react-feather'

const dummyBookings = [
  {
    id: 'ORD-001',
    kostName: 'Kost Harmoni Syariah',
    renter: 'Budi Santoso',
    date: 'Hari ini',
    timeRange: '13:00 - 17:00',
    status: 'Aktif',
  },
  {
    id: 'ORD-002',
    kostName: 'Kost Harmoni Syariah',
    renter: 'Ani Lestari',
    date: 'Hari ini',
    timeRange: '09:00 - 11:00',
    status: 'Selesai',
  },
]

export default function OwnerBookings() {
  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Booking Hari Ini</h1>
      <p style={styles.subtitle}>
        Lihat siapa saja yang sedang menggunakan kost kamu
      </p>

      <div style={styles.list}>
        {dummyBookings.map((b) => (
          <div key={b.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.kostName}>{b.kostName}</div>
              <span
                style={{
                  ...styles.status,
                  ...(b.status === 'Aktif' ? styles.statusActive : styles.statusDone),
                }}
              >
                {b.status}
              </span>
            </div>

            <div style={styles.row}>
              <User size={14} />
              <span>{b.renter}</span>
            </div>
            <div style={styles.row}>
              <Calendar size={14} />
              <span>{b.date}</span>
            </div>
            <div style={styles.row}>
              <Clock size={14} />
              <span>{b.timeRange}</span>
            </div>

            <div style={styles.rowBottom}>
              <span style={styles.orderId}>#{b.id}</span>
            </div>
          </div>
        ))}
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
    fontSize: '1.05rem',
    color: '#E5E7EB',
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#9CA3AF',
    marginBottom: '0.4rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
  },
  card: {
    background: 'rgba(15, 23, 42, 0.95)',
    borderRadius: '1rem',
    padding: '0.85rem',
    border: '1px solid rgba(45, 212, 191, 0.2)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.3rem',
  },
  kostName: {
    fontSize: '0.95rem',
    color: '#F9FAFB',
  },
  status: {
    fontSize: '0.75rem',
    padding: '0.2rem 0.55rem',
    borderRadius: '999px',
  },
  statusActive: {
    background: 'rgba(34, 197, 94, 0.12)',
    color: '#4ADE80',
    border: '1px solid rgba(74, 222, 128, 0.8)',
  },
  statusDone: {
    background: 'rgba(148, 163, 184, 0.1)',
    color: '#CBD5E1',
    border: '1px solid rgba(148, 163, 184, 0.6)',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.8rem',
    color: '#9CA3AF',
    marginTop: '0.15rem',
  },
  rowBottom: {
    marginTop: '0.4rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    color: '#6B7280',
  },
  orderId: {
    fontSize: '0.75rem',
  },
}
