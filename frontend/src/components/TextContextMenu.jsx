import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BsPerson, BsGlobe } from 'react-icons/bs';
import './TextContextMenu.css';

/**
 * Context Menu für Text-Selection
 * Erscheint beim Rechtsklick auf markierten Text
 *
 * @param {object} position - { x, y } position auf dem Screen
 * @param {string} selectedText - Der markierte Text
 * @param {function} onCreateCharacter - Callback zum Erstellen eines Charakters
 * @param {function} onCreateWorldElement - Callback zum Erstellen eines Weltelements
 * @param {function} onClose - Callback zum Schließen
 */
export default function TextContextMenu({
  position,
  selectedText,
  onCreateCharacter,
  onCreateWorldElement,
  onClose
}) {
  useEffect(() => {
    const handleClickOutside = () => onClose();
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    // Kleine Verzögerung, damit der initiale Rechtsklick nicht sofort schließt
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('contextmenu', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 100);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('contextmenu', handleClickOutside);
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
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
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
        >
          <BsPerson className="context-menu-icon" />
          <span>Neuer Charakter</span>
        </button>
        <button
          className="context-menu-item"
          onClick={() => handleItemClick(onCreateWorldElement)}
        >
          <BsGlobe className="context-menu-icon" />
          <span>Neues Weltelement</span>
        </button>
      </div>
    </div>,
    document.body
  );
}
