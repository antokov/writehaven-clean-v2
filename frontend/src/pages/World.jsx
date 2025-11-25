import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { BsPlus, BsTrash, BsSearch, BsChevronDown, BsChevronRight, BsWrench } from "react-icons/bs";
import ConfirmModal from "../components/ConfirmModal";
import NotesPanel from "../components/NotesPanel";
import TasksPanel from "../components/TasksPanel";
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
import { useTranslation } from "react-i18next";

/* -------------------------------- Relationship config --------------------------------
 * Wichtig: Wir benutzen i18n-Keys, aber behalten die 'key' Werte stabil
 * (das sind die gespeicherten Werte in deiner DB). Für Labels nutzen wir
 * t('world.relations.types.<key>', FallbackLabel).
 */
const REL_CATEGORIES = [
  {
    key: "simple",
    name: "Einfache Beziehungen",
    types: [
      { key: "hat", label: "hat" },
      { key: "ist", label: "ist" },
      { key: "will", label: "will" },
      { key: "kann", label: "kann" },
      { key: "soll", label: "soll" },
      { key: "muss", label: "muss" },
      { key: "braucht", label: "braucht" },
      { key: "kennt", label: "kennt" },
      { key: "liebt", label: "liebt" },
      { key: "hasst", label: "hasst" },
      { key: "fuerchtet", label: "fürchtet" },
      { key: "beschuetzt", label: "beschützt" }
    ]
  },
  {
    key: "geographic",
    name: "Geografisch",
    types: [
      { key: "ist_teil_von", label: "ist Teil von" },
      { key: "liegt_in", label: "liegt in" },
      { key: "grenzt_an", label: "grenzt an" },
      { key: "enthaelt", label: "enthält" },
      { key: "verbindet", label: "verbindet" },
      { key: "fuehrt_nach", label: "führt nach" }
    ]
  },
  {
    key: "political",
    name: "Politisch",
    types: [
      { key: "regiert", label: "regiert" },
      { key: "regiert_von", label: "regiert von" },
      { key: "vasall_von", label: "Vasall von" },
      { key: "buendnis_mit", label: "Bündnis mit" },
      { key: "im_krieg_mit", label: "im Krieg mit" },
      { key: "pakt_mit", label: "Pakt mit" },
      { key: "rivalisiert_mit", label: "rivalisiert mit" },
      { key: "tributpflichtig", label: "tributpflichtig" }
    ]
  },
  {
    key: "economic",
    name: "Wirtschaftlich",
    types: [
      { key: "handelt_mit", label: "handelt mit" },
      { key: "liefert_an", label: "liefert an" },
      { key: "produziert", label: "produziert" },
      { key: "verbraucht", label: "verbraucht" },
      { key: "exportiert_nach", label: "exportiert nach" },
      { key: "importiert_von", label: "importiert von" }
    ]
  },
  {
    key: "religion_culture",
    name: "Religiös & Kulturell",
    types: [
      { key: "verehrt", label: "verehrt" },
      { key: "patron_von", label: "Patron von" },
      { key: "heilig_fuer", label: "heilig für" },
      { key: "verflucht_von", label: "verflucht von" },
      { key: "spricht", label: "spricht (Sprache)" },
      { key: "feiert", label: "feiert (Fest)" }
    ]
  },
  {
    key: "military",
    name: "Militärisch",
    types: [
      { key: "verteidigt", label: "verteidigt" },
      { key: "bedroht", label: "bedroht" },
      { key: "belagert", label: "belagert" },
      { key: "garnison_in", label: "Garnison in" },
      { key: "befehligt", label: "befehligt" },
      { key: "kaempft_gegen", label: "kämpft gegen" }
    ]
  },
  {
    key: "magic",
    name: "Magisch",
    types: [
      { key: "verstarkt", label: "verstärkt" },
      { key: "schwacht", label: "schwächt" },
      { key: "neutralisiert", label: "neutralisiert" },
      { key: "wirkt_auf", label: "wirkt auf" },
      { key: "magieknoten_in", label: "Magieknoten in" },
      { key: "verbirgt", label: "verbirgt" }
    ]
  },
  {
    key: "historical",
    name: "Historisch",
    types: [
      { key: "nachfolger_von", label: "Nachfolger von" },
      { key: "entstanden_aus", label: "entstanden aus" },
      { key: "erbaut_von", label: "erbaut von" },
      { key: "zerstoert_durch", label: "zerstört durch" },
      { key: "gefunden_in", label: "gefunden in" },
      { key: "ereignete_sich_in", label: "ereignete sich in" }
    ]
  },
  {
    key: "organizational",
    name: "Organisatorisch",
    types: [
      { key: "mitglied_von", label: "Mitglied von" },
      { key: "angefuehrt_von", label: "angeführt von" },
      { key: "gegruendet_von", label: "gegründet von" },
      { key: "kontrolliert", label: "kontrolliert" },
      { key: "untersteht", label: "untersteht" }
    ]
  },
  {
    key: "other",
    name: "Sonstiges",
    types: [
      { key: "haengt_zusammen_mit", label: "hängt zusammen mit" },
      { key: "gegensatz_zu", label: "Gegensatz zu" },
      { key: "aehnlich_wie", label: "ähnlich wie" },
      { key: "ziel_von", label: "Ziel von" },
      { key: "ursache_fuer", label: "Ursache für" },
      { key: "folge_von", label: "Folge von" }
    ]
  }
];

