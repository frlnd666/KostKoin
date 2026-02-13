import { PlusCircle, MapPin } from 'react-feather'

const dummyKosts = [
  {
    id: 'K-01',
    name: 'Kost Harmoni Syariah',
    location: 'Cikole, Serang',
    rooms: 10,
    occupied: 7,
  },
  {
    id: 'K-02',
    name: 'Kost Premium Sudirman',
    location: 'Cipare',
    rooms: 8,
    occupied: 5,
  },
]

export default function OwnerKosts() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.headerRow}>
        <h1 style={styles.title}>Kost Saya</h1>
        <button
          style={styles.addButton}
          onClick={() => alert('Form tambah kost bisa ditambahkan nanti.')}
        >
          <PlusCircle size={16} />
          <span>Tambah</span>
        </button>
      </div>

      <div style={styles.list}>
        {dummyKosts.map((k) => {
          const occupancy = Math.round((k.occupied / k.rooms) * 100)
          return (
            <div key={k.id} style={styles.card}>
              <div style={styles.kostName}>{k.name}</div>
              <div style={styles.row}>
                <MapPin size={14} />
                <span>{k.location}</span>
              </div>
              <div style={styles.row}>
                <span>{k.occupied} terisi</span>
                <span style={styles.dot}>•</span>
                <span>{k.rooms} kamar</span>
                <span style={styles.dot}>•</span>
                <span>{occupancy}% okupansi</span>
              </div>
            </div>
          )
        })}
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
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.05rem',
    color: '#E5E7EB',
  },
  addButton: {
    padding: '0.4rem 0.7rem',
    borderRadius: '999px',
    border: 'none',
    background: 'rgba(20, 184, 166, 0.16)',
    color: '#A5F3FC',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    cursor: 'pointer',
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
  kostName: {
    fontSize: '0.95rem',
    color: '#F9FAFB',
    marginBottom: '0.2rem',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.75rem',
    color: '#9CA3AF',
    marginTop: '0.1rem',
  },
  dot: {
    fontSize: '0.7rem',
  },
}
