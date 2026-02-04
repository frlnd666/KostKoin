import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import './OwnerLayout.css'

function OwnerLayout() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <BottomNav role="pemilik" />
    </div>
  )
}

export default OwnerLayout
