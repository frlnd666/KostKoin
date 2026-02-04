import { Component } from 'react'
import { AlertTriangle } from 'react-feather'
import './ErrorBoundary.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <AlertTriangle size={64} />
          <h2>Oops! Terjadi Kesalahan</h2>
          <p>Mohon refresh halaman atau hubungi support</p>
          <button onClick={() => window.location.href = '/'}>
            Kembali ke Beranda
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
