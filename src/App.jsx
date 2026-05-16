import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`app-container ${isLoaded ? 'loaded' : ''}`}>
      {/* Decorative background elements */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <nav className="navbar animate-fade-in">
        <div className="container nav-content">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">ER<span className="gradient-text">flow</span></span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <button className="btn btn-primary">Launch App</button>
          </div>
        </div>
      </nav>

      <main className="container">
        <section className="hero-section">
          <div className="hero-content animate-fade-in">
            <h1 className="hero-title">
              Streamline Your <br />
              <span className="gradient-text">Workflow Efficiency</span>
            </h1>
            <p className="hero-subtitle">
              Experience the next generation of entity-relationship management. 
              ERflow provides real-time insights and seamless integration for modern development teams.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary">Get Started Free</button>
              <button className="btn btn-outline">Watch Demo</button>
            </div>
          </div>

          <div className="hero-visual animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card main-visual">
              <div className="card-header">
                <div className="dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="url-bar">erflow.io/dashboard</div>
              </div>
              <div className="card-body">
                <div className="skeleton-line long"></div>
                <div className="skeleton-grid">
                  <div className="skeleton-box"></div>
                  <div className="skeleton-box"></div>
                  <div className="skeleton-box"></div>
                </div>
                <div className="skeleton-line medium"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features-grid">
          <div className="feature-card glass-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="feature-icon">🚀</div>
            <h3>Real-time Sync</h3>
            <p>Collaborate with your team instantly with our lightning-fast sync engine.</p>
          </div>
          <div className="feature-card glass-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="feature-icon">🛡️</div>
            <h3>Secure by Default</h3>
            <p>Enterprise-grade security ensuring your data remains private and protected.</p>
          </div>
          <div className="feature-card glass-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="feature-icon">📊</div>
            <h3>Deep Analytics</h3>
            <p>Gain actionable insights into your workflows with advanced data visualization.</p>
          </div>
        </section>
      </main>

      <footer className="footer animate-fade-in">
        <p>&copy; 2024 ERflow. Built for the future of development.</p>
      </footer>
    </div>
  )
}

export default App
