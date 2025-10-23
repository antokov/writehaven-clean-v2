// src/components/FeedbackModal.jsx
import { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/FeedbackModal.css';
import { useTranslation } from 'react-i18next';
import api from '../api';

export default function FeedbackModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [feedbackType, setFeedbackType] = useState('bug');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);

    try {
      await api.post('/feedback', {
        type: feedbackType,
        message: message,
        email: email
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMessage('');
        setEmail('');
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error sending feedback:', err);
      setError(t('feedback.error', 'Failed to send feedback. Please try again.'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('feedback.title')}</h2>
          <button className="btn-icon" onClick={onClose} aria-label={t('common.close')}>
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="feedback-success">
            <p>✓ {t('feedback.success')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label htmlFor="feedback-type">{t('feedback.typeLabel')}</label>
              <select
                id="feedback-type"
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="form-control"
              >
                <option value="bug">🐛 {t('feedback.types.bug')}</option>
                <option value="improvement">💡 {t('feedback.types.improvement')}</option>
                <option value="feature">✨ {t('feedback.types.feature')}</option>
                <option value="other">💬 {t('feedback.types.other')}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="feedback-email">{t('feedback.emailLabel', 'Your Email (optional)')}</label>
              <input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('feedback.emailPlaceholder', 'your.email@example.com')}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="feedback-message">{t('feedback.messageLabel')}</label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('feedback.placeholder')}
                rows={6}
                required
                className="form-control"
              />
            </div>

            {error && (
              <div className="feedback-error" style={{ color: 'red', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="btn ghost" onClick={onClose} disabled={sending}>
                {t('common.cancel')}
              </button>
              <button type="submit" className="btn primary" disabled={sending}>
                {sending ? t('feedback.sending', 'Sending...') : t('feedback.submit')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
