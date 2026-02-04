import './LoadingScreen.css'

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo-large">K</div>
        <h2>KostKoin</h2>
        <p>Pas di Saku, Pas di Waktu</p>
        <div className="spinner"></div>
      </div>
    </div>
  )
}

export default LoadingScreen
