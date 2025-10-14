import { useState } from 'react'
import { X } from 'lucide-react'
import './FeedbackModal.css'

export default function FeedbackModal({ isOpen, onClose }) {
  const [feedbackType, setFeedbackType] = useState('bug')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()

    // Hier könnte man das Feedback an ein Backend senden
    console.log('Feedback submitted:', { type: feedbackType, message })

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setMessage('')
      onClose()
    }, 2000)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content feedback-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Feedback geben</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Schließen">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="feedback-success">
            <p>✓ Vielen Dank für dein Feedback!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label htmlFor="feedback-type">Art des Feedbacks</label>
              <select
                id="feedback-type"
                value={feedbackType}
                onChange={e => setFeedbackType(e.target.value)}
                className="form-control"
              >
                <option value="bug">🐛 Bug melden</option>
                <option value="improvement">💡 Verbesserungsvorschlag</option>
                <option value="feature">✨ Feature-Wunsch</option>
                <option value="other">💬 Sonstiges</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="feedback-message">Deine Nachricht</label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Beschreibe dein Anliegen..."
                rows={6}
                required
                className="form-control"
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn ghost" onClick={onClose}>
                Abbrechen
              </button>
              <button type="submit" className="btn primary">
                Feedback senden
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
