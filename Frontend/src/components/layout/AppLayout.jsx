import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'

export default function AppLayout() {
  const location = useLocation()
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <div key={location.pathname}>
            <Outlet />
          </div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
