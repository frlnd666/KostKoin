import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.icon}>⚠️</div>
            <h1 style={styles.title}>Oops! Terjadi Kesalahan</h1>
            <p style={styles.message}>
              Aplikasi mengalami error. Silakan refresh halaman.
            </p>
            <button 
              style={styles.button}
              onClick={() => window.location.reload()}
            >
              Refresh Halaman
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#0F1419',
    padding: '2rem',
  },
  content: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  icon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  title: {
    color: '#F8FAFC',
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
  },
  message: {
    color: '#94A3B8',
    marginBottom: '2rem',
  },
  button: {
    background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  }
}
