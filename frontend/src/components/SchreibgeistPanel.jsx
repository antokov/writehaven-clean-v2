import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import '../styles/schreibgeist.css';

const WELCOME = 'Hallo! Ich bin Schreibgeist. Wähle Charaktere, Orte oder die aktuelle Szene als Kontext und stell mir Fragen zu deinem Buch!';

function formatTime(date) {
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}
function aiMsg(text) {
  return { id: Date.now() + Math.random(), role: 'ai', text, time: new Date() };
}

/* ---- Context Panel ---- */
function ContextPanel({ projectId, currentScene, selectedCharIds, selectedLocIds, sceneSelected, onToggleChar, onToggleLoc, onAllChars, onAllLocs, onToggleScene }) {
  const [characters, setCharacters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const [chRes, wRes] = await Promise.all([
        axios.get(`/api/projects/${projectId}/characters`),
        axios.get(`/api/projects/${projectId}/world`),
      ]);
      setCharacters(chRes.data || []);
      setLocations(wRes.data || []);
    } catch (e) { console.warn(e); }
    finally { setLoading(false); }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const q = search.toLowerCase();
  const filteredChars = characters.filter(c => (c.name || '').toLowerCase().includes(q));
  const filteredLocs  = locations.filter(l => (l.title || '').toLowerCase().includes(q));

  const allCharsSel = characters.length > 0 && characters.every(c => selectedCharIds.has(c.id));
  const allLocsSel  = locations.length > 0  && locations.every(l => selectedLocIds.has(l.id));

  if (loading) return <div className="sg-ctx-panel"><div className="sg-ctx-empty">Lade…</div></div>;

  const selCharsCount = filteredChars.filter(c => selectedCharIds.has(c.id)).length;
  const selLocsCount  = filteredLocs.filter(l => selectedLocIds.has(l.id)).length;

  return (
    <div className="sg-ctx-panel">
      {/* Aktuelle Szene */}
      <div className="sg-list-section">
        <div className="sg-list-header">
          <span className="sg-list-label">Aktuelle Szene</span>
        </div>
        {currentScene ? (
          <button
            className={`sg-list-item ${sceneSelected ? 'sg-list-item--on' : ''}`}
            onClick={() => onToggleScene(!sceneSelected)}
          >
            <span className="sg-list-check">{sceneSelected ? '✓' : ''}</span>
            <span className="sg-list-name">{currentScene.title || '(ohne Titel)'}</span>
          </button>
        ) : (
          <div className="sg-ctx-empty sg-ctx-empty--disabled">Keine Szene geöffnet</div>
        )}
      </div>

      {/* Search */}
      <div className="sg-search-wrap">
        <input
          className="sg-search"
          placeholder="Suchen…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button className="sg-search-clear" onClick={() => setSearch('')}>✕</button>}
      </div>

      {/* Characters */}
      <div className="sg-list-section">
        <div className="sg-list-header">
          <span className="sg-list-label">
            Charaktere
            {selCharsCount > 0 && <span className="sg-list-count">{selCharsCount}/{filteredChars.length}</span>}
          </span>
          {characters.length > 0 && (
            <button className="sg-list-all-btn" onClick={() => onAllChars(!allCharsSel, characters)}>
              {allCharsSel ? 'Keine' : 'Alle'}
            </button>
          )}
        </div>
        {filteredChars.length === 0
          ? <div className="sg-ctx-empty">{search ? 'Keine Ergebnisse' : 'Keine Charaktere'}</div>
          : <div className="sg-list-scroll">
              {filteredChars.map(c => {
                const on = selectedCharIds.has(c.id);
                return (
                  <button key={c.id}
                    className={`sg-list-item ${on ? 'sg-list-item--on' : ''}`}
                    onClick={() => onToggleChar(c.id, !on)}>
                    <span className="sg-list-check">{on ? '✓' : ''}</span>
                    <span className="sg-list-name">{c.name || '(ohne Name)'}</span>
                  </button>
                );
              })}
            </div>
        }
      </div>

      {/* Locations */}
      <div className="sg-list-section">
        <div className="sg-list-header">
          <span className="sg-list-label">
            Orte
            {selLocsCount > 0 && <span className="sg-list-count">{selLocsCount}/{filteredLocs.length}</span>}
          </span>
          {locations.length > 0 && (
            <button className="sg-list-all-btn" onClick={() => onAllLocs(!allLocsSel, locations)}>
              {allLocsSel ? 'Keine' : 'Alle'}
            </button>
          )}
        </div>
        {filteredLocs.length === 0
          ? <div className="sg-ctx-empty">{search ? 'Keine Ergebnisse' : 'Keine Orte'}</div>
          : <div className="sg-list-scroll">
              {filteredLocs.map(l => {
                const on = selectedLocIds.has(l.id);
                return (
                  <button key={l.id}
                    className={`sg-list-item sg-list-item--loc ${on ? 'sg-list-item--on' : ''}`}
                    onClick={() => onToggleLoc(l.id, !on)}>
                    <span className="sg-list-check">{on ? '✓' : ''}</span>
                    <span className="sg-list-name">{l.icon || '📍'} {l.title}</span>
                  </button>
                );
              })}
            </div>
        }
      </div>

      <button className="sg-ctx-refresh" onClick={load}>↺ Aktualisieren</button>
    </div>
  );
}

