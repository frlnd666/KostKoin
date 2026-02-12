import { Calendar, Clock, MapPin } from 'react-feather'

const dummyOrders = [
  {
    id: 'ORD-001',
    kostName: 'Kost Harmoni Syariah',
    date: 'Hari ini',
    timeRange: '13:00 - 17:00',
    status: 'Aktif',
    location: 'Cikole, Serang',
  },
  {
    id: 'ORD-000',
    kostName: 'Kost Premium Sudirman',
    date: 'Kemarin',
    timeRange: '09:00 - 13:00',
    status: 'Selesai',
    location: 'Cipare, Serang',
  },
]

export default function Orders() {
  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Pesanan Saya</h1>
      <p style={styles.subtitle}>
        Lihat jadwal kost per jam yang sedang dan pernah kamu gunakan
      </p>

      <div style={styles.list}>
        {dummyOrders.map((order) => (
          <div key={order.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.kostName}>{order.kostName}</div>
              <span
                style={{
                  ...styles.status,
                  ...(order.status === 'Aktif' ? styles.statusActive : styles.statusDone),
                }}
              >
                {order.status}
              </span>
            </div>

            <div style={styles.row}>
              <Calendar size={14} />
              <span>{order.date}</span>
            </div>
            <div style={styles.row}>
              <Clock size={14} />
              <span>{order.timeRange}</span>
            </div>
            <div style={styles.row}>
              <MapPin size={14} />
              <span>{order.location}</span>
            </div>

            <div style={styles.footerRow}>
              <span style={styles.orderId}>#{order.id}</span>
              <button
                style={styles.smallButton}
                onClick={() => alert('Detail order & QR code bisa ditambahkan nanti.')}
              >
                Detail
              </button>
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
    fontSize: '1.1rem',
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
    gap: '0.75rem',
  },
  card: {
    background: 'rgba(15, 23, 42, 0.95)',
    borderRadius: '1rem',
    padding: '0.85rem 0.9rem',
    border: '1px solid rgba(31, 41, 55, 0.9)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.4rem',
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
    color: '#9CA3AF',
    fontSize: '0.8rem',
    marginTop: '0.2rem',
  },
  footerRow: {
    marginTop: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: '0.75rem',
    color: '#6B7280',
  },
  smallButton: {
    padding: '0.35rem 0.8rem',
    borderRadius: '999px',
    border: '1px solid rgba(148, 163, 184, 0.7)',
    background: '#020617',
    color: '#E5E7EB',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
}
