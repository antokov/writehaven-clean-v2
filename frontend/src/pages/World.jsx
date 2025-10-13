import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BsPlus, BsTrash, BsSearch } from "react-icons/bs";
import { TbNetwork, TbTopologyStar3 } from "react-icons/tb";
import { createPortal } from "react-dom";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MarkerType,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

// Relationship types for world elements
const REL_TYPES = [
  "ist_teil_von",
  "liegt_in",
  "grenzt_an",
  "hat_hauptstadt",
  "regiert_von",
  "vasall_von",
  "buendnis_mit",
  "im_krieg_mit",
  "tribut_an",
  "sanktioniert_durch",
  "gesetz_gilt_in",
  "erlassen_von",
  "gericht_in",
  "strafe_verhaengt_von",
  "steuer_erhoben_von",
  "waehrung_von",
  "verehrt",
  "patron_von",
  "tempel_in",
  "sprache_von",
  "schrift_verwendet_von",
  "fest_in",
  "handelt_mit",
  "liefert_an",
  "produziert",
  "verbraucht",
  "exportiert_nach",
  "verbindet_orte",
  "route_fuehrt_nach",
  "magieknoten_in",
  "artefakt_gefunden_in",
  "artefakt_im_besitz_von",
  "zauber_gehoert_zu",
  "magieschule_in_system",
  "wirkt_auf",
  "garnison_in",
  "befehligt_von",
  "belagert",
  "schlacht_bei",
  "pakt_mit",
  "bewohnt_von",
  "stammt_aus",
  "vorkommen_in",
  "fluss_muendet_in",
  "fluss_entspringt_in",
  "nachfolger_von",
  "entstanden_aus",
  "ereignis_in",
  "ausgeloest_durch",
  "beteiligt_an",
  "mitglied_von",
  "angefuehrt_von",
  "rivalisiert_mit",
  "verborgen_in",
  "erbaut_von",
  "zerstoert_durch",
  "eingesetzt_von",
  "haengt_zusammen_mit",
  "ziel_von",
  "deadline_fuer",
  "schluessel_fuer"
];

