import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../landing.css'
import logoUrl from '../assets/logo.png'

export default function Landing() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Set current year
    const yearEl = document.getElementById('year')
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear()
    }

    // Enhanced parallax and scroll effects
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

    // Mouse movement parallax
    function onMouseMove(e) {
      if (!prefersReduced) {
        setMousePos({ x: e.clientX, y: e.clientY })
      }
    }

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1 }
    )

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

  // Calculate parallax offset based on mouse position
  const parallaxStyle = {
    transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.01}px, ${(mousePos.y - window.innerHeight / 2) * 0.01}px)`
  }

  return (
    <div className="landing-page">
      {/* Animated background gradient orbs */}
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
            <a href="#pricing" className="nav-link">Preise</a>
            <Link to="/app" className="btn btn-primary">
              <span>App starten</span>
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
                <span>Deine kreative Schreibumgebung</span>
              </div>

              <h1 className="hero-title fade-in-section">
                Erwecke deine
                <span className="gradient-text"> Geschichten</span>
                <br />zum Leben
              </h1>

              <p className="hero-lead fade-in-section">
                Die ultimative Plattform für Autoren, die epische Welten erschaffen,
                komplexe Charaktere entwickeln und packende Geschichten schreiben.
              </p>

              <div className="hero-cta fade-in-section">
                <Link to="/app" className="btn btn-hero">
                  <span>Kostenlos starten</span>
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <a href="#features" className="btn btn-secondary">
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
                  </svg>
                  <span>Mehr erfahren</span>
                </a>
              </div>

              <div className="hero-stats fade-in-section">
                <div className="stat">
                  <div className="stat-value">10k+</div>
                  <div className="stat-label">Aktive Autoren</div>
                </div>
                <div className="stat">
                  <div className="stat-value">50k+</div>
                  <div className="stat-label">Projekte</div>
                </div>
                <div className="stat">
                  <div className="stat-value">1M+</div>
                  <div className="stat-label">Geschriebene Wörter</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="scroll-indicator">
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="section features-section">
          <div className="container">
            <div className="section-header fade-in-section">
              <span className="section-badge">Features</span>
              <h2 className="section-title">Alles, was du zum Schreiben brauchst</h2>
              <p className="section-subtitle">
                Professionelle Tools, intuitive Bedienung und kreative Freiheit – alles in einer App
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card fade-in-section" style={{ animationDelay: '0.1s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Intelligente Struktur</h3>
                <p className="feature-description">
                  Organisiere dein Buch in Kapiteln und Szenen. Drag & Drop,
                  Versionen und Notizen – alles an einem Ort.
                </p>
              </div>

              <div className="feature-card fade-in-section" style={{ animationDelay: '0.2s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Charakterentwicklung</h3>
                <p className="feature-description">
                  Erstelle tiefgründige Charaktere mit Beziehungsgraphen,
                  Biografien und dynamischen Verbindungen.
                </p>
              </div>

              <div className="feature-card fade-in-section" style={{ animationDelay: '0.3s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Weltenbau</h3>
                <p className="feature-description">
                  Erschaffe lebendige Welten mit Orten, Kulturen, Zeitlinien
                  und einer interaktiven Karte deines Universums.
                </p>
              </div>

              <div className="feature-card fade-in-section" style={{ animationDelay: '0.4s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">KI-Assistent</h3>
                <p className="feature-description">
                  Lass dich von KI inspirieren: Ideenfindung, Lektorat,
                  Zusammenfassungen und kreative Vorschläge auf Knopfdruck.
                </p>
              </div>

              <div className="feature-card fade-in-section" style={{ animationDelay: '0.5s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Fokussiertes Schreiben</h3>
                <p className="feature-description">
                  Ablenkungsfreier Editor mit schöner Typografie,
                  Fokusmodus und mächtigen Tastaturkürzeln.
                </p>
              </div>

              <div className="feature-card fade-in-section" style={{ animationDelay: '0.6s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Cloud Sync</h3>
                <p className="feature-description">
                  Synchronisiere deine Projekte über alle Geräte.
                  Automatische Backups und offline-fähig.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PARALLAX QUOTE 1 */}
        <section id="preview" className="parallax">
          <div className="parallax__bg" data-speed="0.25" style={{ backgroundImage: "url('/landing/assets/hero-2.jpg')" }}></div>
          <div className="parallax-overlay"></div>
          <div className="container">
            <blockquote className="quote-card fade-in-section">
              <div className="quote-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>
              <p className="quote-text">
                „Der Morgen roch nach Eisen und Sturm; als die Glocken schwiegen,
                wusste die Stadt, dass etwas Altes erwacht war."
              </p>
              <footer className="quote-author">
                <span className="author-name">Beispiel aus deinem Werk</span>
                <span className="author-role">Kapitel I</span>
              </footer>
            </blockquote>
          </div>
        </section>

        {/* PARALLAX QUOTE 2 */}
        <section className="parallax">
          <div className="parallax__bg" data-speed="0.3" style={{ backgroundImage: "url('/landing/assets/hero-3.jpg')" }}></div>
          <div className="parallax-overlay"></div>
          <div className="container">
            <blockquote className="quote-card fade-in-section">
              <div className="quote-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>
              <p className="quote-text">
                „Zwischen den Zeilen des Archivs lagen Namen, die keiner mehr
                laut aussprechen wollte."
              </p>
              <footer className="quote-author">
                <span className="author-name">Deine Geschichte nimmt Form an</span>
                <span className="author-role">Kapitel VII</span>
              </footer>
            </blockquote>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="section pricing-section">
          <div className="container">
            <div className="section-header fade-in-section">
              <span className="section-badge">Preise</span>
              <h2 className="section-title">Wähle deinen Plan</h2>
              <p className="section-subtitle">
                Starte kostenlos und upgrade wenn du mehr brauchst
              </p>
            </div>

            <div className="pricing-grid">
              <div className="pricing-card fade-in-section" style={{ animationDelay: '0.1s' }}>
                <div className="pricing-header">
                  <h3 className="pricing-title">Free</h3>
                  <p className="pricing-description">Perfekt zum Ausprobieren</p>
                </div>
                <div className="pricing-price">
                  <span className="price-amount">0€</span>
                  <span className="price-period">/Monat</span>
                </div>
                <ul className="pricing-features">
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>1 Projekt</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Basis Editor</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>10 Charaktere</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Cloud Sync</span>
                  </li>
                </ul>
                <Link to="/app" className="btn btn-outline">
                  <span>Jetzt starten</span>
                </Link>
              </div>

              <div className="pricing-card pricing-featured fade-in-section" style={{ animationDelay: '0.2s' }}>
                <div className="featured-badge">Beliebt</div>
                <div className="pricing-header">
                  <h3 className="pricing-title">Pro</h3>
                  <p className="pricing-description">Für ernsthafte Autoren</p>
                </div>
                <div className="pricing-price">
                  <span className="price-amount">9.99€</span>
                  <span className="price-period">/Monat</span>
                </div>
                <ul className="pricing-features">
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Unbegrenzte Projekte</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Pro Editor + KI Assistent</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Unbegrenzte Charaktere</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Weltenbau Tools</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Export in alle Formate</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Prioritäts Support</span>
                  </li>
                </ul>
                <Link to="/app" className="btn btn-primary">
                  <span>Jetzt upgraden</span>
                </Link>
              </div>

              <div className="pricing-card fade-in-section" style={{ animationDelay: '0.3s' }}>
                <div className="pricing-header">
                  <h3 className="pricing-title">Team</h3>
                  <p className="pricing-description">Für Schreibgruppen</p>
                </div>
                <div className="pricing-price">
                  <span className="price-amount">24.99€</span>
                  <span className="price-period">/Monat</span>
                </div>
                <ul className="pricing-features">
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Alles aus Pro</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Bis zu 5 Team-Mitglieder</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Kollaboratives Schreiben</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Kommentare & Reviews</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Admin Dashboard</span>
                  </li>
                </ul>
                <Link to="/app" className="btn btn-outline">
                  <span>Kontakt aufnehmen</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-card fade-in-section">
              <div className="cta-content">
                <h2 className="cta-title">Bereit, dein Meisterwerk zu erschaffen?</h2>
                <p className="cta-description">
                  Schließe dich tausenden Autoren an, die bereits ihre Geschichten mit Writehaven zum Leben erwecken.
                  Starte noch heute kostenlos – keine Kreditkarte erforderlich.
                </p>
                <div className="cta-buttons">
                  <Link to="/app" className="btn btn-large">
                    <span>Kostenlos loslegen</span>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                  <a href="#features" className="btn btn-ghost">
                    <span>Features ansehen</span>
                  </a>
                </div>
              </div>
              <div className="cta-visual">
                <div className="floating-element element-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="floating-element element-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="floating-element element-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src={logoUrl} alt="Writehaven" className="footer-logo" />
              <p className="footer-tagline">
                Die kreative Schreibumgebung für moderne Autoren
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-title">Produkt</h4>
                <ul className="footer-list">
                  <li><a href="#features">Features</a></li>
                  <li><a href="#pricing">Preise</a></li>
                  <li><Link to="/app">App</Link></li>
                  <li><a href="#">Changelog</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-title">Ressourcen</h4>
                <ul className="footer-list">
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Tutorials</a></li>
                  <li><a href="#">Community</a></li>
                  <li><a href="#">Support</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-title">Unternehmen</h4>
                <ul className="footer-list">
                  <li><a href="#">Über uns</a></li>
                  <li><a href="#">Karriere</a></li>
                  <li><a href="#">Kontakt</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-title">Legal</h4>
                <ul className="footer-list">
                  <li><a href="#">Impressum</a></li>
                  <li><a href="#">Datenschutz</a></li>
                  <li><a href="#">AGB</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="copyright">
              &copy; <span id="year"></span> Writehaven. Alle Rechte vorbehalten.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Discord">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
