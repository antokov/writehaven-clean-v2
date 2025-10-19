import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../styles/modal.css";

/**
 * Prompt Modal - für Eingabedialoge
 * @param {string} title - Titel des Modals
 * @param {string} message - Nachricht/Frage
 * @param {string} defaultValue - Standardwert für Input
 * @param {string} placeholder - Placeholder für Input
 * @param {string} confirmText - Text für Bestätigungs-Button (default: "OK")
 * @param {string} cancelText - Text für Abbrechen-Button (default: "Abbrechen")
 * @param {function} onConfirm - Callback mit eingegebenem Wert
 * @param {function} onCancel - Callback wenn abgebrochen
 */
export default function PromptModal({
  title = "Eingabe",
  message,
  defaultValue = "",
  placeholder = "",
  confirmText = "OK",
  cancelText = "Abbrechen",
  onConfirm,
  onCancel
}) {
  const [value, setValue] = useState(defaultValue);
  const backdropRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Fokus auf Input setzen
    inputRef.current?.focus();
    inputRef.current?.select();

    const handleEscape = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onCancel();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onConfirm(value.trim());
    }
  };

  return createPortal(
    <div className="modal-backdrop" ref={backdropRef} onClick={handleBackdropClick}>
      <div className="modal-dialog modal-dialog-sm">
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
          </div>
          <div className="modal-body">
            {message && <p className="modal-message">{message}</p>}
            <input
              ref={inputRef}
              type="text"
              className="modal-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              {cancelText}
            </button>
            <button type="submit" className="btn btn-primary" disabled={!value.trim()}>
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