// Reciprocal mappings - symmetrische und asymmetrische Beziehungen
const RECIPROCAL = {
  "ist_teil_von": "besteht_aus",
  "besteht_aus": "ist_teil_von",
  "liegt_in": "enthaelt",
  "enthaelt": "liegt_in",
  "grenzt_an": "grenzt_an",
  "hat_hauptstadt": "hauptstadt_von",
  "hauptstadt_von": "hat_hauptstadt",
  "regiert_von": "regiert",
  "regiert": "regiert_von",
  "vasall_von": "lehnsherr_von",
  "lehnsherr_von": "vasall_von",
  "buendnis_mit": "buendnis_mit",
  "im_krieg_mit": "im_krieg_mit",
  "tribut_an": "erhaelt_tribut_von",
  "erhaelt_tribut_von": "tribut_an",
  "sanktioniert_durch": "sanktioniert",
  "sanktioniert": "sanktioniert_durch",
  "gesetz_gilt_in": "unterliegt_gesetz",
  "unterliegt_gesetz": "gesetz_gilt_in",
  "erlassen_von": "erlaesst",
  "erlaesst": "erlassen_von",
  "gericht_in": "hat_gericht",
  "hat_gericht": "gericht_in",
  "strafe_verhaengt_von": "verhaengt_strafe",
  "verhaengt_strafe": "strafe_verhaengt_von",
  "steuer_erhoben_von": "erhebt_steuer",
  "erhebt_steuer": "steuer_erhoben_von",
  "waehrung_von": "verwendet_waehrung",
  "verwendet_waehrung": "waehrung_von",
  "verehrt": "verehrt_von",
  "verehrt_von": "verehrt",
  "patron_von": "geschuetzt_von",
  "geschuetzt_von": "patron_von",
  "tempel_in": "beherbergt_tempel",
  "beherbergt_tempel": "tempel_in",
  "sprache_von": "spricht",
  "spricht": "sprache_von",
  "schrift_verwendet_von": "verwendet_schrift",
  "verwendet_schrift": "schrift_verwendet_von",
  "fest_in": "begeht_fest",
  "begeht_fest": "fest_in",
  "handelt_mit": "handelt_mit",
  "liefert_an": "erhaelt_von",
  "erhaelt_von": "liefert_an",
  "produziert": "produziert_von",
  "produziert_von": "produziert",
  "verbraucht": "verbraucht_von",
  "verbraucht_von": "verbraucht",
  "exportiert_nach": "importiert_von",
  "importiert_von": "exportiert_nach",
  "verbindet_orte": "verbindet_orte",
  "route_fuehrt_nach": "route_kommt_von",
  "route_kommt_von": "route_fuehrt_nach",
  "magieknoten_in": "hat_magieknoten",
  "hat_magieknoten": "magieknoten_in",
  "artefakt_gefunden_in": "fundort_von",
  "fundort_von": "artefakt_gefunden_in",
  "artefakt_im_besitz_von": "besitzt_artefakt",
  "besitzt_artefakt": "artefakt_im_besitz_von",
  "zauber_gehoert_zu": "umfasst_zauber",
  "umfasst_zauber": "zauber_gehoert_zu",
  "magieschule_in_system": "system_umfasst_schule",
  "system_umfasst_schule": "magieschule_in_system",
  "wirkt_auf": "beeinflusst_von",
  "beeinflusst_von": "wirkt_auf",
  "garnison_in": "beherbergt_garnison",
  "beherbergt_garnison": "garnison_in",
  "befehligt_von": "befehligt",
  "befehligt": "befehligt_von",
  "belagert": "belagert_von",
  "belagert_von": "belagert",
  "schlacht_bei": "ort_der_schlacht",
  "ort_der_schlacht": "schlacht_bei",
  "pakt_mit": "pakt_mit",
  "bewohnt_von": "bewohnt",
  "bewohnt": "bewohnt_von",
  "stammt_aus": "ursprung_von",
  "ursprung_von": "stammt_aus",
  "vorkommen_in": "hat_vorkommen",
  "hat_vorkommen": "vorkommen_in",
  "fluss_muendet_in": "muendung_von",
  "muendung_von": "fluss_muendet_in",
  "fluss_entspringt_in": "quelle_von",
  "quelle_von": "fluss_entspringt_in",
  "nachfolger_von": "vorgaenger_von",
  "vorgaenger_von": "nachfolger_von",
  "entstanden_aus": "fuehrte_zu",
  "fuehrte_zu": "entstanden_aus",
  "ereignis_in": "schauplatz_von",
  "schauplatz_von": "ereignis_in",
  "ausgeloest_durch": "loest_aus",
  "loest_aus": "ausgeloest_durch",
  "beteiligt_an": "beteiligt_an",
  "mitglied_von": "hat_mitglied",
  "hat_mitglied": "mitglied_von",
  "angefuehrt_von": "fuehrt_an",
  "fuehrt_an": "angefuehrt_von",
  "rivalisiert_mit": "rivalisiert_mit",
  "verborgen_in": "verbirgt",
  "verbirgt": "verborgen_in",
  "erbaut_von": "erbaute",
  "erbaute": "erbaut_von",
  "zerstoert_durch": "zerstoerte",
  "zerstoerte": "zerstoert_durch",
  "eingesetzt_von": "setzt_ein",
  "setzt_ein": "eingesetzt_von",
  "haengt_zusammen_mit": "haengt_zusammen_mit",
  "ziel_von": "hat_zum_ziel",
  "hat_zum_ziel": "ziel_von",
  "deadline_fuer": "hat_deadline",
  "hat_deadline": "deadline_fuer",
  "schluessel_fuer": "wird_entsperrt_durch",
  "wird_entsperrt_durch": "schluessel_fuer"
};

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

