import { Routes, Route, Outlet, NavLink, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Kiosk from './pages/Kiosk.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Analytics from './pages/Analytics.jsx'

function Layout() {
  return (
    <div className="app-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <nav className="navbar">
        <div className="container nav-content">
          <Link to="/" className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">ER<span className="gradient-text">Flow</span></span>
          </Link>
          <div className="nav-links">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/analytics">Analytics</NavLink>
            <Link to="/kiosk" className="btn btn-primary">Kiosk Mode</Link>
          </div>
        </div>
      </nav>

      <Outlet />

      <footer className="footer">
        <p>ERFlow &mdash; emergency response flow management for public services.</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
      {/* Kiosk runs full-screen with no app chrome */}
      <Route path="kiosk" element={<Kiosk />} />
    </Routes>
  )
}

export default App