/* ---- Main Panel ---- */
export default function SchreibgeistPanel({ projectId, currentScene, onApplyToScene }) {
  const [messages, setMessages] = useState([aiMsg(WELCOME)]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [ctxOpen, setCtxOpen] = useState(false);
  const [selectedCharIds, setSelectedCharIds] = useState(new Set());
  const [selectedLocIds,  setSelectedLocIds]  = useState(new Set());
  const [sceneSelected,   setSceneSelected]   = useState(false);
  const [model,           setModel]           = useState('sonnet');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  // Reset scene selection when the active scene changes
  useEffect(() => { setSceneSelected(false); }, [currentScene?.id]);

  const toggleChar = (id, v) => setSelectedCharIds(p => { const n = new Set(p); v ? n.add(id) : n.delete(id); return n; });
  const toggleLoc  = (id, v) => setSelectedLocIds(p  => { const n = new Set(p); v ? n.add(id) : n.delete(id); return n; });
  const allChars   = (v, chars) => setSelectedCharIds(v ? new Set(chars.map(c => c.id)) : new Set());
  const allLocs    = (v, locs)  => setSelectedLocIds(v  ? new Set(locs.map(l => l.id))  : new Set());

  const totalSelected = selectedCharIds.size + selectedLocIds.size + (sceneSelected ? 1 : 0);

  const send = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = { id: Date.now(), role: 'user', text, time: new Date() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsTyping(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const payload = {
        messages: updated.filter(m => m.role === 'user' || m.role === 'ai')
          .map(m => ({ role: m.role, content: m.text })),
        entity_context: {
          character_ids: [...selectedCharIds],
          location_ids:  [...selectedLocIds],
          scene_id: sceneSelected && currentScene ? currentScene.id : null,
        },
        model,
      };

      const r = await axios.post(`/api/projects/${projectId}/schreibgeist`, payload);
      if (r.data?.error) {
        setMessages(p => [...p, aiMsg(
          r.data.error === 'api_key_missing'
            ? 'ANTHROPIC_API_KEY fehlt in backend/.env.'
            : `Fehler: ${r.data.error}`
        )]);
      } else {
        const sceneContent = r.data?.scene_content || null;
        setMessages(p => [...p, { ...aiMsg(r.data.message || '(Keine Antwort)'), sceneContent }]);
      }
    } catch (e) {
      setMessages(p => [...p, aiMsg(
        e.response?.data?.error === 'api_key_missing'
          ? 'ANTHROPIC_API_KEY fehlt in backend/.env.'
          : 'Schreibgeist ist gerade nicht erreichbar. Bitte versuche es erneut.'
      )]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
  };

  return (
    <div className="sg-panel">
      <div className="sg-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`sg-msg sg-msg--${msg.role}`}>
            <div className="sg-avatar">{msg.role === 'ai' ? '✨' : 'Du'}</div>
            <div>
              {msg.role === 'ai'
                ? <div className="sg-bubble sg-bubble--md"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                : <div className="sg-bubble">{msg.text}</div>
              }
              {msg.role === 'ai' && msg.sceneContent && currentScene && onApplyToScene && (
                <button
                  className="sg-apply-btn"
                  onClick={() => {
                    if (window.confirm(`Szene "${currentScene.title || '(ohne Titel)'}" ersetzen?`)) {
                      onApplyToScene(msg.sceneContent);
                    }
                  }}
                >
                  ↓ In Szene übertragen
                </button>
              )}
              <div className="sg-time">{formatTime(msg.time)}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="sg-typing-row">
            <div className="sg-avatar" style={{width:28,height:28,borderRadius:'50%',background:'var(--brand,#22c55e)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'white',flexShrink:0}}>✨</div>
            <div className="sg-typing-dots"><span/><span/><span/></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Context toggle */}
      <div className="sg-ctx-wrap">
        <button className="sg-ctx-toggle" onClick={() => setCtxOpen(o => !o)}>
          <span>Kontext</span>
          {totalSelected > 0 && <span className="sg-ctx-badge">{totalSelected} ausgewählt</span>}
          <span className="sg-ctx-chevron">{ctxOpen ? '▲' : '▼'}</span>
        </button>
        {ctxOpen && (
          <ContextPanel
            projectId={projectId}
            currentScene={currentScene}
            selectedCharIds={selectedCharIds}
            selectedLocIds={selectedLocIds}
            sceneSelected={sceneSelected}
            onToggleChar={toggleChar}
            onToggleLoc={toggleLoc}
            onAllChars={allChars}
            onAllLocs={allLocs}
            onToggleScene={setSceneSelected}
          />
        )}
      </div>

      <div className="sg-model-row">
        <button className={`sg-model-btn${model === 'haiku'  ? ' sg-model-btn--active' : ''}`} onClick={() => setModel('haiku')}>Haiku</button>
        <button className={`sg-model-btn${model === 'sonnet' ? ' sg-model-btn--active' : ''}`} onClick={() => setModel('sonnet')}>Sonnet</button>
      </div>

      <div className="sg-input-area">
        <textarea ref={textareaRef} className="sg-textarea"
          placeholder="Frag mich etwas zu deinem Buch… (Enter = Senden)"
          value={input} onChange={handleInput} onKeyDown={handleKeyDown}
          rows={1} disabled={isTyping} />
        <button className="sg-send-btn" onClick={send}
          disabled={!input.trim() || isTyping} title="Senden">&#9658;</button>
      </div>
    </div>
  );
}
