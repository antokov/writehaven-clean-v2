import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import '../styles/scene-manifest.css';

function findMatches(sceneContent, characters, locations, charIds, locIds) {
  const text = (sceneContent || '').toLowerCase();
  if (!text) return { newCharIds: [], newLocIds: [] };

  const newCharIds = [];
  const newLocIds  = [];

  characters.forEach(c => {
    if (!c.name || charIds.includes(c.id)) return;
    const terms = [c.name, ...c.name.split(' ').filter(w => w.length >= 3)];
    if (terms.some(t => text.includes(t.toLowerCase()))) newCharIds.push(c.id);
  });

  locations.forEach(l => {
    if (!l.title || locIds.includes(l.id)) return;
    const terms = [l.title, ...l.title.split(' ').filter(w => w.length >= 3)];
    if (terms.some(t => text.includes(t.toLowerCase()))) newLocIds.push(l.id);
  });

  return { newCharIds, newLocIds };
}

export default function SceneManifestPanel({ sceneId, manifest, projectId, sceneContent, onSave }) {
  const [characters, setCharacters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showCharDrop, setShowCharDrop] = useState(false);
  const [showLocDrop, setShowLocDrop]   = useState(false);
  const [autoloadMsg, setAutoloadMsg]   = useState(null);
  const saveTimer     = useRef(null);
  const autoloadTimer = useRef(null);

  useEffect(() => {
    if (!projectId) return;
    axios.get(`/api/projects/${projectId}/characters`).then(r => setCharacters(r.data || [])).catch(() => {});
    axios.get(`/api/projects/${projectId}/world`).then(r => setLocations(r.data || [])).catch(() => {});
  }, [projectId]);

  useEffect(() => () => clearTimeout(autoloadTimer.current), []);

  const charIds = manifest?.character_ids || [];
  const locIds  = manifest?.location_ids  || [];

  const save = useCallback((newManifest) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => onSave(newManifest), 600);
  }, [onSave]);

  const addChar = (id) => {
    if (charIds.includes(id)) return;
    save({ character_ids: [...charIds, id], location_ids: locIds });
    setShowCharDrop(false);
  };
  const removeChar = (id) => save({ character_ids: charIds.filter(x => x !== id), location_ids: locIds });

  const addLoc = (id) => {
    if (locIds.includes(id)) return;
    save({ character_ids: charIds, location_ids: [...locIds, id] });
    setShowLocDrop(false);
  };
  const removeLoc = (id) => save({ character_ids: charIds, location_ids: locIds.filter(x => x !== id) });

  const handleAutoload = useCallback(() => {
    const { newCharIds, newLocIds } = findMatches(sceneContent, characters, locations, charIds, locIds);
    const total = newCharIds.length + newLocIds.length;

    clearTimeout(autoloadTimer.current);
    setAutoloadMsg(total === 0 ? '–' : `+${total}`);
    autoloadTimer.current = setTimeout(() => setAutoloadMsg(null), 3000);

    if (total === 0) return;
    save({
      character_ids: [...charIds, ...newCharIds],
      location_ids:  [...locIds,  ...newLocIds],
    });
  }, [sceneContent, characters, locations, charIds, locIds, save]);

  const taggedChars = characters.filter(c => charIds.includes(c.id));
  const taggedLocs  = locations.filter(l => locIds.includes(l.id));
  const availChars  = characters.filter(c => !charIds.includes(c.id));
  const availLocs   = locations.filter(l => !locIds.includes(l.id));

  if (!sceneId) return null;

  return (
    <div className="smp-panel">
      <div className="smp-title">
        📍 In dieser Szene
        <button
          className="smp-autoload-btn"
          onClick={handleAutoload}
          title="Namen im Szenentext suchen und automatisch verknüpfen"
        >⟳</button>
        {autoloadMsg && <span className="smp-autoload-msg">{autoloadMsg}</span>}
      </div>

      {/* Characters */}
      <div className="smp-section">
        <span className="smp-section-label">Charaktere</span>
        <div className="smp-tags">
          {taggedChars.map(c => (
            <span key={c.id} className="smp-tag">
              {c.name}
              <button className="smp-tag-remove" onClick={() => removeChar(c.id)}>×</button>
            </span>
          ))}
          <div className="smp-add-wrap">
            <button className="smp-add-btn" onClick={() => setShowCharDrop(v => !v)} title="Charakter hinzufügen">+</button>
            {showCharDrop && availChars.length > 0 && (
              <div className="smp-dropdown">
                {availChars.map(c => (
                  <button key={c.id} className="smp-drop-item" onClick={() => addChar(c.id)}>{c.name}</button>
                ))}
              </div>
            )}
            {showCharDrop && availChars.length === 0 && (
              <div className="smp-dropdown"><span className="smp-drop-empty">Alle hinzugefügt</span></div>
            )}
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="smp-section">
        <span className="smp-section-label">Orte</span>
        <div className="smp-tags">
          {taggedLocs.map(l => (
            <span key={l.id} className="smp-tag smp-tag--loc">
              {l.icon || '📍'} {l.title}
              <button className="smp-tag-remove" onClick={() => removeLoc(l.id)}>×</button>
            </span>
          ))}
          <div className="smp-add-wrap">
            <button className="smp-add-btn" onClick={() => setShowLocDrop(v => !v)} title="Ort hinzufügen">+</button>
            {showLocDrop && availLocs.length > 0 && (
              <div className="smp-dropdown">
                {availLocs.map(l => (
                  <button key={l.id} className="smp-drop-item" onClick={() => addLoc(l.id)}>
                    {l.icon || '📍'} {l.title}
                  </button>
                ))}
              </div>
            )}
            {showLocDrop && availLocs.length === 0 && (
              <div className="smp-dropdown"><span className="smp-drop-empty">Alle hinzugefügt</span></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