const REL_TYPES = REL_CATEGORIES.flatMap(cat => cat.types.map(t => t.key));

/* ---------------- Reciprocal map bleibt unverändert (Keys sind DB-Werte) ---------------- */
const RECIPROCAL = {
  hat: "gehoert_zu",
  gehoert_zu: "hat",
  ist: "ist",
  will: "wird_gewollt_von",
  wird_gewollt_von: "will",
  kann: "kann",
  soll: "soll",
  muss: "muss",
  braucht: "wird_gebraucht_von",
  wird_gebraucht_von: "braucht",
  kennt: "kennt",
  liebt: "liebt",
  hasst: "hasst",
  fuerchtet: "wird_gefuerchtet_von",
  wird_gefuerchtet_von: "fuerchtet",
  beschuetzt: "wird_beschuetzt_von",
  wird_beschuetzt_von: "beschuetzt",

  ist_teil_von: "besteht_aus",
  besteht_aus: "ist_teil_von",
  liegt_in: "enthaelt",
  enthaelt: "liegt_in",
  grenzt_an: "grenzt_an",
  verbindet: "verbindet",
  fuehrt_nach: "fuehrt_von",
  fuehrt_von: "fuehrt_nach",

  regiert: "regiert_von",
  regiert_von: "regiert",
  vasall_von: "lehnsherr_von",
  lehnsherr_von: "vasall_von",
  buendnis_mit: "buendnis_mit",
  im_krieg_mit: "im_krieg_mit",
  pakt_mit: "pakt_mit",
  rivalisiert_mit: "rivalisiert_mit",
  tributpflichtig: "erhaelt_tribut_von",
  erhaelt_tribut_von: "tributpflichtig",

  handelt_mit: "handelt_mit",
  liefert_an: "erhaelt_von",
  erhaelt_von: "liefert_an",
  produziert: "produziert_von",
  produziert_von: "produziert",
  verbraucht: "verbraucht_von",
  verbraucht_von: "verbraucht",
  exportiert_nach: "importiert_von",
  importiert_von: "exportiert_nach",

  verehrt: "verehrt_von",
  verehrt_von: "verehrt",
  patron_von: "geschuetzt_von",
  geschuetzt_von: "patron_von",
  heilig_fuer: "heiligt",
  heiligt: "heilig_fuer",
  verflucht_von: "verflucht",
  verflucht: "verflucht_von",
  spricht: "wird_gesprochen_in",
  wird_gesprochen_in: "spricht",
  feiert: "wird_gefeiert_von",
  wird_gefeiert_von: "feiert",

  verteidigt: "verteidigt_von",
  verteidigt_von: "verteidigt",
  bedroht: "bedroht_von",
  bedroht_von: "bedroht",
  belagert: "belagert_von",
  belagert_von: "belagert",
  garnison_in: "beherbergt_garnison",
  beherbergt_garnison: "garnison_in",
  befehligt: "befehligt_von",
  befehligt_von: "befehligt",
  kaempft_gegen: "kaempft_gegen",

  verstarkt: "verstarkt_von",
  verstarkt_von: "verstarkt",
  schwacht: "geschwacht_von",
  geschwacht_von: "schwacht",
  neutralisiert: "neutralisiert_von",
  neutralisiert_von: "neutralisiert",
  wirkt_auf: "beeinflusst_von",
  beeinflusst_von: "wirkt_auf",
  magieknoten_in: "hat_magieknoten",
  hat_magieknoten: "magieknoten_in",
  verbirgt: "verborgen_in",
  verborgen_in: "verbirgt",

  nachfolger_von: "vorgaenger_von",
  vorgaenger_von: "nachfolger_von",
  entstanden_aus: "fuehrte_zu",
  fuehrte_zu: "entstanden_aus",
  erbaut_von: "erbaute",
  erbaute: "erbaut_von",
  zerstoert_durch: "zerstoerte",
  zerstoerte: "zerstoert_durch",
  gefunden_in: "fundort_von",
  fundort_von: "gefunden_in",
  ereignete_sich_in: "schauplatz_von",
  schauplatz_von: "ereignete_sich_in",

  mitglied_von: "hat_mitglied",
  hat_mitglied: "mitglied_von",
  angefuehrt_von: "fuehrt_an",
  fuehrt_an: "angefuehrt_von",
  gegruendet_von: "gruendete",
  gruendete: "gegruendet_von",
  kontrolliert: "kontrolliert_von",
  kontrolliert_von: "kontrolliert",
  untersteht: "hat_untergebenen",
  hat_untergebenen: "untersteht",

  haengt_zusammen_mit: "haengt_zusammen_mit",
  gegensatz_zu: "gegensatz_zu",
  aehnlich_wie: "aehnlich_wie",
  ziel_von: "hat_zum_ziel",
  hat_zum_ziel: "ziel_von",
  ursache_fuer: "folge_von",
  folge_von: "ursache_fuer"
};

