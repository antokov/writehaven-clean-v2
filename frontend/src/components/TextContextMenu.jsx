import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BsPerson, BsGlobe } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import '../styles/TextContextMenu.css';

/**
 * Context Menu für Text-Selection
 * @param {object} position - { x, y }
 * @param {string} selectedText
 * @param {function} onCreateCharacter
 * @param {function} onCreateWorldElement
 * @param {function} onClose
 */
export default function TextContextMenu({
  position,
  selectedText,
  onCreateCharacter,
  onCreateWorldElement,
  onClose
}) {
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Ignoriere Klicks innerhalb des Menüs
      if (e.target.closest('.text-context-menu')) {
        return;
      }
      onClose();
    };

    const handleContextMenu = (e) => {
      // Ignoriere Rechtsklicks innerhalb des Menüs
      if (e.target.closest('.text-context-menu')) {
        return;
      }
      onClose();
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    // Warte einen Frame, damit der aktuelle contextmenu-Event abgeschlossen ist
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true);
      document.addEventListener('contextmenu', handleContextMenu, true);
      document.addEventListener('keydown', handleEscape);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleItemClick = (callback) => {
    callback(selectedText);
    onClose();
  };

  return createPortal(
    <div
      className="text-context-menu"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="context-menu-header">
        <span className="selected-text-preview">"{selectedText}"</span>
      </div>
      <div className="context-menu-items">
        <button
          className="context-menu-item"
          onClick={() => handleItemClick(onCreateCharacter)}
          aria-label={t('writing.context.createCharacter')}
          title={t('writing.context.createCharacter')}
        >
          <BsPerson className="context-menu-icon" />
          <span>{t('writing.context.createCharacter')}</span>
        </button>
        <button
          className="context-menu-item"
          onClick={() => handleItemClick(onCreateWorldElement)}
          aria-label={t('writing.context.createWorldElement')}
          title={t('writing.context.createWorldElement')}
        >
          <BsGlobe className="context-menu-icon" />
          <span>{t('writing.context.createWorldElement')}</span>
        </button>
      </div>
    </div>,
    document.body
  );
}
