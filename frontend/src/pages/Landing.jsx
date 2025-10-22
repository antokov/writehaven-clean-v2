import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/landing.css'
import logoUrl from '../assets/logo.png'

const BMAC_URL = import.meta.env.VITE_BMAC_URL || 'https://buymeacoffee.com/antonkovacw' // TODO

export default function Landing() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const yearEl = document.getElementById('year')
    if (yearEl) yearEl.textContent = new Date().getFullYear()

    const hero = document.querySelector('.hero .bg')
    const parallaxSections = [...document.querySelectorAll('.parallax')]
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let ticking = false
    function onScroll() {
      if (ticking) return
      ticking = true
      setScrollY(window.scrollY)
      requestAnimationFrame(() => {
        if (!prefersReduced && hero) {
          const y = window.scrollY * 0.3
          hero.style.transform = `translate3d(0, ${y}px, 0) scale(1.15)`
        }
        if (!prefersReduced) {
          parallaxSections.forEach(sec => {
            const bg = sec.querySelector('.parallax__bg')
            if (bg) {
              const speed = parseFloat(bg.dataset.speed || '0.25')
              const rect = sec.getBoundingClientRect()
              const y = rect.top * -speed
              bg.style.transform = `translate3d(0, ${y}px, 0) scale(1.2)`
            }
          })
        }
        ticking = false
      })
    }

    function onMouseMove(e) {
      if (!prefersReduced) setMousePos({ x: e.clientX, y: e.clientY })
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('animate-in'))
    }, { threshold: 0.1 })

    document.querySelectorAll('.fade-in-section').forEach((el) => observer.observe(el))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
      observer.disconnect()
    }
  }, [])

  const parallaxStyle = {
    transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.01}px, ${(mousePos.y - window.innerHeight / 2) * 0.01}px)`
  }

  return (
    <div className="landing-page">
      {/* BG orbs */}
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="gradient-orb orb-3"></div>

      <header className={`landing-header ${scrollY > 50 ? 'scrolled' : ''}`}>
        <div className="container inner">
          <Link to="/" className="brand">
            <img src={logoUrl} alt="Writehaven Logo" className="brand-logo" />
            <span className="brand-text">Writehaven</span>
          </Link>
          <nav>
            <a href="#features" className="nav-link">Features</a>
            <a href="#preview" className="nav-link">Inspiration</a>
            <a href="#support" className="nav-link">Support</a>
            <Link to="/app" className="btn btn-primary">
              <span>Launch app</span>
              <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="home">
          <div className="bg" style={{ backgroundImage: "url('/landing/assets/hero-1.jpg')" }}></div>
          <div className="hero-gradient"></div>

          <div className="container hero-content">
            <div className="hero-text" style={parallaxStyle}>
              <div className="hero-badge fade-in-section">
                <span className="badge-dot"></span>
                <span>Pilot phase — we’re inviting testers</span>
              </div>

              <h1 className="hero-title fade-in-section">
                Help us make <span className="gradient-text">Writehaven</span> better
              </h1>

              <p className="hero-lead fade-in-section">
                Early pilot. If you’re up for testing and sharing feedback, you’re in the right place.
              </p>

              <div className="hero-cta fade-in-section">
                <Link to="/app" className="btn btn-hero">
                  <span>Join as a tester</span>
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>

                {/* PROMINENT: Buy me a coffee in the hero as well */}
                <a href={BMAC_URL} target="_blank" rel="noreferrer" className="btn btn-hero" aria-label="Buy me a coffee">
                  <span>☕ Buy me a coffee</span>
                </a>

          
              </div>

              <div className="hero-stats fade-in-section">
                <div className="stat">
                  <div className="stat-value">Status</div>
                  <div className="stat-label">Private pilot</div>
                </div>
                <div className="stat">
                  <div className="stat-value">Focus</div>
                  <div className="stat-label">Stability & feedback</div>
                </div>
                <div className="stat">
                  <div className="stat-value">Looking for</div>
                  <div className="stat-label">Authors willing to test</div>
                </div>
              </div>
            </div>
          </div>

          <div className="scroll-indicator"><div className="scroll-mouse"><div className="scroll-wheel"></div></div></div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section">
          <div className="container">
            <div className="section-header fade-in-section">
              <span className="section-badge">What is Writehaven?</span>
              <h2 className="section-title">A focused studio for long-form stories</h2>
              <p className="section-subtitle">
                Writehaven brings planning, worldbuilding, and writing together — currently in pilot with a focus on stability, ease of use, and honest feedback.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card fade-in-section" style={{ animationDelay: '0.05s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 6h16M6 10h12M8 14h8M10 18h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">At a glance</h3>
                <p className="feature-description">Workspace for novels & series — plan, build, write.</p>
                <ul className="pricing-features" style={{ marginTop: '0.75rem' }}>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>Structure chapters & scenes</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>Characters, relations, places & timelines</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>Focused editor, optional AI helper</span>
                  </li>
                </ul>
              </div>

              <div className="feature-card fade-in-section" style={{ animationDelay: '0.15s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M12 7a3 3 0 110-6 3 3 0 010 6z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Who is it for?</h3>
                <p className="feature-description">For authors building long-form stories.</p>
                <ul className="pricing-features" style={{ marginTop: '0.75rem' }}>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>Novels, series, RPG worlds</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>People who like structured workflows</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>Testers willing to give honest feedback</span>
                  </li>
                </ul>
              </div>

              <div className="feature-card fade-in-section" style={{ animationDelay: '0.25s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">What it isn’t</h3>
                <p className="feature-description">A clear scope so we stay focused.</p>
                <ul className="pricing-features" style={{ marginTop: '0.75rem' }}>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>No social network, no public publishing</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>No “one-click bestseller” promises</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>No distractions — focus on writing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="section features-section">
          <div className="container">
            <div className="section-header fade-in-section">
              <span className="section-badge">Features</span>
              <h2 className="section-title">Tools we’ll refine together</h2>
              <p className="section-subtitle">
                Everything is evolving — your feedback sets priorities.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card fade-in-section" style={{ animationDelay: '0.1s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="feature-title">Smart structure</h3>
                <p className="feature-description">Chapters & scenes — tell us what you’re missing.</p>
              </div>

              <div className="feature-card fade-in-section" style={{ animationDelay: '0.2s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="feature-title">Character development</h3>
                <p className="feature-description">Relation graph & bio — we’re testing UX & performance.</p>
              </div>

              <div className="feature-card fade-in-section" style={{ animationDelay: '0.3s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="feature-title">Worldbuilding</h3>
                <p className="feature-description">Places, cultures & timelines — feedback welcome.</p>
              </div>

              <div className="feature-card fade-in-section" style={{ animationDelay: '0.4s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="feature-title">AI assistant</h3>
                <p className="feature-description">Ideas, editing & summaries — under evaluation.</p>
              </div>

              <div className="feature-card fade-in-section" style={{ animationDelay: '0.5s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="feature-title">Focused writing</h3>
                <p className="feature-description">Distraction-free — we’ll polish it together.</p>
              </div>

              <div className="feature-card fade-in-section" style={{ animationDelay: '0.6s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="feature-title">Cloud sync</h3>
                <p className="feature-description">Backups & sync — reliability first.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PARALLAX QUOTES */}
        <section id="preview" className="parallax">
          <div className="parallax__bg" data-speed="0.25" style={{ backgroundImage: "url('/landing/assets/hero-2.jpg')" }}></div>
          <div className="parallax-overlay"></div>
          <div className="container">
            <blockquote className="quote-card fade-in-section">
              <div className="quote-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              </div>
              <p className="quote-text">“The morning smelled of iron and storm…”</p>
              <footer className="quote-author"><span className="author-name">Example from your work</span><span className="author-role">Chapter I</span></footer>
            </blockquote>
          </div>
        </section>

        <section className="parallax">
          <div className="parallax__bg" data-speed="0.3" style={{ backgroundImage: "url('/landing/assets/hero-3.jpg')" }}></div>
          <div className="parallax-overlay"></div>
          <div className="container">
            <blockquote className="quote-card fade-in-section">
              <div className="quote-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z"/></svg>
              </div>
              <p className="quote-text">“Between the lines of the archive lay names…”</p>
              <footer className="quote-author"><span className="author-name">Your story is taking shape</span><span className="author-role">Chapter VII</span></footer>
            </blockquote>
          </div>
        </section>

        {/* SUPPORT – centered single-column block */}
        <section id="support" className="section pricing-section">
          <div className="container">
            <div className="section-header fade-in-section">
              <span className="section-badge">Support</span>
              <h2 className="section-title">☕ Buy me a coffee</h2>
              <p className="section-subtitle">
                Writehaven is in pilot. Infrastructure (servers, DB, storage) isn’t cheap — if you like the
                project, you can support it with a coffee.
              </p>
            </div>

            {/* NEW: centered card */}
            <div className="support-centered fade-in-section">
              <div className="support-hero" aria-hidden="true">
                <div className="coffee-medallion coffee-lg">
                  <span className="coffee-emoji">☕</span>
                  <span className="steam s1"></span>
                  <span className="steam s2"></span>
                  <span className="steam s3"></span>
                </div>
              </div>

              <span className="thanks-pill">❤️ Thank you!</span>

              <h3 className="support-heading">Support the project</h3>
              <p className="support-copy">
                Your coffee helps with server &amp; storage costs and speeds up the pilot roadmap.
              </p>

              <ul className="benefits-grid">
                <li className="feature-item">
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Covers server &amp; database costs</span>
                </li>
                <li className="feature-item">
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Enables more testing capacity &amp; backups</span>
                </li>
                <li className="feature-item">
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Speeds up the pilot roadmap</span>
                </li>
              </ul>

              <a href={BMAC_URL} target="_blank" rel="noreferrer" className="btn btn-primary btn-hero support-cta-btn">
                Buy me a coffee now
              </a>
              <span className="support-note">You’ll be redirected to “Buy Me a Coffee”. Thanks! 💜</span>
            </div>
          </div>
        </section>


      </main>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src={logoUrl} alt="Writehaven" className="footer-logo" />
              <p className="footer-tagline">The creative writing workspace — currently in pilot.</p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-title">Product</h4>
                <ul className="footer-list">
                  <li><a href="#features">Features</a></li>
                  <li><a href="#pilot">Pilot</a></li>
                  <li><a href="#support">Support</a></li>
                  <li><Link to="/app">App</Link></li>
                  <li><a href="#">Changelog</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-title">Resources</h4>
                <ul className="footer-list">
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Tutorials (soon)</a></li>
                  <li><a href="#">Community</a></li>
                  <li><a href={BMAC_URL} target="_blank" rel="noreferrer">Support: ☕</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-title">Company</h4>
                <ul className="footer-list">
                  <li><a href="#">About</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-title">Legal</h4>
                <ul className="footer-list">
                  <li><a href="#">Imprint</a></li>
                  <li><a href="#">Privacy</a></li>
                  <li><a href="#">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="copyright">© <span id="year"></span> Writehaven. All rights reserved.</p>
            <div className="social-links">
              {/* Social icons */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
