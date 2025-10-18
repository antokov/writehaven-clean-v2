// src/components/FeedbackModal.jsx
import { useState } from 'react';
import { X } from 'lucide-react';
import './FeedbackModal.css';
import { useTranslation } from 'react-i18next';

export default function FeedbackModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [feedbackType, setFeedbackType] = useState('bug');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hier könntest du an dein Backend senden
    console.log('Feedback submitted:', { type: feedbackType, message });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      onClose();
    }, 2000);
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

            <div className="modal-actions">
              <button type="button" className="btn ghost" onClick={onClose}>
                {t('common.cancel')}
              </button>
              <button type="submit" className="btn primary">
                {t('feedback.submit')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