/* ---------------- Element-Typen (für Selector) ----------------
 * Auch hier: Keys bleiben stabil. Labels bekommen t(..., FallbackLabel).
 */
const ELEMENT_TYPES = [
  { key: "geo", category: "Orte & Geografie", items: [
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
    { key: "Landmarke-Höhle", label: "Landmarke: Höhle" },
  ]},
  { key: "infrastructure", category: "Infrastruktur", items: [
    { key: "Strasse", label: "Straße/Route" },
    { key: "Brücke", label: "Brücke" },
    { key: "Hafen", label: "Hafen" },
    { key: "Kanal", label: "Kanal" },
    { key: "Aquädukt", label: "Aquädukt" },
    { key: "Mine", label: "Mine" },
    { key: "Mühle", label: "Mühle" },
  ]},
  { key: "politics", category: "Politik & Verwaltung", items: [
    { key: "Reich", label: "Reich/Imperium" },
    { key: "Königreich", label: "Königreich/Republik" },
    { key: "Stadtstaat", label: "Stadtstaat" },
    { key: "Lehen", label: "Lehen/Grafschaft" },
    { key: "Bündnis", label: "Bündnis/Föderation" },
    { key: "Amt", label: "Amt/Behörde" },
    { key: "Gesetz", label: "Gesetz/Edikt" },
    { key: "Grenze", label: "Grenze/Territorium" },
    { key: "Titel", label: "Titel/Rang" },
  ]},
  { key: "society", category: "Gesellschaft & Kultur", items: [
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
    { key: "Legende", label: "Legende/Mythos" },
  ]},
  { key: "economy", category: "Wirtschaft & Alltag", items: [
    { key: "Ressource", label: "Ressource" },
    { key: "Handelsgut", label: "Handelsgut/Ware" },
    { key: "Währung", label: "Währung" },
    { key: "Beruf", label: "Beruf/Handwerk" },
    { key: "Zunft", label: "Zunft/Gilde" },
    { key: "Manufaktur", label: "Manufaktur/Betrieb" },
    { key: "Firma", label: "Firma/Unternehmen" },
    { key: "Markt", label: "Markt/Marktplatz" },
    { key: "Handelsroute", label: "Handelsroute" },
    { key: "Bank", label: "Bank/Wechselstube" },
    { key: "Hof", label: "Hof/Farm/Gehöft" },
    { key: "Gasthaus", label: "Gasthaus/Taverne" },
    { key: "Schmiede", label: "Schmiede/Werkstatt" },
  ]},
  { key: "military", category: "Militär & Macht", items: [
    { key: "Armee", label: "Armee/Legion" },
    { key: "Orden", label: "Orden/Bruderschaft" },
    { key: "Söldner", label: "Söldnerkompanie" },
    { key: "Festung", label: "Festung/Burg" },
    { key: "Garnison", label: "Garnison/Arsenal" },
    { key: "Waffengattung", label: "Waffengattung" },
    { key: "Taktik", label: "Taktik/Doktrin" },
    { key: "Konflikt", label: "Konflikt" },
    { key: "Vertrag", label: "Vertrag/Frieden" },
  ]},
  { key: "knowledge", category: "Wissen & Magie", items: [
    { key: "Magiesystem", label: "Magiesystem/Regeln" },
    { key: "Magieschule", label: "Schule/Tradition" },
    { key: "Zauber", label: "Disziplin/Zauber" },
    { key: "Magiequelle", label: "Quelle/Knoten/Leitlinien" },
    { key: "Artefakt", label: "Artefakt/Relikt" },
    { key: "Bibliothek", label: "Bibliothek/Archiv" },
    { key: "Universität", label: "Universität/Akademie" },
    { key: "Gelehrte", label: "Gelehrtengesellschaft" },
    { key: "Forschung", label: "Forschung/Entdeckung" },
    { key: "Verbotenekunst", label: "Verbotene Künste" },
  ]},
  { key: "nature", category: "Natur & Lebewesen", items: [
    { key: "Spezies", label: "Spezies/Rasse" },
    { key: "Unterart", label: "Unterart/Volk" },
    { key: "Tier", label: "Tier" },
    { key: "Pflanze", label: "Pflanze" },
    { key: "Monster", label: "Monster/Wesen" },
    { key: "Krankheit", label: "Krankheit/Seuche" },
    { key: "Wetter", label: "Wetterphänomen" },
    { key: "Naturgefahr", label: "Naturgefahr" },
  ]},
  { key: "law", category: "Recht & Ordnung", items: [
    { key: "Rechtsordnung", label: "Rechtsordnung" },
    { key: "Gericht", label: "Gericht/Tribunal" },
    { key: "Strafe", label: "Strafe/Urteil" },
    { key: "Zoll", label: "Zoll/Maut" },
    { key: "Steuer", label: "Steuer/Abgabe" },
  ]},
  { key: "history", category: "Geschichte & Zeit", items: [
    { key: "Epoche", label: "Epoche/Zeitalter" },
    { key: "Dynastie", label: "Dynastie" },
    { key: "Ereignis", label: "Ereignis" },
    { key: "Prophezeiung", label: "Prophezeiung" },
    { key: "Chronik", label: "Überlieferung/Chronik" },
  ]},
  { key: "orgs", category: "Organisationen", items: [
    { key: "Geheimbund", label: "Geheimbund/Zirkel" },
    { key: "Kirche", label: "Kirche/Orden" },
    { key: "Händlergilde", label: "Händlergilde" },
    { key: "Agentennetz", label: "Agentennetz/Spionage" },
    { key: "Piratenbande", label: "Piratenbande" },
    { key: "Widerstand", label: "Widerstandsgruppe" },
    { key: "Adelshaus", label: "Haus/Familie/Adelshaus" },
  ]},
  { key: "tech", category: "Technik & Baukunst", items: [
    { key: "Technologie", label: "Technologie/Erfindung" },
    { key: "Werkzeug", label: "Werkzeug/Waffe" },
    { key: "Theater", label: "Bauwerk: Theater" },
    { key: "Arena", label: "Bauwerk: Arena" },
    { key: "Leuchtturm", label: "Bauwerk: Leuchtturm" },
    { key: "Kanalisation", label: "Bauwerk: Kanalisation" },
    { key: "Transport", label: "Transportmittel" },
  ]},
  { key: "plot", category: "Plot-Elemente", items: [
    { key: "Geheimnis", label: "Geheimnis/Mysterium" },
    { key: "Gerücht", label: "Gerücht" },
    { key: "Quest", label: "Quest/Plot-Hook" },
    { key: "MacGuffin", label: "MacGuffin" },
    { key: "Timer", label: "Frist/Timer" },
  ]},
];

