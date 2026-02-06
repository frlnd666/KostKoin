import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Logo */}
        <div style={styles.logo}>
          <span style={styles.logoText}>K</span>
        </div>

        {/* Spinner */}
        <div style={styles.spinner}></div>

        {/* Text */}
        <div style={styles.text}>
          Memuat KostKoin V3{dots}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#0F1419',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  logo: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(20, 184, 166, 0.4)',
    animation: 'logoFloat 2s ease-in-out infinite',
  },
  logoText: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#fff',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #1E252E',
    borderTopColor: '#14B8A6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  text: {
    color: '#94A3B8',
    fontSize: '0.875rem',
    letterSpacing: '0.05em',
    minWidth: '180px',
    textAlign: 'center',
  }
}
