import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import './RenterLayout.css'

function RenterLayout() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <BottomNav role="penyewa" />
    </div>
  )
}

export default RenterLayout
