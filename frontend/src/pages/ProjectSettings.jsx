import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const LANGUAGES = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' }
]

function getPath(obj, path, fallback = "") {
  if (!obj) return fallback;
  let cur = obj;
  for (const p of path.split(".")) {
    cur = cur?.[p];
    if (cur == null) return fallback;
  }
  return cur ?? fallback;
}

function setPathIn(obj, path, val) {
  const parts = path.split(".");
  const next = { ...(obj || {}) };
  let cur = next;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    cur[k] = cur[k] ?? {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = val;
  return next;
}

const TABS = [
  { key: "general", label: "Allgemein" },
  { key: "metadata", label: "Metadaten" },
  { key: "community", label: "Community" },
];

const SettingsEditor = React.memo(function SettingsEditor({
  settings,
  onChangeSetting,
  lastSavedAt,
  activeTab,
  setActiveTab
}) {
  return (
    <div className="panel">
      <nav className="tabs tabs-inline">
        {TABS.map(t => (
          <button
            key={t.key}
            type="button"
            className={`tab ${activeTab === t.key ? "active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >{t.label}</button>
        ))}
        <div className="tabs-meta">
          {lastSavedAt ? <>Gespeichert {lastSavedAt.toLocaleTimeString()}</> : "—"}
        </div>
      </nav>

      {activeTab === "general" && (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="small muted">Titel</label>
              <input
                className="input"
                value={getPath(settings, "title", "")}
                onChange={e => onChangeSetting("title", e.target.value)}
                placeholder="Titel deines Buches"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="small muted">Autor/in</label>
              <input
                className="input"
                value={getPath(settings, "author", "")}
                onChange={e => onChangeSetting("author", e.target.value)}
                placeholder="Dein Name"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="small muted">Beschreibung / Klappentext</label>
              <textarea
                className="textarea"
                value={getPath(settings, "description", "")}
                onChange={e => onChangeSetting("description", e.target.value)}
                placeholder="Eine kurze Zusammenfassung deines Buches..."
                rows={8}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "metadata" && (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="small muted">Sprache</label>
              <select
                className="input"
                value={getPath(settings, "language", "de")}
                onChange={e => onChangeSetting("language", e.target.value)}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="small muted">Genre</label>
              <select
                className="input"
                value={getPath(settings, "genre", "")}
                onChange={e => onChangeSetting("genre", e.target.value)}
              >
                <option value="">-- Wähle ein Genre --</option>
                <option value="fantasy">Fantasy</option>
                <option value="scifi">Science Fiction</option>
                <option value="romance">Romantik</option>
                <option value="thriller">Thriller</option>
                <option value="mystery">Krimi/Mystery</option>
                <option value="historical">Historisch</option>
                <option value="contemporary">Gegenwartsliteratur</option>
                <option value="horror">Horror</option>
                <option value="young_adult">Jugendbuch</option>
                <option value="children">Kinderbuch</option>
                <option value="non_fiction">Sachbuch</option>
                <option value="other">Sonstiges</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="small muted">Zielgruppe</label>
              <select
                className="input"
                value={getPath(settings, "target_audience", "")}
                onChange={e => onChangeSetting("target_audience", e.target.value)}
              >
                <option value="">-- Wähle eine Zielgruppe --</option>
                <option value="children">Kinder (6-12)</option>
                <option value="young_adult">Jugendliche (13-17)</option>
                <option value="adult">Erwachsene (18+)</option>
                <option value="all_ages">Alle Altersgruppen</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTab === "community" && (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={getPath(settings, "share_with_community", false)}
                onChange={e => onChangeSetting("share_with_community", e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '1rem', fontWeight: 500 }}>Mit Community teilen</span>
            </label>
            <p className="small muted" style={{ marginLeft: '30px' }}>
              Wenn aktiviert, wird dein Projekt in der öffentlichen Community-Galerie angezeigt.
              Andere können dein Werk entdecken und Feedback geben.
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

export default function ProjectSettings() {
  const { id: projectId } = useParams();
  const [settings, setSettings] = useState({});
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const saveTimer = useRef(null);
  const isLoadingRef = useRef(false);

  // Lade Projekteinstellungen
  useEffect(() => {
    if (!projectId) return;
    let cancel = false;

    async function loadSettings() {
      isLoadingRef.current = true;
      try {
        const response = await axios.get(`/api/projects/${projectId}/settings`);
        if (cancel) return;
        if (response.data && typeof response.data === 'object') {
          setSettings(response.data);
        } else {
          setSettings({});
        }
      } catch (error) {
        console.error('Fehler beim Laden der Projekteinstellungen:', error);
      } finally {
        isLoadingRef.current = false;
      }
    }

    loadSettings();
    return () => { cancel = true; };
  }, [projectId]);

  const onChangeSetting = useCallback((path, value) => {
    setSettings(prev => setPathIn(prev, path, value));
  }, []);

  // Autosave
  const saveNow = useCallback(async () => {
    if (!projectId) return;
    if (isLoadingRef.current) return;

    try {
      await axios.put(`/api/projects/${projectId}/settings`, settings);
      setLastSavedAt(new Date());
    } catch (e) {
      console.warn("save failed", e);
    }
  }, [projectId, settings]);

  useEffect(() => {
    if (!projectId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(saveNow, 700);
    return () => clearTimeout(saveTimer.current);
  }, [projectId, settings, saveNow]);

  return (
    <div className="page-wrap characters-page">
      <main className="main" style={{ gridColumn: '1 / -1' }}>
        <SettingsEditor
          settings={settings}
          onChangeSetting={onChangeSetting}
          lastSavedAt={lastSavedAt}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </main>
    </div>
  );
}
