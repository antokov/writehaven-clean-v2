import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, Keyboard } from 'swiper/modules'
import LanguageSwitcher from '../components/LanguageSwitcher'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../styles/landing.css'
import logoUrl from '../assets/logo.png'

const BMAC_URL = import.meta.env.VITE_BMAC_URL || 'https://buymeacoffee.com/writehaven'

export default function Landing() {
  const { t } = useTranslation('landing')
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isPaused, setIsPaused] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState({ src: '', alt: '' })
  const swiperRef = useRef(null)

  const openLightbox = (src, alt) => {
    setLightboxImage({ src, alt })
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }

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

  const features = [
    {
      id: 'writing',
      screenshot: '/landing/assets/screenshot1.jpeg',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'characters',
      screenshot: '/landing/assets/screenshot2.jpeg',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'world',
      screenshot: '/landing/assets/screenshot3.jpeg',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'map',
      screenshot: '/landing/assets/screenshot4.jpeg',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'export',
      screenshot: '/landing/assets/screenshot5.jpeg',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ]

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
            <a href="#features" className="nav-link">{t('nav.features')}</a>
            <a href="#preview" className="nav-link">{t('nav.inspiration')}</a>
            <a href="#support" className="nav-link">{t('nav.support')}</a>
            <LanguageSwitcher />
            <Link to="/app" className="btn btn-primary">
              <span>{t('nav.launchApp')}</span>
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
                <span>{t('hero.badge')}</span>
              </div>

              <h1 className="hero-title fade-in-section">
                {t('hero.title')}<span className="gradient-text">{t('hero.titleHighlight')}</span>
              </h1>

              <p className="hero-lead fade-in-section">
                {t('hero.lead')}
                <a href="#features" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>
                  {t('hero.leadLinkFeatures')}
                </a>
                {t('hero.leadAnd')}
                <a href="#about" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>
                  {t('hero.leadLinkAbout')}
                </a>
                {t('hero.leadEnd')}
              </p>

              <div className="hero-cta fade-in-section">
                <Link to="/app" className="btn btn-hero">
                  <span>{t('hero.ctaJoin')}</span>
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>

                <a href={BMAC_URL} target="_blank" rel="noreferrer" className="btn btn-hero" aria-label="Buy me a coffee">
                  <span>{t('hero.ctaCoffee')}</span>
                </a>
              </div>

              <div className="hero-stats fade-in-section">
                <div className="stat">
                  <div className="stat-value">{t('hero.statsStatus')}</div>
                  <div className="stat-label">{t('hero.statsStatusValue')}</div>
                </div>
                <div className="stat">
                  <div className="stat-value">{t('hero.statsFocus')}</div>
                  <div className="stat-label">{t('hero.statsFocusValue')}</div>
                </div>
                <div className="stat">
                  <div className="stat-value">{t('hero.statsLooking')}</div>
                  <div className="stat-label">{t('hero.statsLookingValue')}</div>
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
              <span className="section-badge">{t('about.badge')}</span>
              <h2 className="section-title">{t('about.title')}</h2>
              <p className="section-subtitle">
                {t('about.subtitle')}
                <a href="#features" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>
                  {t('about.subtitleLink')}
                </a>
                {t('about.subtitleMiddle')}
                <a href="#support" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>
                  {t('about.subtitleLinkSupport')}
                </a>
                {t('about.subtitleEnd')}
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card fade-in-section" style={{ animationDelay: '0.05s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 6h16M6 10h12M8 14h8M10 18h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">{t('about.glanceTitle')}</h3>
                <p className="feature-description">
                  {t('about.glanceDesc')}
                  <a href="#features" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>
                    {t('about.glanceDescLink')}
                  </a>.
                </p>
                <ul className="pricing-features" style={{ marginTop: '0.75rem' }}>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>{t('about.glanceItem1')}</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>{t('about.glanceItem2')}</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>{t('about.glanceItem3')}</span>
                  </li>
                </ul>
              </div>

              <div className="feature-card fade-in-section" style={{ animationDelay: '0.15s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M12 7a3 3 0 110-6 3 3 0 010 6z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">{t('about.whoTitle')}</h3>
                <p className="feature-description">{t('about.whoDesc')}</p>
                <ul className="pricing-features" style={{ marginTop: '0.75rem' }}>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>{t('about.whoItem1')}</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>{t('about.whoItem2')}</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>{t('about.whoItem3')}</span>
                  </li>
                </ul>
              </div>

              <div className="feature-card fade-in-section" style={{ animationDelay: '0.25s' }}>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">{t('about.notTitle')}</h3>
                <p className="feature-description">{t('about.notDesc')}</p>
                <ul className="pricing-features" style={{ marginTop: '0.75rem' }}>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>{t('about.notItem1')}</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>{t('about.notItem2')}</span>
                  </li>
                  <li className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>{t('about.notItem3')}</span>
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
              <span className="section-badge">{t('features.badge')}</span>
              <h2 className="section-title">{t('features.title')}</h2>
              <p className="section-subtitle">{t('features.subtitle')}</p>
            </div>

            <div className="features-carousel-container fade-in-section">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination, Autoplay, Keyboard]}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={1.4}
                spaceBetween={30}
                breakpoints={{
                  640: {
                    slidesPerView: 1.5,
                    spaceBetween: 40,
                  },
                  1024: {
                    slidesPerView: 1.6,
                    spaceBetween: 50,
                  },
                  1280: {
                    slidesPerView: 1.8,
                    spaceBetween: 60,
                  },
                }}
                navigation={true}
                pagination={{
                  clickable: true,
                  dynamicBullets: true
                }}
                keyboard={{ enabled: true }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={true}
                speed={600}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className="features-swiper"
              >
                {features.map((feature) => (
                  <SwiperSlide key={feature.id}>
                    <div className="feature-slide">
                      <div className="feature-slide-content">
                        {/* Screenshot */}
                        <div
                          className="feature-slide-screenshot"
                          onClick={() => openLightbox(feature.screenshot, t(`features.${feature.id}.title`))}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && openLightbox(feature.screenshot, t(`features.${feature.id}.title`))}
                        >
                          <div className="screenshot-mockup-carousel">
                            <div className="mockup-header">
                              <div className="mockup-buttons">
                                <span className="mockup-button red"></span>
                                <span className="mockup-button yellow"></span>
                                <span className="mockup-button green"></span>
                              </div>
                              <div className="mockup-title">WriteHaven</div>
                            </div>
                            <div className="mockup-content">
                              <img
                                src={feature.screenshot}
                                alt={t(`features.${feature.id}.title`)}
                                className="screenshot-image"
                              />
                              <div className="screenshot-zoom-hint">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>{t('features.zoomHint')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="feature-slide-info">
                          <div className="feature-slide-icon">
                            {feature.icon}
                          </div>
                          <h3 className="feature-slide-title">{t(`features.${feature.id}.title`)}</h3>
                          <p className="feature-slide-description">{t(`features.${feature.id}.description`)}</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Progress indicator */}
              <div className={`carousel-status ${isPaused ? 'paused' : ''}`}>
                <span className="status-dot"></span>
                <span className="status-text">{isPaused ? t('features.pausedStatus') : t('features.autoplayStatus')}</span>
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
              <p className="quote-text">{t('quotes.quote1')}</p>
              <footer className="quote-author">
                <span className="author-name">{t('quotes.quote1Author')}</span>
                <span className="author-role">{t('quotes.quote1Role')}</span>
              </footer>
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
              <p className="quote-text">{t('quotes.quote2')}</p>
              <footer className="quote-author">
                <span className="author-name">{t('quotes.quote2Author')}</span>
                <span className="author-role">{t('quotes.quote2Role')}</span>
              </footer>
            </blockquote>
          </div>
        </section>

        {/* SUPPORT */}
        <section id="support" className="section pricing-section">
          <div className="container">
            <div className="section-header fade-in-section">
              <span className="section-badge">{t('support.badge')}</span>
              <h2 className="section-title">{t('support.title')}</h2>
              <p className="section-subtitle">{t('support.subtitle')}</p>
            </div>

            <div className="support-centered fade-in-section">
              <div className="support-hero" aria-hidden="true">
                <div className="coffee-medallion coffee-lg">
                  <span className="coffee-emoji">☕</span>
                  <span className="steam s1"></span>
                  <span className="steam s2"></span>
                  <span className="steam s3"></span>
                </div>
              </div>

              <span className="thanks-pill">{t('support.thanks')}</span>

              <h3 className="support-heading">{t('support.heading')}</h3>
              <p className="support-copy">
                {t('support.copy')}
                <a href="#features" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>
                  {t('support.copyLinkFeatures')}
                </a>
                {t('support.copyAnd')}
                <Link to="/app" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>
                  {t('support.copyLinkStart')}
                </Link>.
              </p>

              <ul className="benefits-grid">
                <li className="feature-item">
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('support.benefit1')}</span>
                </li>
                <li className="feature-item">
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('support.benefit2')}</span>
                </li>
                <li className="feature-item">
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('support.benefit3')}</span>
                </li>
              </ul>

              <a href={BMAC_URL} target="_blank" rel="noreferrer" className="btn btn-primary btn-hero support-cta-btn">
                {t('support.ctaButton')}
              </a>
              <span className="support-note">{t('support.note')}</span>
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
                {t('footer.tagline')}
                <a href="#about" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>
                  {t('footer.taglineLink')}
                </a>
                {t('footer.taglineMiddle')}
                <a href="#features" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>
                  {t('footer.taglineLinkFeatures')}
                </a>.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-title">{t('footer.productTitle')}</h4>
                <ul className="footer-list">
                  <li><a href="#features">{t('footer.productFeatures')}</a></li>
                  <li><a href="#pilot">{t('footer.productPilot')}</a></li>
                  <li><a href="#support">{t('footer.productSupport')}</a></li>
                  <li><Link to="/app">{t('footer.productApp')}</Link></li>
                  <li><a href="#">{t('footer.productChangelog')}</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-title">{t('footer.resourcesTitle')}</h4>
                <ul className="footer-list">
                  <li><a href="#">{t('footer.resourcesBlog')}</a></li>
                  <li><a href="#">{t('footer.resourcesTutorials')}</a></li>
                  <li><a href="#">{t('footer.resourcesCommunity')}</a></li>
                  <li><a href={BMAC_URL} target="_blank" rel="noreferrer">{t('footer.resourcesSupportCoffee')}</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-title">{t('footer.companyTitle')}</h4>
                <ul className="footer-list">
                  <li><a href="#">{t('footer.companyAbout')}</a></li>
                  <li><a href="#">{t('footer.companyCareers')}</a></li>
                  <li><a href="#">{t('footer.companyContact')}</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-title">{t('footer.legalTitle')}</h4>
                <ul className="footer-list">
                  <li><a href="#">{t('footer.legalImprint')}</a></li>
                  <li><a href="#">{t('footer.legalPrivacy')}</a></li>
                  <li><a href="#">{t('footer.legalTerms')}</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="copyright">© <span id="year"></span> {t('footer.copyright')}</p>
            <div className="social-links">
              {/* Social icons */}
            </div>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          onKeyDown={(e) => e.key === 'Escape' && closeLightbox()}
        >
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImage.src} alt={lightboxImage.alt} className="lightbox-image" />
          </div>
        </div>
      )}
    </div>
  )
}