function uniqBy(arr, keyFn) {
  const seen = new Set();
  return arr.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function counterpartTypesForDelete(type) {
  const reciprocal = RECIPROCAL[type];
  if (reciprocal === type) {
    return [type];
  }
  return [reciprocal];
}

/* ---------------- Tabs ---------------- */
const TABS = [
  { key: "details", label: "Details" },
  { key: "relations", label: "Beziehungen" }
];

/* ---------------- Modal ---------------- */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  const overlay = (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2147483600
      }}
    >
      <div
        onClick={(e)=>e.stopPropagation()}
        className="panel"
        style={{
          width: "min(1100px, 92vw)",
          height: "min(80vh, 800px)",
          display: "flex", flexDirection: "column",
          overflow: "hidden", boxShadow: "0 12px 32px rgba(0,0,0,.25)",
          background: "#fff", borderRadius: 12
        }}
      >
        <div style={{display:"flex", alignItems:"center", padding:"10px 12px", borderBottom:"1px solid #e7ecf2"}}>
          <div style={{fontWeight:600}}>{title}</div>
          <button className="icon-btn" style={{marginLeft:"auto"}} onClick={onClose}>✕</button>
        </div>
        <div style={{flex:1, minHeight:0}}>{children}</div>
      </div>
    </div>
  );
  return createPortal(overlay, document.body);
}

