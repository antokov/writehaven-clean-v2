import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BsPlus, BsTrash, BsSearch } from "react-icons/bs";

// Element-Typen gruppiert nach Kategorien
const ELEMENT_TYPES = [
  {
    category: "Orte & Geografie",
    items: [
      { key: "Welt", label: "Welt/Planet" },
      { key: "Kontinent", label: "Kontinent" },
      { key: "Region", label: "Region" },
      { key: "Land", label: "Land/Staat" },
      { key: "Provinz", label: "Provinz/Herzogtum" },
      { key: "Stadt", label: "Stadt" },
      { key: "Dorf", label: "Dorf/Siedlung" },
      { key: "Stadtviertel", label: "Stadtviertel" },
      { key: "Landmarke-Berg", label: "Landmarke: Berg" },
      { key: "Landmarke-Fluss", label: "Landmarke: Fluss" },
      { key: "Landmarke-See", label: "Landmarke: See" },
      { key: "Landmarke-Wald", label: "Landmarke: Wald" },
      { key: "Landmarke-Wüste", label: "Landmarke: Wüste" },
      { key: "Landmarke-Küste", label: "Landmarke: Küste" },
      { key: "Landmarke-Insel", label: "Landmarke: Insel" },
      { key: "Landmarke-Höhle", label: "Landmarke: Höhle" }
    ]
  },
  {
    category: "Infrastruktur",
    items: [
      { key: "Strasse", label: "Straße/Route" },
      { key: "Brücke", label: "Brücke" },
      { key: "Hafen", label: "Hafen" },
      { key: "Kanal", label: "Kanal" },
      { key: "Aquädukt", label: "Aquädukt" },
      { key: "Mine", label: "Mine" },
      { key: "Mühle", label: "Mühle" }
    ]
  },
  {
    category: "Politik & Verwaltung",
    items: [
      { key: "Reich", label: "Reich/Imperium" },
      { key: "Königreich", label: "Königreich/Republik" },
      { key: "Stadtstaat", label: "Stadtstaat" },
      { key: "Lehen", label: "Lehen/Grafschaft" },
      { key: "Bündnis", label: "Bündnis/Föderation" },
      { key: "Amt", label: "Amt/Behörde" },
      { key: "Gesetz", label: "Gesetz/Edikt" },
      { key: "Grenze", label: "Grenze/Territorium" },
      { key: "Titel", label: "Titel/Rang" }
    ]
  },
  {
    category: "Gesellschaft & Kultur",
    items: [
      { key: "Volk", label: "Volk/Ethnie" },
      { key: "Clan", label: "Clan/Stamm" },
      { key: "Sprache", label: "Sprache/Dialekt" },
      { key: "Schrift", label: "Schrift/Alphabet" },
      { key: "Religion", label: "Religion/Kult" },
      { key: "Gottheit", label: "Gottheit" },
      { key: "Tempel", label: "Tempel/Schrein" },
      { key: "Ritual", label: "Ritual/Fest" },
      { key: "Kalender", label: "Kalender/Feiertag" },
      { key: "Sitte", label: "Sitte/Tabu" },
      { key: "Mode", label: "Mode/Kleidung" },
      { key: "Küche", label: "Küche/Speise" },
      { key: "Kunst", label: "Kunst/Stil" },
      { key: "Musik", label: "Musik" },
      { key: "Legende", label: "Legende/Mythos" }
    ]
  },
  {
    category: "Wirtschaft & Alltag",
    items: [
      { key: "Ressource", label: "Ressource" },
      { key: "Handelsgut", label: "Handelsgut/Ware" },
      { key: "Währung", label: "Währung" },
      { key: "Beruf", label: "Beruf/Handwerk" },
      { key: "Zunft", label: "Zunft/Gilde" },
      { key: "Manufaktur", label: "Manufaktur/Betrieb" },
      { key: "Markt", label: "Markt/Marktplatz" },
      { key: "Handelsroute", label: "Handelsroute" },
      { key: "Bank", label: "Bank/Wechselstube" },
      { key: "Hof", label: "Hof/Farm/Gehöft" },
      { key: "Gasthaus", label: "Gasthaus/Taverne" },
      { key: "Schmiede", label: "Schmiede/Werkstatt" }
    ]
  },
  {
    category: "Militär & Macht",
    items: [
      { key: "Armee", label: "Armee/Legion" },
      { key: "Orden", label: "Orden/Bruderschaft" },
      { key: "Söldner", label: "Söldnerkompanie" },
      { key: "Festung", label: "Festung/Burg" },
      { key: "Garnison", label: "Garnison/Arsenal" },
      { key: "Waffengattung", label: "Waffengattung" },
      { key: "Taktik", label: "Taktik/Doktrin" },
      { key: "Konflikt", label: "Konflikt" },
      { key: "Vertrag", label: "Vertrag/Frieden" }
    ]
  },
  {
    category: "Wissen & Magie",
    items: [
      { key: "Magiesystem", label: "Magiesystem/Regeln" },
      { key: "Magieschule", label: "Schule/Tradition" },
      { key: "Zauber", label: "Disziplin/Zauber" },
      { key: "Magiequelle", label: "Quelle/Knoten/Leitlinien" },
      { key: "Artefakt", label: "Artefakt/Relikt" },
      { key: "Bibliothek", label: "Bibliothek/Archiv" },
      { key: "Universität", label: "Universität/Akademie" },
      { key: "Gelehrte", label: "Gelehrtengesellschaft" },
      { key: "Forschung", label: "Forschung/Entdeckung" },
      { key: "Verbotenekunst", label: "Verbotene Künste" }
    ]
  },
  {
    category: "Natur & Lebewesen",
    items: [
      { key: "Spezies", label: "Spezies/Rasse" },
      { key: "Unterart", label: "Unterart/Volk" },
      { key: "Tier", label: "Tier" },
      { key: "Pflanze", label: "Pflanze" },
      { key: "Monster", label: "Monster/Wesen" },
      { key: "Krankheit", label: "Krankheit/Seuche" },
      { key: "Wetter", label: "Wetterphänomen" },
      { key: "Naturgefahr", label: "Naturgefahr" }
    ]
  },
  {
    category: "Recht & Ordnung",
    items: [
      { key: "Rechtsordnung", label: "Rechtsordnung" },
      { key: "Gericht", label: "Gericht/Tribunal" },
      { key: "Strafe", label: "Strafe/Urteil" },
      { key: "Zoll", label: "Zoll/Maut" },
      { key: "Steuer", label: "Steuer/Abgabe" }
    ]
  },
  {
    category: "Geschichte & Zeit",
    items: [
      { key: "Epoche", label: "Epoche/Zeitalter" },
      { key: "Dynastie", label: "Dynastie" },
      { key: "Ereignis", label: "Ereignis" },
      { key: "Prophezeiung", label: "Prophezeiung" },
      { key: "Chronik", label: "Überlieferung/Chronik" }
    ]
  },
  {
    category: "Organisationen",
    items: [
      { key: "Geheimbund", label: "Geheimbund/Zirkel" },
      { key: "Kirche", label: "Kirche/Orden" },
      { key: "Händlergilde", label: "Händlergilde" },
      { key: "Agentennetz", label: "Agentennetz/Spionage" },
      { key: "Piratenbande", label: "Piratenbande" },
      { key: "Widerstand", label: "Widerstandsgruppe" },
      { key: "Adelshaus", label: "Haus/Familie/Adelshaus" }
    ]
  },
  {
    category: "Technik & Baukunst",
    items: [
      { key: "Technologie", label: "Technologie/Erfindung" },
      { key: "Werkzeug", label: "Werkzeug/Waffe" },
      { key: "Theater", label: "Bauwerk: Theater" },
      { key: "Arena", label: "Bauwerk: Arena" },
      { key: "Leuchtturm", label: "Bauwerk: Leuchtturm" },
      { key: "Kanalisation", label: "Bauwerk: Kanalisation" },
      { key: "Transport", label: "Transportmittel" }
    ]
  },
  {
    category: "Plot-Elemente",
    items: [
      { key: "Geheimnis", label: "Geheimnis/Mysterium" },
      { key: "Gerücht", label: "Gerücht" },
      { key: "Quest", label: "Quest/Plot-Hook" },
      { key: "MacGuffin", label: "MacGuffin" },
      { key: "Timer", label: "Frist/Timer" }
    ]
  }
];

