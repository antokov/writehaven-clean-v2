import React, { useState } from 'react';
import { BsPlus, BsX } from 'react-icons/bs';
import './DynamicFieldsTab.css';

/**
 * Dynamic Fields Tab Component
 * Zeigt Kern-Felder und ermöglicht das Hinzufügen/Entfernen optionaler Felder
 *
 * @param {object} fieldConfig - { core: [], optional: [] }
 * @param {object} profile - Charakter-Profil Daten
 * @param {function} onChangeProfilePath - Callback zum Ändern eines Wertes
 * @param {function} getPath - Helper zum Lesen von verschachtelten Werten
 */
export default function DynamicFieldsTab({ fieldConfig, profile, onChangeProfilePath, getPath }) {
  const [activeFields, setActiveFields] = useState(() => {
    // Initialisiere activeFields mit Feldern, die bereits Werte haben
    const initial = new Set();
    fieldConfig.optional.forEach(field => {
      const value = getPath(profile, field.path, '');
      if (value && value.toString().trim()) {
        initial.add(field.key);
      }
    });
    return initial;
  });

  const [showAddMenu, setShowAddMenu] = useState(false);

  const addField = (fieldKey) => {
    setActiveFields(prev => new Set([...prev, fieldKey]));
    setShowAddMenu(false);
  };

  const removeField = (fieldKey, fieldPath) => {
    // Entferne Feld aus active list
    setActiveFields(prev => {
      const next = new Set(prev);
      next.delete(fieldKey);
      return next;
    });
    // Lösche den Wert
    onChangeProfilePath(fieldPath, '');
  };

  const renderField = (field, canRemove = false) => {
    const Icon = field.icon;
    const value = getPath(profile, field.path, '');

    return (
      <div key={field.key} className="dynamic-field">
        <label className="dynamic-field-label">
          <Icon className="field-icon" />
          <span>{field.label}</span>
        </label>
        <div className="dynamic-field-input-wrapper">
          {field.type === 'textarea' ? (
            <textarea
              className="input textarea"
              value={value}
              onChange={e => onChangeProfilePath(field.path, e.target.value)}
              placeholder={field.placeholder || ''}
              rows={field.rows || 3}
            />
          ) : (
            <input
              className="input"
              type="text"
              value={value}
              onChange={e => onChangeProfilePath(field.path, e.target.value)}
              placeholder={field.placeholder || ''}
            />
          )}
          {canRemove && (
            <button
              type="button"
              className="remove-field-btn"
              onClick={() => removeField(field.key, field.path)}
              title="Feld entfernen"
            >
              <BsX />
            </button>
          )}
        </div>
      </div>
    );
  };

  const availableFields = fieldConfig.optional.filter(field => !activeFields.has(field.key));

  return (
    <div className="dynamic-fields-tab">
      {/* Kern-Felder (immer sichtbar) */}
      <div className="fields-grid">
        {fieldConfig.core.map(field => renderField(field, false))}
      </div>

      {/* Aktive optionale Felder */}
      {Array.from(activeFields).length > 0 && (
        <div className="fields-grid">
          {fieldConfig.optional
            .filter(field => activeFields.has(field.key))
            .map(field => renderField(field, true))}
        </div>
      )}

      {/* Add Field Button */}
      {availableFields.length > 0 && (
        <div className="add-field-section">
          <button
            type="button"
            className="add-field-btn"
            onClick={() => setShowAddMenu(!showAddMenu)}
          >
            <BsPlus className="add-icon" />
            <span>Merkmal hinzufügen</span>
          </button>

          {showAddMenu && (
            <div className="add-field-menu">
              <div className="add-field-menu-header">
                <span>Merkmal auswählen</span>
                <button className="close-menu-btn" onClick={() => setShowAddMenu(false)}>
                  <BsX />
                </button>
              </div>
              <div className="add-field-menu-list">
                {availableFields.map(field => {
                  const Icon = field.icon;
                  return (
                    <button
                      key={field.key}
                      type="button"
                      className="add-field-menu-item"
                      onClick={() => addField(field.key)}
                    >
                      <Icon className="menu-item-icon" />
                      <span>{field.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
