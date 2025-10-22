import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import logoUrl from '../assets/logo.png';
import backgroundUrl from '../assets/background.png';
import '../styles/Login.css';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message || t('auth.resetEmailSent'));
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || t('common.error.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg" style={{ backgroundImage: `url(${backgroundUrl})` }} />
      <div className="login-gradient" />
      <div className="login-card">
        <div className="login-header">
          <img src={logoUrl} alt="Writehaven" className="login-logo" />
          <h1>{t('auth.forgotPassword')}</h1>
          <p>{sent ? t('auth.resetEmailSentDescription') : t('auth.forgotPasswordDescription')}</p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">{t('auth.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
                autoComplete="email"
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? t('common.loading') : t('auth.sendResetLink')}
            </button>
          </form>
        ) : (
          <div className="success-message" style={{ marginTop: '20px' }}>
            <p>{message}</p>
            <p style={{ marginTop: '10px', fontSize: '14px' }}>
              {t('auth.checkEmailInbox')}
            </p>
          </div>
        )}

        <div className="login-footer" style={{ marginTop: '20px' }}>
          <Link to="/login" className="link-button">
            ← {t('auth.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}
