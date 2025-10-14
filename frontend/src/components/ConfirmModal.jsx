import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "../modal.css";

/**
 * Confirm Modal - für Bestätigungsdialoge
 * @param {string} title - Titel des Modals
 * @param {string} message - Nachricht/Frage
 * @param {string} confirmText - Text für Bestätigungs-Button (default: "OK")
 * @param {string} cancelText - Text für Abbrechen-Button (default: "Abbrechen")
 * @param {string} variant - "danger" für destruktive Aktionen, "primary" für normale
 * @param {function} onConfirm - Callback wenn bestätigt
 * @param {function} onCancel - Callback wenn abgebrochen
 */
export default function ConfirmModal({
  title = "Bestätigen",
  message,
  confirmText = "OK",
  cancelText = "Abbrechen",
  variant = "danger",
  onConfirm,
  onCancel
}) {
  const backdropRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onCancel();
  };

  return createPortal(
    <div className="modal-backdrop" ref={backdropRef} onClick={handleBackdropClick}>
      <div className="modal-dialog modal-dialog-sm">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
        </div>
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`btn ${variant === "danger" ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