/* ---------------- Helpers ---------------- */
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
  return reciprocal === type ? [type] : [reciprocal];
}

/* ---------------- Tabs ---------------- */
const TABS = [
  { key: "details", labelKey: "world.tabs.details" },
  { key: "relations", labelKey: "world.tabs.relationships" },
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

/* ---------------- Beziehung-Labels via i18n ---------------- */
function relLabel(t, typeKey, fallback) {
  return t(`world.relations.types.${typeKey}`, fallback ?? typeKey);
}
function catLabel(t, cat) {
  return t(`world.relations.categories.${cat.key}`, cat.name);
}

/* ---------------- Beziehungen UI ---------------- */
function RelationEditor({ currentId, allElements, onAdd }) {
  const { t } = useTranslation();
  const [targetId, setTargetId] = useState("");
  const [type, setType] = useState(REL_CATEGORIES[0].types[0].key);
  const [note, setNote] = useState("");
  const options = (allElements || []).filter(el => el.id !== currentId);

  return (
    <div style={{display:"grid", gridTemplateColumns:"1.5fr 1.2fr 1fr auto", gap:8}}>
      <select className="input" value={targetId} onChange={e=>setTargetId(Number(e.target.value))}>
        <option value="">{t('world.relations.targetPlaceholder')}</option>
        {options.map(el => <option key={el.id} value={el.id}>{el.title || t('world.unnamed')}</option>)}
      </select>

      <select className="input" value={type} onChange={e=>setType(e.target.value)}>
        {REL_CATEGORIES.map(cat => (
          <optgroup key={cat.key} label={catLabel(t, cat)}>
            {cat.types.map(ti => (
              <option key={ti.key} value={ti.key}>{relLabel(t, ti.key, ti.label)}</option>
            ))}
          </optgroup>
        ))}
      </select>

      <input
        className="input"
        placeholder={t('world.relations.notePlaceholder')}
        value={note}
        onChange={e=>setNote(e.target.value)}
      />
      <button className="btn" onClick={()=> targetId && onAdd({ target_id: targetId, type, note })}>
        {t('world.relations.add')}
      </button>
    </div>
  );
}

function RelationList({ element, allElements, onRemove }) {
  const { t } = useTranslation();
  const links = getPath(element, "relations.connections", []) || [];
  const validLinks = links.filter(r => allElements.find(el => el.id === r.target_id));

  if (!validLinks.length) return <div className="small muted">{t('world.relations.none')}</div>;
  const nameOf = (id) => (allElements.find(el=>el.id===id)?.title) || `#${id}`;
  return (
    <ul style={{listStyle:"none", padding:0, margin:0, display:"grid", gap:8}}>
      {validLinks.map((r, idx) => (
        <li key={idx} className="panel" style={{padding:"8px 10px"}}>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            <div style={{flex: "0 0 auto", fontWeight: 600, color: "var(--brand)"}}>
              {relLabel(t, r.type)}
            </div>
            <div style={{flex: "1 1 auto", color:"var(--muted, #64748b)"}}>{nameOf(r.target_id)}</div>
            {r.note ? <div className="small muted" style={{flex:"2 1 auto"}}>{r.note}</div> : null}
            <button className="btn btn-danger-quiet" onClick={()=>onRemove(r)}>{t('common.delete')}</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------- Graph Modal (Ego-Netz) ------------- */
function RelationsGraphModal({ open, onClose, activeId, allElements, onJumpToElement }) {
  const { t } = useTranslation();
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !activeId) return;

    async function loadRelations() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/world/${activeId}`);
        const elementData = response.data || {};
        const rels = getPath(elementData, "relations.connections", []) || [];
        const validRels = rels.filter(r => allElements.find(el => el.id === r.target_id));

        const nameOf = (id) => allElements.find(el => el.id === id)?.title || `#${id}`;
        const nodes = [];
        const edges = [];

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
          const typeLabel = relLabel(t, r.type);
          const label = r.note ? `${typeLabel} (${r.note})` : typeLabel;

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
            markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
            markerStart: isSym ? { type: MarkerType.ArrowClosed, color: "#64748b" } : undefined,
          });
        });

        setGraphData({ nodes, edges });
      } catch (error) {
        console.error("Relations load failed", error);
        setGraphData({ nodes: [], edges: [] });
      } finally {
        setLoading(false);
      }
    }

    loadRelations();
  }, [open, activeId, allElements, t]);

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
      <Modal open={open} onClose={onClose} title={t('world.graph.title')}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#64748b",
          background: "#f8fafc"
        }}>
          {t('world.graph.loading')}
        </div>
      </Modal>
    );
  }

  const hasRelations = edges.length > 0;

  return (
    <Modal open={open} onClose={onClose} title={t('world.graph.title')}>
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
                {t('world.graph.hint')}
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
            <div style={{ fontSize: 16, fontWeight: 500 }}>{t('world.graph.emptyTitle')}</div>
            <div style={{ fontSize: 14, textAlign: "center", maxWidth: 400 }}>
              {t('world.graph.emptySub')}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ------------- Globale Übersicht ------------- */
function WorldGraphModal({ open, onClose, elements, activeId, onJumpToElement }) {
  const { t } = useTranslation();
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
      <Modal open={open} onClose={onClose} title={t('world.worldGraph.title')}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#64748b",
          background: "#f8fafc"
        }}>
          {t('world.worldGraph.loading')}
        </div>
      </Modal>
    );
  }

  const { profiles, relMap } = relationData;

  return (
    <Modal open={open} onClose={onClose} title={t('world.worldGraph.title')}>
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
                  <div style={{ fontSize: 16, fontWeight: isActive ? 600 : 500, color: isActive ? "#15803d" : "#0f172a" }}>
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
                      {t('world.worldGraph.count', { count: relations.length })}
                    </div>
                  )}
                </div>

                {relations.length > 0 ? (
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
                        <span style={{ color: "#0ea5e9", fontWeight: 500, flexShrink: 0 }}>
                          {relLabel(t, rel.type)}
                        </span>
                        <span style={{ color: "#64748b" }}>→</span>
                        <span style={{ color: "#0f172a", fontWeight: 500 }}>
                          {rel.targetName}
                        </span>
                        {rel.note && (
                          <span style={{ color: "#64748b", fontSize: 12, marginLeft: "auto", fontStyle: "italic" }}>
                            ({rel.note})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ paddingLeft: 22, fontSize: 13, color: "#94a3b8", fontStyle: "italic" }}>
                    {t('world.worldGraph.none')}
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
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const options = useMemo(() => {
    const searchLower = search.toLowerCase();
    const matches = [];
    for (const category of ELEMENT_TYPES) {
      const matchingItems = category.items.filter(item =>
        t(`world.elementTypes.${item.key}`, item.label).toLowerCase().includes(searchLower) ||
        item.key.toLowerCase().includes(searchLower)
      );
      if (matchingItems.length > 0) {
        matches.push({ category, items: matchingItems });
      }
    }
    return matches;
  }, [search, t]);

  const selectedLabel = useMemo(() => {
    for (const category of ELEMENT_TYPES) {
      const item = category.items.find(item => item.key === value);
      if (item) return t(`world.elementTypes.${item.key}`, item.label);
    }
    return "";
  }, [value, t]);

  return (
    <div className="searchable-select" ref={ref} style={{ position: "relative" }}>
      <div className="input" onClick={() => setIsOpen(true)} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
        {selectedLabel || t('world.selectType')}
      </div>

      {isOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, maxHeight: 400, overflowY: "auto",
          background: "white", border: "1px solid #e5e7eb", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10
        }}>
          <div style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('world.searchPlaceholder')}
                autoFocus
                style={{ paddingLeft: 32 }}
              />
              <BsSearch style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            </div>
          </div>

          <div style={{ padding: "4px 0" }}>
            {options.map(({ category, items }) => (
              <div key={category.key}>
                <div style={{
                  padding: "4px 12px", fontSize: 12, fontWeight: 600, color: "#64748b", background: "#f8fafc"
                }}>
                  {t(`world.typeCategories.${category.key}`, category.category)}
                </div>
                {items.map(item => (
                  <div
                    key={item.key}
                    onClick={() => { onChange(item.key); setIsOpen(false); }}
                    style={{ padding: "6px 12px", cursor: "pointer", background: item.key === value ? "#f1f5f9" : "transparent" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                    onMouseLeave={e => e.currentTarget.style.background = item.key === value ? "#f1f5f9" : "transparent"}
                  >
                    {t(`world.elementTypes.${item.key}`, item.label)}
                  </div>
                ))}
              </div>
            ))}
            {options.length === 0 && (
              <div style={{ padding: "8px 12px", color: "#94a3b8" }}>
                {t('world.noResults')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

/* ---------------- Map Region Select ---------------- */
const MapRegionSelect = React.memo(function MapRegionSelect({ value, onChange, regions }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const selectedLabel = useMemo(() => {
    if (!value) return "— None —";
    const region = regions.find(r => r.id === value);
    return region ? (region.name || `Region ${region.id}`) : "— None —";
  }, [value, regions]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        className="input"
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        {selectedLabel}
      </div>

      {isOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, maxHeight: 300, overflowY: "auto",
          background: "white", border: "1px solid #e5e7eb", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, marginTop: 4
        }}>
          <div style={{ padding: "4px 0" }}>
            <div
              onClick={() => { onChange(null); setIsOpen(false); }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                background: !value ? "#f1f5f9" : "transparent",
                fontSize: "14px"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
              onMouseLeave={e => e.currentTarget.style.background = !value ? "#f1f5f9" : "transparent"}
            >
              — None —
            </div>
            {regions.map(region => (
              <div
                key={region.id}
                onClick={() => { onChange(region.id); setIsOpen(false); }}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  background: region.id === value ? "#f1f5f9" : "transparent",
                  fontSize: "14px"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.background = region.id === value ? "#f1f5f9" : "transparent"}
              >
                {region.name || `Region ${region.id}`}
              </div>
            ))}
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
  onOpenGraph,
  mapRegions
}) {
  const { t } = useTranslation();
  return (
    <div className="panel" key={elementId}>
      <nav className="tabs tabs-inline">
        {TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            data-testid={`world-tab-${tab.key}`}
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

      {activeTab === "details" && (
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label className="small muted">{t('world.details.nameLabel')}</label>
              <input
                className="input"
                data-testid="world-field-title"
                value={getPath(element, "title", "")}
                onChange={e => onChangeElement("title", e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label className="small muted">{t('world.details.typeLabel')}</label>
              <SearchableSelect
                value={getPath(element, "kind", "Stadt")}
                onChange={value => onChangeElement("kind", value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label className="small muted">Map Region</label>
            <MapRegionSelect
              value={getPath(element, "regionId", null)}
              onChange={value => onChangeElement("regionId", value)}
              regions={mapRegions}
            />
            <small className="hint">Link this place to a region from your map</small>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label className="small muted">{t('world.details.notesLabel')}</label>
              <textarea
                className="textarea"
                data-testid="world-field-summary"
                placeholder={t('world.details.notesPlaceholder')}
                value={getPath(element, "summary", "")}
                onChange={e => onChangeElement("summary", e.target.value)}
                rows={12}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "relations" && (
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label className="small muted">{t('world.relations.new')}</label>
            <RelationEditor currentId={elementId} allElements={allElements} onAdd={onAddRelation} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label className="small muted">{t('world.relations.existing')}</label>
            <RelationList element={element} allElements={allElements} onRemove={onRemoveRelation} />
          </div>

          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 8 }}>
            <button
              type="button"
              onClick={onOpenGraph}
              title={t('world.graph.open')}
              aria-label={t('world.graph.open')}
              style={{
                width: 48, height: 48, borderRadius: "9999px", border: "1px solid #e5e7eb",
                background: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(15,23,42,.10)", cursor: "pointer"
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 16px rgba(15,23,42,.16)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 14px rgba(15,23,42,.10)")}
            >
              <TbNetwork size={22} color="#0f172a" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

/* ---------------- Hauptkomponente ---------------- */
export default function World() {
  const { id } = useParams();
  const { state } = useLocation();
  const { t } = useTranslation();
  const pid = Number(id);

  const [list, setList] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [element, setElement] = useState({});
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [showGraph, setShowGraph] = useState(false);
  const [showWorldGraph, setShowWorldGraph] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [mapRegions, setMapRegions] = useState([]);
  const [toolsPanelOpen, setToolsPanelOpen] = useState(() => {
    // Load open state from localStorage
    const saved = localStorage.getItem('toolsPanel.open');
    return saved ? JSON.parse(saved) : true;
  });
  const [notesCount, setNotesCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);

  // Save tools panel state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('toolsPanel.open', JSON.stringify(toolsPanelOpen));
  }, [toolsPanelOpen]);

  const hasHandledNewElement = useRef(false);

  useEffect(() => {
    let cancel = false;
    async function load() {
      try {
        const r = await axios.get(`/api/projects/${pid}/world`);
        if (cancel) return;
        const items = r.data || [];
        setList(items);

        const newElId = state?.newElementId;
        if (newElId && items.find(el => el.id === newElId) && !hasHandledNewElement.current) {
          hasHandledNewElement.current = true;
          setActiveId(newElId);
          return;
        }

        if (!activeId && items.length) setActiveId(items[0].id);
      } catch (e) { console.warn(e); }
    }
    if (pid) load();
    return () => { cancel = true; };
  }, [pid, activeId, state?.newElementId]);

  // Load map regions
  useEffect(() => {
    let cancel = false;
    async function loadMapRegions() {
      try {
        const r = await axios.get(`/api/projects/${pid}/map`);
        if (cancel) return;
        const mapData = r.data?.data;
        if (mapData && mapData.states) {
          setMapRegions(mapData.states);
        }
      } catch (e) {
        console.warn('Could not load map regions:', e);
      }
    }
    if (pid) loadMapRegions();
    return () => { cancel = true; };
  }, [pid]);

  useEffect(() => {
    if (!activeId) { setElement({}); return; }
    let cancel = false;
    async function loadOne() {
      try {
        const r = await axios.get(`/api/world/${activeId}`);
        if (cancel) return;
        console.log('[World] Loaded element:', { activeId, regionId: r.data?.regionId, data: r.data });
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

  const saveTimer = useRef(null);
  const saveNow = useCallback(async () => {
    if (!activeId) return;
    console.log('[World] Saving element:', { activeId, regionId: element.regionId, element });
    try {
      await axios.put(`/api/world/${activeId}`, element);
      setLastSavedAt(new Date());
      setList(prev => prev.map(el =>
        el.id === activeId ? { ...el, title: element.title || t('world.newElement') } : el
      ));
      console.log('[World] Save successful');
    } catch (e) {
      console.warn("[World] save failed", e);
    }
  }, [activeId, element, t]);

  useEffect(() => {
    if (!activeId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(saveNow, 700);
    return () => clearTimeout(saveTimer.current);
  }, [activeId, element, saveNow]);

  const addElement = async () => {
    try {
      const r = await axios.post(`/api/projects/${pid}/world`, {
        title: t('world.newElement'),
        kind: "Ort",
        summary: ""
      });
      const el = r.data;
      setList(prev => [...prev, el]);
      setActiveId(el.id);
      setElement({ title: t('world.newElement'), kind: "Ort", summary: "" });
    } catch (e) {
      console.error(e);
      alert(t('world.errors.createFailed'));
    }
  };

  const deleteElement = async (eid) => {
    const el = list.find(x => x.id === eid);
    setConfirmModal({
      title: t('world.delete.title'),
      message: t('world.delete.message', { title: el?.title || t('world.unnamed') }),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      variant: 'danger',
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await axios.delete(`/api/world/${eid}`);
          setList(prev => prev.filter(x => x.id !== eid));
          if (activeId === eid) {
            const next = list.find(x => x.id !== eid);
            setActiveId(next?.id ?? null);
          }
        } catch (e) {
          console.error(e);
          alert(t('world.errors.deleteFailed'));
        }
      },
      onCancel: () => setConfirmModal(null)
    });
  };

  return (
    <div className="page-wrap characters-page">
      <aside className="side">
        <div className="tree">
          <div className="tree-head">
            <span className="tree-title">{t('world.title')}</span>
            <button
              className="icon-btn"
              data-testid="world-graph-button"
              title={t('world.worldGraph.open')}
              onClick={() => setShowWorldGraph(true)}
            >
              <TbTopologyStar3 />
            </button>
            <button className="icon-btn" data-testid="add-world-button" title={t('world.newElement')} onClick={addElement}>
              <BsPlus />
            </button>
          </div>
          <ul className="tree-list">
            {list.map(el => (
              <li key={el.id} data-testid={`world-${el.id}`} className={`tree-scene ${activeId === el.id ? "active" : ""}`}>
                <div className="tree-row scene-row" onClick={() => setActiveId(el.id)} title={el.name}>
                  <span className="tree-dot" aria-hidden />
                  <span className="tree-name">{el.title || t('world.newElement')}</span>
                  <div className="row-actions" onClick={e => e.stopPropagation()}>
                    <button className="icon-btn danger" data-testid={`delete-world-${el.id}`} title={t('common.delete')} onClick={() => deleteElement(el.id)}>
                      <BsTrash />
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {!list.length && <li className="tree-empty">{t('world.empty')}</li>}
          </ul>
        </div>
      </aside>

      <main className="main">
        {!activeId ? (
          <div className="panel" style={{ padding: "1rem" }}>
            <strong>{t('world.noneSelected')}</strong><br />
            <button className="btn btn-primary-quiet" onClick={addElement} style={{ marginTop: 8 }}>
              + {t('world.newElement')}
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
              mapRegions={mapRegions}
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

      {/* Right sidebar - Tools panel */}
      <aside className={`tools-panel ${toolsPanelOpen ? 'open' : 'closed'}`}>
        <div className="tools-header" style={{ display: toolsPanelOpen ? 'flex' : 'none' }}>
          <span className="tools-title">{t('writing.toolsTitle')}</span>
          <button
            className="icon-btn tools-toggle"
            onClick={() => setToolsPanelOpen(!toolsPanelOpen)}
            aria-label={t('writing.closeTools')}
          >
            <BsChevronRight />
          </button>
        </div>

        <div className="tools-content" style={{ display: toolsPanelOpen ? 'flex' : 'none' }}>
          {activeId ? (
            <>
              <NotesPanel
                contextType="worldnode"
                contextId={activeId}
                onRequestDelete={setConfirmModal}
                onCountChange={setNotesCount}
              />
              <TasksPanel
                contextType="worldnode"
                contextId={activeId}
                onRequestDelete={setConfirmModal}
                onCountChange={setTasksCount}
              />
            </>
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
              {t('world.tools.selectElement')}
            </div>
          )}
        </div>

        {/* Hidden panels for count updates when collapsed */}
        {!toolsPanelOpen && activeId && (
          <div style={{ display: 'none' }}>
            <NotesPanel
              contextType="worldnode"
              contextId={activeId}
              onRequestDelete={setConfirmModal}
              onCountChange={setNotesCount}
            />
            <TasksPanel
              contextType="worldnode"
              contextId={activeId}
              onRequestDelete={setConfirmModal}
              onCountChange={setTasksCount}
            />
          </div>
        )}

        <div className="tools-collapsed-view" style={{ display: toolsPanelOpen ? 'none' : 'flex' }}>
          <button
            className="tools-collapsed-toggle"
            onClick={() => setToolsPanelOpen(true)}
            aria-label={t('writing.openTools')}
            title={t('writing.openTools')}
          >
            <BsWrench className="tools-icon" />
            <div className="tools-badges">
              {notesCount > 0 && <span className="tool-badge notes-badge">{notesCount}</span>}
              {tasksCount > 0 && <span className="tool-badge tasks-badge">{tasksCount}</span>}
            </div>
          </button>
        </div>
      </aside>

      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
}
