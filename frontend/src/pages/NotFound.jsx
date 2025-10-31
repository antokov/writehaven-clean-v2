import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoUrl from '../assets/logo.png';
import backgroundUrl from '../assets/background.png';
import { useTranslation } from 'react-i18next';
import '../styles/NotFound.css';

export default function NotFound() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="notfound-container">
      <div className="notfound-bg" style={{ backgroundImage: `url(${backgroundUrl})` }} />
      <div className="notfound-gradient" />

      <div className="notfound-card">
        <div className="notfound-header">
          <img src={logoUrl} alt="Writehaven" className="notfound-logo" />
          <div className="notfound-error-code">404</div>
          <h1>{t('notFound.title')}</h1>
          <p>{t('notFound.message')}</p>
        </div>

        <div className="notfound-actions">
          {user ? (
            <>
              <Link to="/app" className="btn primary">
                {t('notFound.backToDashboard')}
              </Link>
              <Link to="/app" className="link-button">
                {t('notFound.goHome')}
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="btn primary">
                {t('notFound.backToHome')}
              </Link>
              <Link to="/login" className="link-button">
                {t('notFound.goToLogin')}
              </Link>
            </>
          )}
        </div>

        <div className="notfound-suggestions">
          <p className="suggestions-title">{t('notFound.suggestions')}</p>
          <ul>
            <li>{t('notFound.checkUrl')}</li>
            <li>{t('notFound.useNavigation')}</li>
            <li>{t('notFound.contactSupport')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
