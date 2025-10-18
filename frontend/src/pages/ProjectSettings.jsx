import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' }
];

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
  { key: "general",   labelKey: "projectSettings.general" },
  { key: "metadata",  labelKey: "projectSettings.metadata" },
  { key: "community", labelKey: "projectSettings.community" },
];

const SettingsEditor = React.memo(function SettingsEditor({
  settings,
  onChangeSetting,
  lastSavedAt,
  activeTab,
  setActiveTab
}) {
  const { t } = useTranslation();

  return (
    <div className="panel">
      <nav className="tabs tabs-inline">
        {TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            className={`tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {t(tab.labelKey)}
          </button>
        ))}
        <div className="tabs-meta">
          {lastSavedAt ? <>{t('common.saved', { time: lastSavedAt.toLocaleTimeString() })}</> : "—"}
        </div>
      </nav>

      {activeTab === "general" && (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="small muted">{t('projectSettings.bookTitle')}</label>
              <input
                className="input"
                value={getPath(settings, "title", "")}
                onChange={e => onChangeSetting("title", e.target.value)}
                placeholder={t('projectSettings.bookTitlePlaceholder')}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="small muted">{t('projectSettings.author')}</label>
              <input
                className="input"
                value={getPath(settings, "author", "")}
                onChange={e => onChangeSetting("author", e.target.value)}
                placeholder={t('projectSettings.authorPlaceholder')}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="small muted">{t('projectSettings.description')}</label>
              <textarea
                className="textarea"
                value={getPath(settings, "description", "")}
                onChange={e => onChangeSetting("description", e.target.value)}
                placeholder={t('projectSettings.descriptionPlaceholder')}
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
              <label className="small muted">{t('projectSettings.bookLanguage')}</label>
              <select
                className="input"
                value={getPath(settings, "language", "de")}
                onChange={e => onChangeSetting("language", e.target.value)}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="small muted">{t('projectSettings.genre')}</label>
              <select
                className="input"
                value={getPath(settings, "genre", "")}
                onChange={e => onChangeSetting("genre", e.target.value)}
              >
                <option value="">{t('projectSettings.selectGenre')}</option>
                <option value="fantasy">{t('genres.fantasy')}</option>
                <option value="scifi">{t('genres.scifi')}</option>
                <option value="romance">{t('genres.romance')}</option>
                <option value="thriller">{t('genres.thriller')}</option>
                <option value="mystery">{t('genres.mystery')}</option>
                <option value="historical">{t('genres.historical')}</option>
                <option value="contemporary">{t('genres.contemporary')}</option>
                <option value="horror">{t('genres.horror')}</option>
                <option value="young_adult">{t('genres.young_adult')}</option>
                <option value="children">{t('genres.children')}</option>
                <option value="non_fiction">{t('genres.non_fiction')}</option>
                <option value="other">{t('genres.other')}</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="small muted">{t('projectSettings.targetAudience')}</label>
              <select
                className="input"
                value={getPath(settings, "target_audience", "")}
                onChange={e => onChangeSetting("target_audience", e.target.value)}
              >
                <option value="">{t('projectSettings.selectAudience')}</option>
                <option value="children">{t('audiences.children')}</option>
                <option value="young_adult">{t('audiences.young_adult')}</option>
                <option value="adult">{t('audiences.adult')}</option>
                <option value="all_ages">{t('audiences.all_ages')}</option>
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
              <span style={{ fontSize: '1rem', fontWeight: 500 }}>
                {t('projectSettings.shareWithCommunity')}
              </span>
            </label>
            <p className="small muted" style={{ marginLeft: '30px' }}>
              {t('projectSettings.communityDescription')}
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
