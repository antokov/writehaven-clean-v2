import { useState, useEffect } from 'react';
import { BsPlus, BsX } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import '../styles/DynamicFieldsTab.css';

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
  const { t } = useTranslation();

  const [activeFields, setActiveFields] = useState(new Set());
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Aktualisiere activeFields wenn sich das Profil ändert
  useEffect(() => {
    const newActiveFields = new Set();
    fieldConfig.optional.forEach(field => {
      // Prüfe ohne default value, ob das Feld im Profil existiert
      const value = getPath(profile, field.path, undefined);
      // Ein Feld ist aktiv, wenn es explizit gesetzt wurde (auch wenn leer)
      if (value !== undefined) {
        newActiveFields.add(field.key);
      }
    });
    setActiveFields(newActiveFields);
  }, [profile, fieldConfig, getPath]);

  const addField = (fieldKey) => {
    const field = fieldConfig.optional.find(f => f.key === fieldKey);
    if (field) {
      // Setze einen leeren String, damit das Feld als "definiert" gilt
      onChangeProfilePath(field.path, '');
      setActiveFields(prev => new Set([...prev, fieldKey]));
    }
    setShowAddMenu(false);
  };

  const removeField = (fieldKey, fieldPath) => {
    // Entferne Feld aus active list
    setActiveFields(prev => {
      const next = new Set(prev);
      next.delete(fieldKey);
      return next;
    });
    // Lösche den Wert vollständig (setze auf undefined)
    onChangeProfilePath(fieldPath, undefined);
  };

  const renderField = (field, canRemove = false) => {
    const Icon = field.icon;
    const value = getPath(profile, field.path, '');

    // << HIER kommen deine zwei Zeilen hin >>
    const labelText = field.labelKey ? t(field.labelKey) : field.label;
    const placeholderText = field.placeholderKey ? t(field.placeholderKey) : (field.placeholder || '');

    return (
      <div key={field.key} className="dynamic-field">
        <label className="dynamic-field-label">
          <Icon className="field-icon" />
          <span>{labelText}</span>
        </label>
        <div className="dynamic-field-input-wrapper">
          {field.type === 'textarea' ? (
            <textarea
              className="input textarea"
              value={value}
              onChange={e => onChangeProfilePath(field.path, e.target.value)}
              placeholder={placeholderText}
              rows={field.rows || 3}
            />
          ) : (
            <input
              className="input"
              type="text"
              value={value}
              onChange={e => onChangeProfilePath(field.path, e.target.value)}
              placeholder={placeholderText}
            />
          )}
          {canRemove && (
            <button
              type="button"
              className="remove-field-btn"
              onClick={() => removeField(field.key, field.path)}
              title={t('characters.attributes.removeField', 'Feld entfernen')}
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
            <span>{t('characters.attributes.add', 'Merkmal hinzufügen')}</span>
          </button>

          {showAddMenu && (
            <div className="add-field-menu">
              <div className="add-field-menu-header">
                <span>{t('characters.attributes.select', 'Merkmal auswählen')}</span>
                <button className="close-menu-btn" onClick={() => setShowAddMenu(false)}>
                  <BsX />
                </button>
              </div>
              <div className="add-field-menu-list">
                {availableFields.map(field => {
                  const Icon = field.icon;
                  const labelText = field.labelKey ? t(field.labelKey) : field.label;
                  return (
                    <button
                      key={field.key}
                      type="button"
                      className="add-field-menu-item"
                      onClick={() => addField(field.key)}
                    >
                      <Icon className="menu-item-icon" />
                      <span>{labelText}</span>
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
