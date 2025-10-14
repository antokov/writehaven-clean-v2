import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import logoUrl from '../assets/logo.png'
import backgroundUrl from '../assets/background.png'
import './Login.css'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const response = await axios.post(endpoint, formData)

      // Token und User über AuthContext speichern
      login(response.data.token, response.data.user)

      // Zur App navigieren
      navigate('/app')
    } catch (err) {
      setError(err.response?.data?.error || 'Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setFormData({ email: '', password: '', name: '' })
  }

  return (
    <div className="login-container">
      <div className="login-bg" style={{ backgroundImage: `url(${backgroundUrl})` }} />
      <div className="login-gradient" />
      <div className="login-card">
        <div className="login-header">
          <img src={logoUrl} alt="Writehaven" className="login-logo" />
          <h1>{isLogin ? 'Willkommen zurück' : 'Konto erstellen'}</h1>
          <p>{isLogin ? 'Melde dich bei deinem Konto an' : 'Erstelle ein neues Konto'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dein Name"
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="deine@email.de"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            {!isLogin && (
              <small>Mindestens 6 Zeichen</small>
            )}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? 'Lädt...' : (isLogin ? 'Anmelden' : 'Registrieren')}
          </button>
        </form>

        <div className="login-footer">
          <button onClick={toggleMode} className="link-button">
            {isLogin ? (
              <>Noch kein Konto? <strong>Registrieren</strong></>
            ) : (
              <>Bereits registriert? <strong>Anmelden</strong></>
            )}
          </button>
        </div>

        <div className="login-back">
          <Link to="/" className="link-button">
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  )
}
