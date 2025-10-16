import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import "../modal.css";
import "./CreateProjectModal.css";

/**
 * Create Project Modal - mit optionalem Word-Upload
 * @param {function} onConfirm - Callback mit { title, file? }
 * @param {function} onCancel - Callback wenn abgebrochen
 */
export default function CreateProjectModal({ onConfirm, onCancel }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const backdropRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fokus auf Input setzen
    inputRef.current?.focus();

    const handleEscape = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onCancel();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const ext = selectedFile.name.toLowerCase();
      if (ext.endsWith(".docx") || ext.endsWith(".doc")) {
        setFile(selectedFile);
        // Auto-fill title wenn leer
        if (!title.trim()) {
          const nameWithoutExt = selectedFile.name.replace(/\.(docx?|txt)$/i, "");
          setTitle(nameWithoutExt);
        }
      } else {
        alert(t("dashboard.createModal.invalidFileType"));
        e.target.value = "";
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setUploading(true);
    try {
      await onConfirm({ title: title.trim(), file });
    } finally {
      setUploading(false);
    }
  };

  return createPortal(
    <div className="modal-backdrop" ref={backdropRef} onClick={handleBackdropClick}>
      <div className="modal-dialog modal-dialog-md">
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h3 className="modal-title">{t("dashboard.createModal.title")}</h3>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="project-title">
                {t("dashboard.createModal.projectNameLabel")} <span aria-hidden="true">*</span>
              </label>
              <input
                id="project-title"
                ref={inputRef}
                type="text"
                className="modal-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("dashboard.createModal.projectNamePlaceholder")}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="project-file">{t("dashboard.createModal.wordUploadLabel")}</label>
              <p className="form-hint">
                {t("dashboard.createModal.wordUploadHint")}
              </p>

              {!file ? (
                <div className="file-upload-area">
                  <input
                    id="project-file"
                    ref={fileInputRef}
                    type="file"
                    accept=".doc,.docx"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <label htmlFor="project-file" className="file-upload-label">
                    <svg className="upload-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="upload-text">{t("dashboard.createModal.chooseWord")}</span>
                    <span className="upload-subtext">{t("dashboard.createModal.extHint")}</span>
                  </label>
                </div>
              ) : (
                <div className="file-selected">
                  <div className="file-info">
                    <svg className="file-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                    <div className="file-details">
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">
                        {t("dashboard.createModal.fileSizeKB", { size: (file.size / 1024).toFixed(1) })}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={handleRemoveFile}
                    aria-label={t("dashboard.createModal.removeFile")}
                    title={t("dashboard.createModal.removeFile")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={uploading}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={!title.trim() || uploading}>
              {uploading ? t("dashboard.createModal.creating") : t("dashboard.createModal.create")}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