/* ------------ Helpers ------------ */
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

/* ---------------- Suchbares Dropdown ---------------- */
const SearchableSelect = React.memo(function SearchableSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  // Schließen wenn außerhalb geklickt wird
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Filtern der Optionen
  const options = useMemo(() => {
    const searchLower = search.toLowerCase();
    const matches = [];
    
    for (const category of ELEMENT_TYPES) {
      const matchingItems = category.items.filter(item => 
        item.label.toLowerCase().includes(searchLower) ||
        item.key.toLowerCase().includes(searchLower)
      );
      
      if (matchingItems.length > 0) {
        matches.push({
          category: category.category,
          items: matchingItems
        });
      }
    }
    
    return matches;
  }, [search]);

  // Aktuell ausgewähltes Element finden
  const selectedLabel = useMemo(() => {
    for (const category of ELEMENT_TYPES) {
      const item = category.items.find(item => item.key === value);
      if (item) return item.label;
    }
    return "";
  }, [value]);

  return (
    <div className="searchable-select" ref={ref} style={{ position: "relative" }}>
      <div
        className="input"
        onClick={() => setIsOpen(true)}
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        {selectedLabel || "Typ wählen"}
      </div>
      
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          maxHeight: "400px",
          overflowY: "auto",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          zIndex: 10
        }}>
          <div style={{ padding: "8px", borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Suchen..."
                autoFocus
                style={{ paddingLeft: "32px" }}
              />
              <BsSearch style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8"
              }} />
            </div>
          </div>
          
          <div style={{ padding: "4px 0" }}>
            {options.map(category => (
              <div key={category.category}>
                <div style={{
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#64748b",
                  background: "#f8fafc"
                }}>
                  {category.category}
                </div>
                {category.items.map(item => (
                  <div
                    key={item.key}
                    onClick={() => { onChange(item.key); setIsOpen(false); }}
                    style={{
                      padding: "6px 12px",
                      cursor: "pointer",
                      background: item.key === value ? "#f1f5f9" : "transparent"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                    onMouseLeave={e => e.currentTarget.style.background = item.key === value ? "#f1f5f9" : "transparent"}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            ))}
            {options.length === 0 && (
              <div style={{ padding: "8px 12px", color: "#94a3b8" }}>
                Keine Ergebnisse
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

/* ---------------- Editor ---------------- */
const WorldElementEditor = React.memo(function WorldElementEditor({
  elementId,
  element,
  onChangeElement,
  lastSavedAt
}) {
  return (
    <div className="panel" key={elementId}>
      <div className="form-grid">
        <div className="form-row">
          <div className="form-field">
            <label className="small muted">Name</label>
            <input
              className="input"
              value={getPath(element, "title", "")}
              onChange={e => onChangeElement("title", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="small muted">Typ</label>
            <SearchableSelect
              value={getPath(element, "kind", "Stadt")}
              onChange={value => onChangeElement("kind", value)}
            />
          </div>
        </div>

        <div className="form-row" style={{ gridColumn: "span 12" }}>
          <div className="form-field">
            <label className="small muted">Notizen & Details</label>
            <textarea
              className="textarea"
              placeholder="Beschreibe dieses Welt-Element..."
              value={getPath(element, "summary", "")}
              onChange={e => onChangeElement("summary", e.target.value)}
              rows={12}
            />
          </div>
        </div>
      </div>

      <div style={{ textAlign: "right", padding: "8px 12px", color: "var(--muted)" }}>
        {lastSavedAt ? <>Gespeichert {lastSavedAt.toLocaleTimeString()}</> : "—"}
      </div>
    </div>
  );
});

/* ---------------- Hauptkomponente ---------------- */
export default function World() {
  const { id } = useParams();
  const pid = Number(id);

  const [list, setList] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [element, setElement] = useState({});
  const [lastSavedAt, setLastSavedAt] = useState(null);

  // Liste der Welt-Elemente laden
  useEffect(() => {
    let cancel = false;
    async function load() {
      try {
        const r = await axios.get(`/api/projects/${pid}/world`);
        if (cancel) return;
        const items = r.data || [];
        setList(items);
        if (!activeId && items.length) setActiveId(items[0].id);
      } catch (e) { console.warn(e); }
    }
    if (pid) load();
    return () => { cancel = true; };
  }, [pid]);

  // Aktives Element laden
  useEffect(() => {
    if (!activeId) { setElement({}); return; }
    let cancel = false;
    async function loadOne() {
      try {
        const r = await axios.get(`/api/world/${activeId}`);
        if (cancel) return;
        setElement(r.data || {});
      } catch (e) { console.warn(e); }
    }
    loadOne();
    return () => { cancel = true; };
  }, [activeId]);

  const onChangeElement = useCallback((path, val) => {
    setElement(prev => setPathIn(prev, path, val));
  }, []);

  // Autosave
  const saveTimer = useRef(null);
  const saveNow = useCallback(async () => {
    if (!activeId) return;
    try {
      await axios.put(`/api/world/${activeId}`, element);
      setLastSavedAt(new Date());
      setList(prev => prev.map(el => 
        el.id === activeId ? { ...el, title: element.title || "Neues Element" } : el
      ));
    } catch (e) { console.warn("save failed", e); }
  }, [activeId, element]);

  useEffect(() => {
    if (!activeId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(saveNow, 700);
    return () => clearTimeout(saveTimer.current);
  }, [activeId, element, saveNow]);

  // Aktionen
  const addElement = async () => {
    try {
      const r = await axios.post(`/api/projects/${pid}/world`, {
        title: "Neues Element",
        kind: "Ort",
        summary: ""
      });
      const el = r.data;
      setList(prev => [...prev, el]);
      setActiveId(el.id);
      setElement({ title: "Neues Element", kind: "Ort", summary: "" });
    } catch (e) {
      console.error(e);
      alert("Element konnte nicht angelegt werden.");
    }
  };

  const deleteElement = async (eid) => {
    if (!confirm("Element löschen?")) return;
    try {
      await axios.delete(`/api/world/${eid}`);
      setList(prev => prev.filter(el => el.id !== eid));
      if (activeId === eid) {
        const next = list.find(el => el.id !== eid);
        setActiveId(next?.id ?? null);
      }
    } catch (e) {
      console.error(e);
      alert("Element konnte nicht gelöscht werden.");
    }
  };

  return (
    <div className="page-wrap characters-page">
      <aside className="side">
        <div className="tree">
          <div className="tree-head">
            <span className="tree-title">Welt-Elemente</span>
            <button className="icon-btn" title="Element hinzufügen" onClick={addElement}>
              <BsPlus />
            </button>
          </div>
          <ul className="tree-list">
            {list.map(el => (
              <li key={el.id} className={`tree-scene ${activeId === el.id ? "active" : ""}`}>
                <div className="tree-row scene-row" onClick={() => setActiveId(el.id)} title={el.name}>
                  <span className="tree-dot" aria-hidden />
                  <span className="tree-name">{el.title || "Neues Element"}</span>
                  <div className="row-actions" onClick={e => e.stopPropagation()}>
                    <button className="icon-btn danger" title="Löschen" onClick={() => deleteElement(el.id)}>
                      <BsTrash />
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {!list.length && <li className="tree-empty">Noch keine Elemente</li>}
          </ul>
        </div>
      </aside>

      <main className="main">
        {!activeId ? (
          <div className="panel" style={{ padding: "1rem" }}>
            <strong>Kein Element ausgewählt.</strong><br />
            <button className="btn btn-primary-quiet" onClick={addElement} style={{ marginTop: 8 }}>
              + Element anlegen
            </button>
          </div>
        ) : (
          <WorldElementEditor
            elementId={activeId}
            element={element}
            onChangeElement={onChangeElement}
            lastSavedAt={lastSavedAt}
          />
        )}
      </main>
    </div>
  );
}