/* ---------------- Beziehungen UI ---------------- */
function RelationEditor({ currentId, allElements, onAdd }) {
  const [targetId, setTargetId] = useState("");
  const [type, setType] = useState(REL_TYPES[0]);
  const [note, setNote] = useState("");
  const options = (allElements || []).filter(el => el.id !== currentId);

  return (
    <div style={{display:"grid", gridTemplateColumns:"1.5fr 1.2fr 1fr auto", gap:8}}>
      <select className="input" value={targetId} onChange={e=>setTargetId(Number(e.target.value))}>
        <option value="">– Ziel-Element –</option>
        {options.map(el => <option key={el.id} value={el.id}>{el.title || "Unbenannt"}</option>)}
      </select>
      <select className="input" value={type} onChange={e=>setType(e.target.value)}>
        {REL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <input className="input" placeholder="Notiz (optional)" value={note} onChange={e=>setNote(e.target.value)} />
      <button className="btn" onClick={()=> targetId && onAdd({ target_id: targetId, type, note })}>Hinzufügen</button>
    </div>
  );
}

function RelationList({ element, allElements, onRemove }) {
  const links = getPath(element, "relations.connections", []) || [];
  const validLinks = links.filter(r => allElements.find(el => el.id === r.target_id));

  if (!validLinks.length) return <div className="small muted">Keine Verbindungen</div>;
  const nameOf = (id) => (allElements.find(el=>el.id===id)?.title) || `#${id}`;
  return (
    <ul style={{listStyle:"none", padding:0, margin:0, display:"grid", gap:8}}>
      {validLinks.map((r, idx) => (
        <li key={idx} className="panel" style={{padding:"8px 10px"}}>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            <div style={{flex: "0 0 auto"}}>{r.type}</div>
            <div style={{flex: "1 1 auto", color:"var(--muted, #64748b)"}}>{nameOf(r.target_id)}</div>
            {r.note ? <div className="small muted" style={{flex:"2 1 auto"}}>{r.note}</div> : null}
            <button className="btn btn-danger-quiet" onClick={()=>onRemove(r)}>Entfernen</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------- Graph Modal (Ego-Netz) mit ReactFlow ------------- */
function RelationsGraphModal({ open, onClose, activeId, allElements, onJumpToElement }) {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !activeId) return;

    async function loadRelations() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/world/${activeId}`);
        const elementData = response.data || {};

        let rels = getPath(elementData, "relations.connections", []) || [];

        const validRels = rels.filter(r => allElements.find(el => el.id === r.target_id));

        const nameOf = (id) => allElements.find(el => el.id === id)?.title || `#${id}`;
        const nodes = [];
        const edges = [];

        // Center node (ego)
        nodes.push({
          id: String(activeId),
          type: "default",
          data: { label: nameOf(activeId) },
          position: { x: 0, y: 0 },
          style: {
            background: "#22c55e",
            color: "#ffffff",
            border: "2px solid #15803d",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          },
        });

        const radius = 300;
        const angleStep = (2 * Math.PI) / Math.max(validRels.length, 1);

        validRels.forEach((r, i) => {
          const angle = i * angleStep;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          // Add connected node
          nodes.push({
            id: String(r.target_id),
            type: "default",
            data: { label: nameOf(r.target_id) },
            position: { x, y },
            style: {
              background: "#94a3b8",
              color: "#ffffff",
              border: "1px solid #64748b",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              cursor: "pointer",
            },
          });

          const isSym = (RECIPROCAL[r.type] || r.type) === r.type;
          const label = r.note ? `${r.type} (${r.note})` : r.type;

          // Add edge
          edges.push({
            id: `e-${activeId}-${r.target_id}`,
            source: String(activeId),
            target: String(r.target_id),
            label,
            type: "smoothstep",
            animated: false,
            style: { stroke: "#64748b", strokeWidth: 2 },
            labelStyle: { fill: "#0f172a", fontWeight: 500, fontSize: 11 },
            labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#64748b",
            },
            markerStart: isSym ? {
              type: MarkerType.ArrowClosed,
              color: "#64748b",
            } : undefined,
          });
        });

        setGraphData({ nodes, edges });
      } catch (error) {
        console.error("Fehler beim Laden der Beziehungen:", error);
        setGraphData({ nodes: [], edges: [] });
      } finally {
        setLoading(false);
      }
    }

    loadRelations();
  }, [open, activeId, allElements]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (graphData) {
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
    }
  }, [graphData, setNodes, setEdges]);

  const onNodeClick = useCallback((_event, node) => {
    const id = Number(node.id);
    if (id) {
      onJumpToElement(id);
      onClose();
    }
  }, [onJumpToElement, onClose]);

  if (!open) return null;

  if (loading) {
    return (
      <Modal open={open} onClose={onClose} title="Beziehungs-Graph">
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#64748b",
          background: "#f8fafc"
        }}>
          Lade Beziehungen...
        </div>
      </Modal>
    );
  }

  const hasRelations = edges.length > 0;

  return (
    <Modal open={open} onClose={onClose} title="Beziehungs-Graph">
      <div style={{ width: "100%", height: "100%", background: "#f8fafc" }}>
        {hasRelations ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.3}
            maxZoom={2}
          >
            <Background color="#cbd5e1" gap={16} />
            <Controls showInteractive={false} />
            <Panel position="top-left">
              <div style={{
                background: "white",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                fontSize: 13,
                color: "#64748b"
              }}>
                Klicke auf ein Element um zu dessen Profil zu springen
              </div>
            </Panel>
          </ReactFlow>
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 12,
            color: "#64748b"
          }}>
            <div style={{ fontSize: 48 }}>🔗</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>Keine Beziehungen vorhanden</div>
            <div style={{ fontSize: 14, textAlign: "center", maxWidth: 400 }}>
              Füge Beziehungen im Tab "Beziehungen" hinzu, um sie hier zu visualisieren.
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ------------- Weltweite Beziehungs-Übersicht ------------- */
function WorldGraphModal({ open, onClose, elements, activeId, onJumpToElement }) {
  const [relationData, setRelationData] = useState(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    async function build() {
      try {
        const profiles = await Promise.all(
          (elements || []).map(el => axios.get(`/api/world/${el.id}`).then(r => ({
            id: el.id,
            title: el.title || r.data?.title || `#${el.id}`,
            data: r.data || {}
          })))
        );

        const relMap = new Map();
        for (const p of profiles) {
          const rels = getPath(p.data, "relations.connections", []) || [];
          const validRels = rels
            .filter(r => profiles.find(pr => pr.id === r.target_id))
            .map(r => ({
              targetId: r.target_id,
              targetName: profiles.find(pr => pr.id === r.target_id)?.title || `#${r.target_id}`,
              type: r.type,
              note: r.note
            }));
          relMap.set(p.id, validRels);
        }

        if (!cancelled) setRelationData({ profiles, relMap });
      } catch (e) {
        console.warn("relation data load failed", e);
        if (!cancelled) setRelationData({ profiles: [], relMap: new Map() });
      }
    }
    build();
    return () => { cancelled = true; };
  }, [open, elements]);

  if (!open) return null;

  if (!relationData) {
    return (
      <Modal open={open} onClose={onClose} title="Beziehungsübersicht – alle Elemente">
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#64748b",
          background: "#f8fafc"
        }}>
          Lade Beziehungen...
        </div>
      </Modal>
    );
  }

  const { profiles, relMap } = relationData;

  return (
    <Modal open={open} onClose={onClose} title="Beziehungsübersicht – alle Elemente">
      <div style={{
        width: "100%",
        height: "100%",
        background: "#f8fafc",
        overflowY: "auto",
        padding: "16px"
      }}>
        <div style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "grid",
          gap: 16
        }}>
          {profiles.map(p => {
            const relations = relMap.get(p.id) || [];
            const isActive = p.id === activeId;

            return (
              <div
                key={p.id}
                className="panel"
                style={{
                  padding: "16px 20px",
                  background: isActive ? "#ecfdf5" : "#ffffff",
                  border: isActive ? "2px solid #22c55e" : "1px solid #e5e7eb",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onClick={() => onJumpToElement(p.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: relations.length > 0 ? 12 : 0
                }}>
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: isActive ? "#22c55e" : "#94a3b8",
                    flexShrink: 0
                  }} />
                  <div style={{
                    fontSize: 16,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#15803d" : "#0f172a"
                  }}>
                    {p.title}
                  </div>
                  {relations.length > 0 && (
                    <div style={{
                      marginLeft: "auto",
                      fontSize: 13,
                      color: "#64748b",
                      background: "#f1f5f9",
                      padding: "2px 8px",
                      borderRadius: 12
                    }}>
                      {relations.length} {relations.length === 1 ? "Beziehung" : "Beziehungen"}
                    </div>
                  )}
                </div>

                {relations.length > 0 && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: 8,
                    paddingLeft: 22
                  }}>
                    {relations.map((rel, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "#f8fafc",
                          padding: "6px 12px",
                          borderRadius: 6,
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          border: "1px solid #e2e8f0"
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onJumpToElement(rel.targetId);
                        }}
                      >
                        <span style={{
                          color: "#0ea5e9",
                          fontWeight: 500,
                          flexShrink: 0
                        }}>
                          {rel.type}
                        </span>
                        <span style={{ color: "#64748b" }}>→</span>
                        <span style={{
                          color: "#0f172a",
                          fontWeight: 500
                        }}>
                          {rel.targetName}
                        </span>
                        {rel.note && (
                          <span style={{
                            color: "#64748b",
                            fontSize: 12,
                            marginLeft: "auto",
                            fontStyle: "italic"
                          }}>
                            ({rel.note})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {relations.length === 0 && (
                  <div style={{
                    paddingLeft: 22,
                    fontSize: 13,
                    color: "#94a3b8",
                    fontStyle: "italic"
                  }}>
                    Keine Beziehungen
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
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
  lastSavedAt,
  activeTab,
  setActiveTab,
  allElements,
  onAddRelation,
  onRemoveRelation,
  onOpenGraph
}) {
  return (
    <div className="panel" key={elementId}>
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

      {activeTab === "details" && (
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
      )}

      {activeTab === "relations" && (
        <div className="form-grid">
          <div className="form-row" style={{ gridColumn: "span 12", display:"flex", alignItems:"center" }}>
            <div className="form-field" style={{flex:1}}>
              <label className="small muted">Neue Verbindung</label>
              <RelationEditor
                currentId={elementId}
                allElements={allElements}
                onAdd={onAddRelation}
              />
            </div>
          </div>

          <div className="form-row" style={{ gridColumn: "span 12" }}>
            <div className="form-field">
              <label className="small muted">Bestehende Verbindungen</label>
              <RelationList
                element={element}
                allElements={allElements}
                onRemove={onRemoveRelation}
              />
            </div>
          </div>

          <div className="form-row" style={{ gridColumn: "span 12" }}>
            <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 8 }}>
              <button
                type="button"
                onClick={onOpenGraph}
                title="Beziehungs-Graph öffnen"
                aria-label="Beziehungs-Graph öffnen"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "9999px",
                  border: "1px solid #e5e7eb",
                  background: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(15,23,42,.10)",
                  cursor: "pointer"
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 16px rgba(15,23,42,.16)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 14px rgba(15,23,42,.10)")}
              >
                <TbNetwork size={22} color="#0f172a" />
              </button>
            </div>
          </div>
        </div>
      )}
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
  const [activeTab, setActiveTab] = useState("details");
  const [showGraph, setShowGraph] = useState(false);
  const [showWorldGraph, setShowWorldGraph] = useState(false);

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

  const onAddRelation = useCallback(async (rel) => {
    if (!activeId || !rel?.target_id) return;
    const currentLinks = getPath(element, "relations.connections", []);
    const newLinks = uniqBy(
      [...currentLinks, { target_id: rel.target_id, type: rel.type, note: rel.note || "" }],
      (r)=> `${r.target_id}|${r.type}|${r.note || ""}`
    );
    setElement(prev => setPathIn(prev, "relations.connections", newLinks));

    await axios.put(`/api/world/${activeId}`, {
      ...element,
      relations: { connections: newLinks }
    });

    try {
      const rr = await axios.get(`/api/world/${rel.target_id}`);
      const otherData = rr.data || {};
      const backType = RECIPROCAL[rel.type] || rel.type;
      const otherLinks = getPath(otherData, "relations.connections", []);
      const newOtherLinks = uniqBy(
        [...otherLinks, { target_id: activeId, type: backType, note: rel.note || "" }],
        (r)=> `${r.target_id}|${r.type}|${r.note || ""}`
      );
      await axios.put(`/api/world/${rel.target_id}`, {
        ...otherData,
        relations: { connections: newOtherLinks }
      });
    } catch(e){ console.warn(e); }
  }, [activeId, element]);

  const onRemoveRelation = useCallback(async (rel) => {
    if (!activeId || !rel?.target_id) return;
    const currentLinks = getPath(element, "relations.connections", []);
    const filtered = currentLinks.filter(
      r => !(r.target_id === rel.target_id && r.type === rel.type)
    );
    setElement(prev => setPathIn(prev, "relations.connections", filtered));

    await axios.put(`/api/world/${activeId}`, {
      ...element,
      relations: { connections: filtered }
    });

    try {
      const rr = await axios.get(`/api/world/${rel.target_id}`);
      const otherData = rr.data || {};
      const otherLinks = getPath(otherData, "relations.connections", []);
      const backTypes = counterpartTypesForDelete(rel.type);

      const filteredOther = otherLinks.filter(
        r => !(r.target_id === activeId && backTypes.includes(r.type))
      );

      await axios.put(`/api/world/${rel.target_id}`, {
        ...otherData,
        relations: { connections: filteredOther }
      });
    } catch (e) { console.warn(e); }
  }, [activeId, element]);

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
            <button
              className="icon-btn"
              title="Mindmap (alle Beziehungen)"
              onClick={() => setShowWorldGraph(true)}
            >
              <TbTopologyStar3 />
            </button>
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
          <>
            <WorldElementEditor
              elementId={activeId}
              element={element}
              onChangeElement={onChangeElement}
              lastSavedAt={lastSavedAt}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              allElements={list}
              onAddRelation={onAddRelation}
              onRemoveRelation={onRemoveRelation}
              onOpenGraph={()=>setShowGraph(true)}
            />
            <RelationsGraphModal
              open={showGraph}
              onClose={()=>setShowGraph(false)}
              activeId={activeId}
              allElements={list}
              onJumpToElement={(id) => setActiveId(id)}
            />
            <WorldGraphModal
              open={showWorldGraph}
              onClose={()=>setShowWorldGraph(false)}
              elements={list}
              activeId={activeId}
              onJumpToElement={(id) => { setActiveId(id); setShowWorldGraph(false); }}
            />
          </>
        )}
      </main>
    </div>
  );
}
