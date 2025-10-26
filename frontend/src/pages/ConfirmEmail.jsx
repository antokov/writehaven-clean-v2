import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import logoUrl from '../assets/logo.png';
import backgroundUrl from '../assets/background.png';
import '../styles/Login.css';

export default function ConfirmEmail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError(t('auth.invalidConfirmToken'));
      return;
    }

    const confirmEmail = async () => {
      try {
        const response = await axios.get(`/api/auth/confirm/${token}`);

        setStatus('success');
        setMessage(response.data.message || t('auth.emailConfirmed'));

        // Erfolg - User kann sich jetzt einloggen
      } catch (err) {
        setStatus('error');
        setError(err.response?.data?.error || t('common.error.generic'));
      }
    };

    confirmEmail();
  }, [token, t, login, navigate]);

  return (
    <div className="login-container">
      <div className="login-bg" style={{ backgroundImage: `url(${backgroundUrl})` }} />
      <div className="login-gradient" />
      <div className="login-card">
        <div className="login-header">
          <img src={logoUrl} alt="Writehaven" className="login-logo" />
          <h1>{t('auth.confirmEmail')}</h1>
        </div>

        <div className="login-form" style={{ textAlign: 'center' }}>
          {status === 'loading' && (
            <div>
              <div className="spinner" style={{ margin: '20px auto' }}></div>
              <p>{t('auth.confirmingEmail')}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="success-message">
              <h2 style={{ marginBottom: '10px' }}>✓</h2>
              <p>{message}</p>
              
            </div>
          )}

          {status === 'error' && (
            <div className="error-message">
              <h2 style={{ marginBottom: '10px' }}>✗</h2>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="login-footer" style={{ marginTop: '20px' }}>
          <Link to="/login" className="link-button">
            ← {t('auth.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}
