import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import "../modal.css";

/**
 * Confirm Modal – generic confirmation dialog
 *
 * Props:
 * - title: string (defaults to "Confirm")
 * - message: string
 * - confirmText: string (defaults to "OK")
 * - cancelText: string (defaults to i18n common.cancel)
 * - variant: "danger" | "primary" (default: "danger")
 * - onConfirm: () => void
 * - onCancel: () => void
 */
export default function ConfirmModal({
  title = "Confirm",
  message,
  confirmText,
  cancelText,
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  const backdropRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onCancel?.();
  };

  const cancelLabel = cancelText ?? t("common.cancel");
  const confirmLabel = confirmText ?? "OK";

  return createPortal(
    <div className="modal-backdrop" ref={backdropRef} onClick={handleBackdropClick}>
      <div
        className="modal-dialog modal-dialog-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <div className="modal-header">
          <h3 id="confirm-title" className="modal-title">
            {title}
          </h3>
        </div>
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={`btn ${variant === "danger" ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
