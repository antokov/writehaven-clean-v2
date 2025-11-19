// src/components/SiteHeader.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { MessageSquare, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FeedbackModal from './FeedbackModal';
import logoUrl from '../assets/logo.png';
import '../styles/UserMenu.css';
import { useTranslation } from 'react-i18next';

export default function SiteHeader() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const menuRef = useRef(null);

  const base = id ? `/app/project/${id}` : null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu]);

  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/app" aria-label={t('common.backToHome')}>
          <span className="brand-icon natural">
            <img className="brand-logo" src={logoUrl} alt="Writehaven" />
          </span>
        </Link>

        {/* Project Navigation - nur wenn in Projekt */}
        {base && (
          <nav className="header-nav">
            <NavLink end to={base} className="header-tab">{t('navigation.writing')}</NavLink>
            <NavLink to={`${base}/characters`} className="header-tab">{t('navigation.characters')}</NavLink>
            <NavLink to={`${base}/world`} className="header-tab">{t('navigation.world')}</NavLink>
            <NavLink to={`${base}/map`} className="header-tab">{t('navigation.map')}</NavLink>
            <NavLink to={`${base}/export`} className="header-tab">{t('navigation.export')}</NavLink>
            <NavLink to={`${base}/settings`} className="header-tab">{t('navigation.projectSettings')}</NavLink>
          </nav>
        )}

        <div className="header-actions">
          {/* Feedback Button */}
          <button
            className="btn ghost btn-icon-text"
            type="button"
            onClick={() => setShowFeedback(true)}
            title={t('common.giveFeedback', 'Give feedback')}
          >
            <MessageSquare size={18} />
            <span className="btn-text">{t('common.feedback', 'Feedback')}</span>
          </button>

          {/* User Menu */}
          {user && (
            <div className="user-menu-wrapper" ref={menuRef}>
              <button
                className="user-menu-trigger"
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                <div className="user-avatar">
                  <User size={16} />
                </div>
                <span className="user-name">{user.name}</span>
                <ChevronDown size={16} className={`chevron ${showUserMenu ? 'open' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <div className="user-menu-header">
                    <div className="user-info">
                      <div className="user-info-name">{user.name}</div>
                      <div className="user-info-email">{user.email}</div>
                    </div>
                  </div>

                  <div className="user-menu-divider" />

                  <button
                    className="user-menu-item"
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/app/settings');
                    }}
                  >
                    <Settings size={16} />
                    <span>{t('navigation.settings')}</span>
                  </button>

                  <div className="user-menu-divider" />

                  <button
                    className="user-menu-item logout"
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={16} />
                    <span>{t('auth.logout')}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </>
  );
}
