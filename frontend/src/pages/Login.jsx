import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import logoUrl from '../assets/logo.png';
import backgroundUrl from '../assets/background.png';
import { useTranslation } from 'react-i18next';
import '../styles/Login.css';

export default function Login() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Check for session expiration message
  useEffect(() => {
    if (searchParams.get('session') === 'expired') {
      setError(t('auth.sessionExpired', 'Your session has expired. Please log in again.'));
    }
  }, [searchParams, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(endpoint, formData);

      // Bei Registrierung: Prüfe ob Email-Bestätigung erforderlich ist
      if (!isLogin && !response.data.token) {
        // No token = Email confirmation required
        setError('');
        setSuccess(response.data.message || 'Registration successful! Please confirm your email address.');
        setIsLogin(true); // Switch to login mode
        setFormData({ email: '', password: '', name: '' });
        return;
      }

      // Token und User über AuthContext speichern
      login(response.data.token, response.data.user);

      // Zur App navigieren
      navigate('/app');
    } catch (err) {
      setError(err.response?.data?.error || t('common.error.generic'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ email: '', password: '', name: '' });
  };

  return (
    <div className="login-container">
      <div className="login-bg" style={{ backgroundImage: `url(${backgroundUrl})` }} />
      <div className="login-gradient" />
      <div className="login-card">
        <div className="login-header">
          <img src={logoUrl} alt="Writehaven" className="login-logo" />
          <h1>{isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}</h1>
          <p>{isLogin ? t('auth.loginPrompt') : t('auth.registerPrompt')}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">{t('auth.name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('auth.namePlaceholder')}
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('auth.emailPlaceholder')}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
            {!isLogin && (
              <small>{t('auth.passwordHint')}</small>
            )}
            {isLogin && (
              <div style={{ marginTop: '8px', textAlign: 'right' }}>
                <Link to="/forgot-password" className="link-button" style={{ fontSize: '14px' }}>
                  {t('auth.forgotPassword')}
                </Link>
              </div>
            )}
          </div>

          {success && (


            <div className="success-message">


              {success}


            </div>


          )}



          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? t('common.loading') : t(isLogin ? 'auth.login' : 'auth.register')}
          </button>
        </form>

        <div className="login-footer">
          <button onClick={toggleMode} className="link-button">
            {isLogin ? (
              <>
                {t('auth.dontHaveAccount')} <strong>{t('auth.register')}</strong>
              </>
            ) : (
              <>
                {t('auth.alreadyHaveAccount')} <strong>{t('auth.login')}</strong>
              </>
            )}
          </button>
        </div>

        <div className="login-back">
          <Link to="/" className="link-button">
            ← {t('common.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
