import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import logoUrl from '../assets/logo.png';
import backgroundUrl from '../assets/background.png';
import '../styles/Login.css';

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(t('auth.invalidResetToken'));
    }
  }, [token, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordsDontMatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/reset-password', {
        token,
        password
      });

      // Erfolg - zurück zum Login
      alert(response.data.message || t('auth.passwordResetSuccess'));
      navigate('/login');
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
          <h1>{t('auth.resetPassword')}</h1>
          <p>{t('auth.resetPasswordDescription')}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">{t('auth.newPassword')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
            />
            <small>{t('auth.passwordHint')}</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="btn primary" disabled={loading || !token}>
            {loading ? t('common.loading') : t('auth.resetPasswordButton')}
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: '20px' }}>
          <Link to="/login" className="link-button">
            ← {t('auth.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}
