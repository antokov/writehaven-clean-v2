import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BsPlus, BsTrash } from "react-icons/bs";
import { TbNetwork, TbTopologyStar3 } from "react-icons/tb"; // Icons
import ForceGraph2D from "react-force-graph-2d";
import { createPortal } from "react-dom";

/** Tabs */
const TABS = [
  { key: "basic",        label: "Grunddaten" },
  { key: "appearance",   label: "Äußeres" },
  { key: "personality",  label: "Persönlichkeit" },
  { key: "relations",    label: "Hintergrund" },
  { key: "skills",       label: "Fähigkeiten" },
  { key: "links",        label: "Beziehungen" }, // NEU
  { key: "notes",        label: "Notizen" },
];

// Visuelle Konstanten
const LINK_CURVATURE = 0.25;
const LABEL_FONT = "bold 10px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

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
function fullNameFromProfile(profile) {
  const first = getPath(profile, "basic.first_name", "");
  const last  = getPath(profile, "basic.last_name", "");
  return [first, last].filter(Boolean).join(" ").trim();
}

/* ------------ Beziehungstypen ------------ */
const REL_TYPES = [
  "ist Vater von","ist Mutter von","ist Sohn von","ist Tochter von",
  "ist Freund von","ist Feind von","ist Geschwister von","ist Mentor von",
  "ist Schüler von","ist Ehepartner von","ist Vorgesetzter von","ist Untergebener von",
  "ist Verbündeter von","ist Liebhaber von",
];
const RECIPROCAL = {
  "ist Vater von": "ist Kind von",
  "ist Mutter von": "ist Kind von",
  "ist Sohn von": "ist Elternteil von",
  "ist Tochter von": "ist Elternteil von",
  "ist Freund von": "ist Freund von",
  "ist Feind von": "ist Feind von",
  "ist Geschwister von": "ist Geschwister von",
  "ist Mentor von": "ist Schüler von",
  "ist Schüler von": "ist Mentor von",
  "ist Ehepartner von": "ist Ehepartner von",
  "ist Vorgesetzter von": "ist Untergebener von",
  "ist Untergebener von": "ist Vorgesetzter von",
  "ist Verbündeter von": "ist Verbündeter von",
  "ist Liebhaber von": "ist Liebhaber von",
  "ist Elternteil von": "ist Kind von",
  "ist Kind von": "ist Elternteil von",
};
function uniqBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    const k = keyFn(x);
    if (!seen.has(k)) { seen.add(k); out.push(x); }
  }
  return out;
}
function counterpartTypesForDelete(type) {
  if (type === "ist Kind von")       return ["ist Vater von", "ist Mutter von", "ist Elternteil von"];
  if (type === "ist Elternteil von") return ["ist Kind von"];
  const t = RECIPROCAL[type] || type;
  return [t];
}
function displayNameForList(item, activeId, draftFull) {
  if (item.id === activeId && draftFull) return draftFull;
  return item.name || "Neuer Charakter";
}

/* --------- Canvas-Geometrie (Bezier, Winkel, Pfeile) --------- */
function controlPoint(sx, sy, tx, ty, curvature) {
  const dx = tx - sx, dy = ty - sy;
  const len = Math.hypot(dx, dy) || 1;
  const mx = (sx + tx) / 2;
  const my = (sy + ty) / 2;
  const nx = -dy / len;
  const ny =  dx / len;
  return { cx: mx + nx * len * curvature, cy: my + ny * len * curvature };
}
function bezierPointAndAngle(sx, sy, cx, cy, tx, ty, t) {
  const x = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * tx;
  const y = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * ty;
  const dx = 2 * (1 - t) * (cx - sx) + 2 * t * (tx - cx);
  const dy = 2 * (1 - t) * (cy - sy) + 2 * t * (ty - cy);
  let angle = Math.atan2(dy, dx);
  if (angle > Math.PI / 2 || angle < -Math.PI / 2) angle += Math.PI; // Text nicht kopfüber
  return { x, y, angle };
}
function drawArrowhead(ctx, x, y, angle, size = 6) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-size, 0.6 * size);
  ctx.lineTo(-size, -0.6 * size);
  ctx.closePath();
  ctx.fillStyle = "rgba(100,116,139,.8)";
  ctx.fill();
  ctx.restore();
}

/* ------- Text ALONG quadratic Bezier (Label liegt exakt auf Linie) ------- */
function quadCtrlPoint(sx, sy, tx, ty, curvature) {
  return controlPoint(sx, sy, tx, ty, curvature);
}
function quadPoint(sx, sy, cx, cy, tx, ty, t) {
  const x = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * tx;
  const y = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * ty;
  const dx = 2 * (1 - t) * (cx - sx) + 2 * t * (tx - cx);
  const dy = 2 * (1 - t) * (cy - sy) + 2 * t * (ty - cy);
  return { x, y, angle: Math.atan2(dy, dx) };
}
function drawTextAlongQuadratic(ctx, s, t, text, curvature, font = LABEL_FONT) {
  if (!text) return;
  const { cx, cy } = quadCtrlPoint(s.x, s.y, t.x, t.y, curvature);

  // Arc-length Tabelle
  const N = 80;
  const Ts = new Array(N + 1).fill(0).map((_, i) => i / N);
  const P  = Ts.map(tt => quadPoint(s.x, s.y, cx, cy, t.x, t.y, tt));
  const Ls = [0];
  for (let i = 1; i < P.length; i++) {
    const d = Math.hypot(P[i].x - P[i-1].x, P[i].y - P[i-1].y);
    Ls[i] = Ls[i-1] + d;
  }
  const total = Ls[Ls.length - 1];

  ctx.save();
  ctx.font = font;
  const glyphs = [...text];
  const widths = glyphs.map(g => ctx.measureText(g).width);
  const textW = widths.reduce((a,b)=>a+b,0);

  // mittig auf der Kurve starten
  const startLen = Math.max(0, (total - textW) / 2);

  const lenToT = (len) => {
    let lo = 0, hi = Ls.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (Ls[mid] < len) lo = mid + 1; else hi = mid;
    }
    const i = Math.min(Ls.length - 2, Math.max(1, lo));
    const seg = Ls[i] - Ls[i-1] || 1;
    const frac = (len - Ls[i-1]) / seg;
    return Ts[i-1] + (Ts[i] - Ts[i-1]) * frac;
  };

  let curLen = startLen;
  for (let i = 0; i < glyphs.length; i++) {
    const midLen = curLen + widths[i] / 2;
    const tt = lenToT(Math.min(total, Math.max(0, midLen)));
    let { x, y, angle } = quadPoint(s.x, s.y, cx, cy, t.x, t.y, tt);
    if (angle > Math.PI/2 || angle < -Math.PI/2) angle += Math.PI;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,255,255,.9)";
    ctx.strokeText(glyphs[i], 0, 0);
    ctx.fillStyle = "#0f172a";
    ctx.fillText(glyphs[i], 0, 0);
    ctx.restore();

    curLen += widths[i];
  }
  ctx.restore();
}

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
function RelationEditor({ currentId, allCharacters, onAdd }) {
  const [targetId, setTargetId] = React.useState("");
  const [type, setType] = React.useState(REL_TYPES[0]);
  const [note, setNote] = React.useState("");
  const options = (allCharacters || []).filter(c => c.id !== currentId);

  return (
    <div style={{display:"grid", gridTemplateColumns:"1.5fr 1.2fr 1fr auto", gap:8}}>
      <select className="input" value={targetId} onChange={e=>setTargetId(Number(e.target.value))}>
        <option value="">– Ziel-Charakter –</option>
        {options.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <select className="input" value={type} onChange={e=>setType(e.target.value)}>
        {REL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <input className="input" placeholder="Notiz (optional)" value={note} onChange={e=>setNote(e.target.value)} />
      <button className="btn" onClick={()=> targetId && onAdd({ target_id: targetId, type, note })}>Hinzufügen</button>
    </div>
  );
}
function RelationList({ profile, allCharacters, onRemove }) {
  const links = getPath(profile, "links.connections", []) || [];
  if (!links.length) return <div className="small muted">Keine Verbindungen</div>;
  const nameOf = (id) => (allCharacters.find(c=>c.id===id)?.name) || `#${id}`;
  return (
    <ul style={{listStyle:"none", padding:0, margin:0, display:"grid", gap:8}}>
      {links.map((r, idx) => (
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

/* ------------- Graph Modal (Ego-Netz) ------------- */
function RelationsGraphModal({ open, onClose, activeId, profile, allCharacters, onJumpToCharacter }) {
  // Daten + Startlayout
  const data = useMemo(() => {
    const nodes = [];
    const links = [];
    const nameOf = (id) => allCharacters.find(c => c.id === id)?.name || `#${id}`;

    // Ego fix bei (0,0) starten
    nodes.push({ id: activeId, name: nameOf(activeId), ego: true, x: 0, y: 0, fx: 0, fy: 0 });

    const rels = getPath(profile, "links.connections", []) || [];
    rels.forEach((r) => {
      if (!nodes.some(n => n.id === r.target_id)) {
        nodes.push({ id: r.target_id, name: nameOf(r.target_id), ego: false });
      }
      const isSym = (RECIPROCAL[r.type] || r.type) === r.type;
      links.push({
        source: activeId,
        target: r.target_id,
        label: r.note ? `${r.type} (${r.note})` : r.type,
        double: isSym,                // zweiter Pfeil für symmetrische Beziehungen
        curv: LINK_CURVATURE
      });
    });

    // Nachbarn ringförmig
    const neighbors = nodes.filter(n => !n.ego);
    const R = 160;
    neighbors.forEach((n, i) => {
      const a = (i / Math.max(1, neighbors.length)) * Math.PI * 2;
      n.x = R * Math.cos(a);
      n.y = R * Math.sin(a);
    });
    return { nodes, links };
  }, [activeId, profile, allCharacters]);

  const fgRef = useRef(null);

  // Container-Maße ermitteln -> ForceGraph width/height setzen
  const wrapRef = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  useEffect(() => {
    if (!open) return;
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      setDims({ w: Math.floor(cr.width), h: Math.floor(cr.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  // Kräfte + Kamera
  useEffect(() => {
    if (!open) return;
    const fg = fgRef.current;
    if (!fg) return;

    fg.d3Force("charge")?.strength(-220);
    fg.d3Force("link")?.distance(140);

    const cf = fg.d3Force("center");
    cf?.x?.(0);
    cf?.y?.(0);

    fg.d3ReheatSimulation?.();

    const unpin = setTimeout(() => {
      const ego = data.nodes.find(n => n.ego);
      if (ego) { delete ego.fx; delete ego.fy; fg.d3ReheatSimulation?.(); }
    }, 700);

    const r1 = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        fg.centerAt(0, 0, 0);
        fg.zoom(1.2, 300);
      })
    );

    return () => {
      clearTimeout(unpin);
      cancelAnimationFrame(r1);
    };
  }, [open, data, dims.w, dims.h]);

  // Node-Text mit Halo (wie bisher)
  const drawTextWithHalo = (ctx, text, x, y) => {
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,255,255,.9)";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = "#0f172a";
    ctx.fillText(text, x, y);
  };

  return (
    <Modal open={open} onClose={onClose} title="Beziehungs-Graph">
      <div ref={wrapRef} style={{ width: "100%", height: "100%" }}>
        {dims.w > 0 && dims.h > 0 && (
          <ForceGraph2D
            ref={fgRef}
            width={dims.w}
            height={dims.h}
            graphData={data}
            backgroundColor="#ffffff"
            nodeRelSize={4}
            linkWidth={1}
            linkColor={() => "rgba(100,116,139,.6)"}
            linkDirectionalArrowLength={6}
            linkDirectionalArrowRelPos={0.98}
            linkCurvature={(link) => link.curv ?? LINK_CURVATURE}
            minZoom={0.4}
            maxZoom={3}
            cooldownTicks={80}
            nodeLabel={() => ""}
            nodeCanvasObject={(node, ctx) => {
              const radius = node.ego ? 9 : 6;
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = node.ego ? "#22c55e" : "#94a3b8";
              ctx.fill();
              ctx.lineWidth = 1;
              ctx.strokeStyle = "rgba(15,23,42,.25)";
              ctx.stroke();
              drawTextWithHalo(ctx, node.name, node.x, node.y + radius + 10);
            }}
            linkCanvasObjectMode={() => "after"}
            linkCanvasObject={(link, ctx) => {
              const s = link.source, t = link.target;
              if (typeof s !== "object" || typeof t !== "object") return;

              const text = (link.label || "").slice(0, 80);
              if (text) drawTextAlongQuadratic(ctx, s, t, text, link.curv ?? LINK_CURVATURE);

              // Zweiter Pfeil am Quellende für symmetrische Beziehungen
              if (link.double) {
                const { cx, cy } = controlPoint(s.x, s.y, t.x, t.y, link.curv ?? LINK_CURVATURE);
                const a = bezierPointAndAngle(s.x, s.y, cx, cy, t.x, t.y, 0.12);
                drawArrowhead(ctx, a.x, a.y, a.angle + Math.PI);
              }
            }}
            onNodeClick={(n) => { if (n?.id) { onJumpToCharacter(n.id); onClose(); } }}
          />
        )}
      </div>
    </Modal>
  );
}

/* ------------- World Mindmap (alle Beziehungen) ------------- */
function WorldGraphModal({ open, onClose, characters, activeId, onJumpToCharacter }) {
  const [graph, setGraph] = useState(null);

  // Größe des Containers
  const wrapRef = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  useEffect(() => {
    if (!open) return;
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      setDims({ w: Math.floor(cr.width), h: Math.floor(cr.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  // Daten laden/aufbauen
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    async function build() {
      try {
        const profiles = await Promise.all(
          (characters || []).map(c => axios.get(`/api/characters/${c.id}`).then(r => ({
            id: c.id,
            name: c.name || r.data?.name || `#${c.id}`,
            profile: r.data?.profile || {}
          })))
        );

        const nodes = profiles.map(p => ({
          id: p.id,
          name: p.name,
          active: p.id === activeId
        }));

        const links = [];
        const seenSymUndirected = new Set();  // Symmetrisch: eine Linie
        const pairCurvCount = new Map();      // Für mehrere Kanten zwischen Paaren

        const isSym = (type) => (RECIPROCAL[type] || type) === type;

        for (const p of profiles) {
          const rels = getPath(p.profile, "links.connections", []) || [];
          for (const r of rels) {
            const source = p.id;
            const target = r.target_id;
            const type   = r.type;
            const label  = r.note ? `${type} (${r.note})` : type;

            if (isSym(type)) {
              // Eine Linie, zwei Pfeile
              const key = `${Math.min(source,target)}|${Math.max(source,target)}|${type}|${r.note||""}`;
              if (seenSymUndirected.has(key)) continue;
              seenSymUndirected.add(key);
              links.push({ source, target, label, double: true, curv: LINK_CURVATURE });
            } else {
              // Asymmetrisch: jede Richtung als eigene Kante, Krümmung abwechselnd
              const pairKey = `${Math.min(source,target)}|${Math.max(source,target)}`;
              const n = pairCurvCount.get(pairKey) || 0;
              const curv = (n % 2 === 0) ? LINK_CURVATURE : -LINK_CURVATURE;
              pairCurvCount.set(pairKey, n + 1);
              links.push({ source, target, label, double: false, curv });
            }
          }
        }

        if (!cancelled) setGraph({ nodes, links });
      } catch (e) {
        console.warn("world graph load failed", e);
        if (!cancelled) setGraph({ nodes: [], links: [] });
      }
    }
    build();
    return () => { cancelled = true; };
  }, [open, characters, activeId]);

  const fgRef = useRef(null);

  // Zoom-to-fit
  useEffect(() => {
    if (!open || !graph) return;
    const fg = fgRef.current;
    if (!fg) return;
    fg.d3Force("charge")?.strength(-220);
    fg.d3Force("link")?.distance(140);
    fg.d3ReheatSimulation?.();

    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        try { fg.zoomToFit(400, 40); } catch {}
      })
    );
    return () => cancelAnimationFrame(raf);
  }, [open, graph, dims.w, dims.h]);

  // Node-Text (wie oben)
  const drawTextWithHalo = (ctx, text, x, y) => {
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,255,255,.9)";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = "#0f172a";
    ctx.fillText(text, x, y);
  };

  return (
    <Modal open={open} onClose={onClose} title="Mindmap – alle Beziehungen">
      <div ref={wrapRef} style={{ width: "100%", height: "100%" }}>
        {graph && dims.w > 0 && dims.h > 0 && (
          <ForceGraph2D
            ref={fgRef}
            width={dims.w}
            height={dims.h}
            graphData={graph}
            backgroundColor="#ffffff"
            nodeRelSize={4}
            linkWidth={1}
            linkColor={() => "rgba(100,116,139,.6)"}
            linkDirectionalArrowLength={6}
            linkDirectionalArrowRelPos={0.98}
            linkCurvature={(link) => link.curv ?? LINK_CURVATURE}
            minZoom={0.3}
            maxZoom={3.5}
            cooldownTicks={120}
            nodeLabel={() => ""}
            nodeCanvasObject={(node, ctx) => {
              const radius = node.active ? 9 : 6;
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = node.active ? "#22c55e" : "#94a3b8";
              ctx.fill();
              ctx.lineWidth = 1;
              ctx.strokeStyle = "rgba(15,23,42,.25)";
              ctx.stroke();
              drawTextWithHalo(ctx, node.name, node.x, node.y + radius + 10);
            }}
            linkCanvasObjectMode={() => "after"}
            linkCanvasObject={(link, ctx) => {
              const s = link.source, t = link.target;
              if (typeof s !== "object" || typeof t !== "object") return;

              const text = (link.label || "").slice(0, 80);
              if (text) drawTextAlongQuadratic(ctx, s, t, text, link.curv ?? LINK_CURVATURE);

              // zweiter Pfeil bei symmetrischen Beziehungen
              if (link.double) {
                const { cx, cy } = controlPoint(s.x, s.y, t.x, t.y, link.curv ?? LINK_CURVATURE);
                const a = bezierPointAndAngle(s.x, s.y, cx, cy, t.x, t.y, 0.12);
                drawArrowhead(ctx, a.x, a.y, a.angle + Math.PI);
              }
            }}
            onNodeClick={(n) => { if (n?.id) { onJumpToCharacter(n.id); } }}
          />
        )}
      </div>
    </Modal>
  );
}

/* ---------------- Editor ---------------- */
const CharacterEditor = React.memo(function CharacterEditor({
  characterId, profile, onChangeProfilePath, activeTab, setActiveTab,
  lastSavedAt, allCharacters, onAddRelation, onRemoveRelation, onOpenGraph
}) {
  return (
    <div className="panel" key={characterId}>
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

      {activeTab === "basic" && (
        <div className="form-grid">
          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Vorname</label>
              <input className="input"
                value={getPath(profile, "basic.first_name", "")}
                onChange={e => onChangeProfilePath("basic.first_name", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Nachname</label>
              <input className="input"
                value={getPath(profile, "basic.last_name", "")}
                onChange={e => onChangeProfilePath("basic.last_name", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Spitzname(n)</label>
              <input className="input"
                value={getPath(profile, "basic.nickname", "")}
                onChange={e => onChangeProfilePath("basic.nickname", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Geschlecht</label>
              <input className="input"
                value={getPath(profile, "basic.gender", "")}
                onChange={e => onChangeProfilePath("basic.gender", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Geburtsdatum</label>
              <input className="input" placeholder="z.B. 1. Wintermond / 2001-12-05"
                value={getPath(profile, "basic.birth_date", "")}
                onChange={e => onChangeProfilePath("basic.birth_date", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Alter</label>
              <input className="input"
                value={getPath(profile, "basic.age", "")}
                onChange={e => onChangeProfilePath("basic.age", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Wohnort</label>
              <input className="input"
                value={getPath(profile, "basic.residence", "")}
                onChange={e => onChangeProfilePath("basic.residence", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Nationalität</label>
              <input className="input"
                value={getPath(profile, "basic.nationality", "")}
                onChange={e => onChangeProfilePath("basic.nationality", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Religion</label>
              <input className="input"
                value={getPath(profile, "basic.religion", "")}
                onChange={e => onChangeProfilePath("basic.religion", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}


      {activeTab === "appearance" && (
        <div className="form-grid">
          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Größe</label>
              <input className="input"
                value={getPath(profile, "appearance.height", "")}
                onChange={e => onChangeProfilePath("appearance.height", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Gewicht</label>
              <input className="input"
                value={getPath(profile, "appearance.weight", "")}
                onChange={e => onChangeProfilePath("appearance.weight", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Haarfarbe</label>
              <input className="input"
                value={getPath(profile, "appearance.hair_color", "")}
                onChange={e => onChangeProfilePath("appearance.hair_color", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Augenfarbe</label>
              <input className="input"
                value={getPath(profile, "appearance.eye_color", "")}
                onChange={e => onChangeProfilePath("appearance.eye_color", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Statur / Körperbau</label>
              <input className="input"
                value={getPath(profile, "appearance.build", "")}
                onChange={e => onChangeProfilePath("appearance.build", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Hautfarbe</label>
              <input className="input"
                value={getPath(profile, "appearance.skin_color", "")}
                onChange={e => onChangeProfilePath("appearance.skin_color", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Besondere Merkmale</label>
              <input className="input"
                value={getPath(profile, "appearance.distinguishing_features", "")}
                onChange={e => onChangeProfilePath("appearance.distinguishing_features", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Kleidungsstil</label>
              <input className="input"
                value={getPath(profile, "appearance.clothing_style", "")}
                onChange={e => onChangeProfilePath("appearance.clothing_style", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Accessoires</label>
              <input className="input"
                value={getPath(profile, "appearance.accessories", "")}
                onChange={e => onChangeProfilePath("appearance.accessories", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Körpersprache / Haltung</label>
              <input className="input"
                value={getPath(profile, "appearance.body_language", "")}
                onChange={e => onChangeProfilePath("appearance.body_language", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row" style={{ gridColumn: "span 12" }}>
            <div className="form-field">
              <label className="small muted">Gesamteindruck & weitere Details</label>
              <textarea
                className="textarea"
                value={getPath(profile, "appearance.general_impression", "")}
                onChange={e => onChangeProfilePath("appearance.general_impression", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "skills" && (
        <div className="form-grid">
          <div className="form-row" style={{ gridColumn: "span 12" }}>
            <div className="form-field">
              <label className="small muted">Fähigkeiten</label>
              <textarea
                className="textarea"
                placeholder="Drücke ENTER oder KOMMA um eine neue Fähigkeit hinzuzufügen..."
                value={getPath(profile, "skills.input", "")}
                onChange={e => {
                  const val = e.target.value;
                  if (val.endsWith(",") || val.endsWith("\n")) {
                    // Extract skill text without comma/newline
                    const skillText = val.slice(0, -1).trim();
                    if (skillText) {
                      // Add to list if not empty
                      const currentSkills = getPath(profile, "skills.list", []);
                      const updatedSkills = Array.from(new Set([...currentSkills, skillText]));
                      onChangeProfilePath("skills.list", updatedSkills);
                      // Clear input
                      onChangeProfilePath("skills.input", "");
                    }
                  } else {
                    // Normal text input - just update the field
                    onChangeProfilePath("skills.input", val);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevent newline
                    const val = getPath(profile, "skills.input", "").trim();
                    if (val) {
                      const currentSkills = getPath(profile, "skills.list", []);
                      const updatedSkills = Array.from(new Set([...currentSkills, val]));
                      onChangeProfilePath("skills.list", updatedSkills);
                      onChangeProfilePath("skills.input", "");
                    }
                  }
                }}
                rows={3}
              />
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {getPath(profile, "skills.list", []).map((skill, index) => (
                  <span key={index} style={{
                    background: "#e0e7ef",
                    color: "#334155",
                    borderRadius: 12,
                    padding: "2px 10px",
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: 14
                  }}>
                    {skill}
                    <button
                      type="button"
                      onClick={() => {
                        const currentSkills = getPath(profile, "skills.list", []);
                        const updatedSkills = currentSkills.filter((_, i) => i !== index);
                        onChangeProfilePath("skills.list", updatedSkills);
                      }}
                      style={{
                        marginLeft: 6,
                        background: "none",
                        border: "none",
                        color: "#64748b",
                        cursor: "pointer",
                        fontSize: 16,
                        lineHeight: 1,
                        padding: 0
                      }}
                      title="Entfernen"
                    >×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "personality" && (
        <div className="form-grid">
          <div className="form-row" style={{ gridColumn: "span 12" }}>
            <div className="form-field">
              <label className="small muted">Hervorstechende Charakterzüge (positiv & negativ)</label>
              <textarea className="textarea"
                value={getPath(profile, "personality.traits", "")}
                onChange={e => onChangeProfilePath("personality.traits", e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Stärken</label>
              <input className="input"
                value={getPath(profile, "personality.strengths", "")}
                onChange={e => onChangeProfilePath("personality.strengths", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Schwächen</label>
              <input className="input"
                value={getPath(profile, "personality.weaknesses", "")}
                onChange={e => onChangeProfilePath("personality.weaknesses", e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Intelligenz</label>
              <input className="input"
                value={getPath(profile, "personality.intelligence", "")}
                onChange={e => onChangeProfilePath("personality.intelligence", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Art des Humors</label>
              <input className="input"
                value={getPath(profile, "personality.humor", "")}
                onChange={e => onChangeProfilePath("personality.humor", e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Interessen</label>
              <input className="input"
                value={getPath(profile, "personality.interests", "")}
                onChange={e => onChangeProfilePath("personality.interests", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Geschmäcker & Vorlieben</label>
              <input className="input"
                value={getPath(profile, "personality.likes", "")}
                onChange={e => onChangeProfilePath("personality.likes", e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Abneigungen</label>
              <input className="input"
                value={getPath(profile, "personality.dislikes", "")}
                onChange={e => onChangeProfilePath("personality.dislikes", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Moralvorstellungen & innere Haltung</label>
              <input className="input"
                value={getPath(profile, "personality.morals", "")}
                onChange={e => onChangeProfilePath("personality.morals", e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Phobien & Ängste</label>
              <input className="input"
                value={getPath(profile, "personality.fears", "")}
                onChange={e => onChangeProfilePath("personality.fears", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Ziele & Motivation</label>
              <input className="input"
                value={getPath(profile, "personality.goals_motivation", "")}
                onChange={e => onChangeProfilePath("personality.goals_motivation", e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Ungelöste Probleme</label>
              <input className="input"
                value={getPath(profile, "personality.unresolved_problems", "")}
                onChange={e => onChangeProfilePath("personality.unresolved_problems", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Innere Konflikte</label>
              <input className="input"
                value={getPath(profile, "personality.inner_conflicts", "")}
                onChange={e => onChangeProfilePath("personality.inner_conflicts", e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="small muted">(Geheime) Wünsche & Träume</label>
              <input className="input"
                value={getPath(profile, "personality.wishes_dreams", "")}
                onChange={e => onChangeProfilePath("personality.wishes_dreams", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Wiederkehrende Verhaltensweisen</label>
              <input className="input"
                value={getPath(profile, "personality.patterns_in_situations", "")}
                onChange={e => onChangeProfilePath("personality.patterns_in_situations", e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Traumata</label>
              <input className="input"
                value={getPath(profile, "personality.traumas", "")}
                onChange={e => onChangeProfilePath("personality.traumas", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Schmerzliche Rückschläge & Erlebnisse</label>
              <input className="input"
                value={getPath(profile, "personality.setbacks", "")}
                onChange={e => onChangeProfilePath("personality.setbacks", e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="small muted">Bedeutungsvolle Erfahrungen</label>
              <input className="input"
                value={getPath(profile, "personality.experiences", "")}
                onChange={e => onChangeProfilePath("personality.experiences", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="small muted">Standpunkt ggü. Leben</label>
              <input className="input"
                value={getPath(profile, "personality.view_on_life", "")}
                onChange={e => onChangeProfilePath("personality.view_on_life", e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field" style={{ gridColumn: "span 12" }}>
              <label className="small muted">Standpunkt ggü. Tod</label>
              <input className="input"
                value={getPath(profile, "personality.view_on_death", "")}
                onChange={e => onChangeProfilePath("personality.view_on_death", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Beziehungen (NEU + Button unten mittig) */}
      {activeTab === "links" && (
        <div className="form-grid">
          {/* obere Zeile: nur Editor */}
          <div className="form-row" style={{ gridColumn: "span 12", display:"flex", alignItems:"center" }}>
            <div className="form-field" style={{flex:1}}>
              <label className="small muted">Neue Verbindung</label>
              <RelationEditor
                currentId={characterId}
                allCharacters={allCharacters}
                onAdd={onAddRelation}
              />
            </div>
          </div>

          {/* Liste */}
          <div className="form-row" style={{ gridColumn: "span 12" }}>
            <div className="form-field">
              <label className="small muted">Bestehende Verbindungen</label>
              <RelationList
                profile={profile}
                allCharacters={allCharacters}
                onRemove={onRemoveRelation}
              />
            </div>
          </div>

          {/* Runder Icon-Button – mittig unter den Beziehungen */}
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

      {/* Hintergrund (aus Platzgründen hier ausgelassen) */}
      {activeTab === "relations" && (
        <div className="form-grid">
          {/* ... deine bestehenden Felder ... */}
        </div>
      )}

      {activeTab === "notes" && (
        <div className="form-grid">
          <div className="form-row" style={{ gridColumn: "span 12" }}>
            <div className="form-field">
              <label className="small muted">Notizen</label>
              <textarea className="textarea"
                value={getPath(profile, "notes.text", "")}
                onChange={e => onChangeProfilePath("notes.text", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

/* ---------------- Seite ---------------- */
export default function Characters() {
  const { id } = useParams();
  const pid = Number(id);

  const [list, setList] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [profile, setProfile] = useState({});
  const [activeTab, setActiveTab] = useState("basic");
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  const [showWorldGraph, setShowWorldGraph] = useState(false); // NEU

  const draftFullName = useMemo(() => fullNameFromProfile(profile), [profile]);

  useEffect(() => {
    let cancel = false;
    async function load() {
      try {
        const r = await axios.get(`/api/projects/${pid}/characters`);
        if (cancel) return;
        const items = r.data || [];
        setList(items);
        if (!activeId && items.length) setActiveId(items[0].id);
      } catch (e) { console.warn(e); }
    }
    if (pid) load();
    return () => { cancel = true; };
  }, [pid]);

  useEffect(() => {
    if (!activeId) { setProfile({}); return; }
    let cancel = false;
    async function loadOne() {
      try {
        const r = await axios.get(`/api/characters/${activeId}`);
        if (cancel) return;
        setProfile(r.data?.profile || {});
      } catch (e) { console.warn(e); }
    }
    loadOne();
    return () => { cancel = true; };
  }, [activeId]);

  const onChangeProfilePath = useCallback((path, val) => {
    setProfile(prev => setPathIn(prev, path, val));
  }, []);

  const onAddRelation = useCallback(async (rel) => {
    if (!activeId || !rel?.target_id) return;
    const currentLinks = getPath(profile, "links.connections", []);
    const newLinks = uniqBy(
      [...currentLinks, { target_id: rel.target_id, type: rel.type, note: rel.note || "" }],
      (r)=> `${r.target_id}|${r.type}|${r.note || ""}`
    );
    setProfile(prev => setPathIn(prev, "links.connections", newLinks));

    await axios.patch(`/api/characters/${activeId}`, {
      profile: setPathIn(profile, "links.connections", newLinks)
    });

    try {
      const rr = await axios.get(`/api/characters/${rel.target_id}`);
      const otherProf  = rr.data?.profile || {};
      const backType   = RECIPROCAL[rel.type] || rel.type;
      const otherLinks = getPath(otherProf, "links.connections", []);
      const newOtherLinks = uniqBy(
        [...otherLinks, { target_id: activeId, type: backType, note: rel.note || "" }],
        (r)=> `${r.target_id}|${r.type}|${r.note || ""}`
      );
      await axios.patch(`/api/characters/${rel.target_id}`, {
        profile: setPathIn(otherProf, "links.connections", newOtherLinks)
      });
    } catch(e){ console.warn(e); }
  }, [activeId, profile]);

  const onRemoveRelation = useCallback(async (rel) => {
    if (!activeId || !rel?.target_id) return;
    const currentLinks = getPath(profile, "links.connections", []);
    const filtered = currentLinks.filter(
      r => !(r.target_id === rel.target_id && r.type === rel.type)
    );
    setProfile(prev => setPathIn(prev, "links.connections", filtered));

    await axios.patch(`/api/characters/${activeId}`, {
      profile: setPathIn(profile, "links.connections", filtered)
    });

    try {
      const rr = await axios.get(`/api/characters/${rel.target_id}`);
      const otherProf  = rr.data?.profile || {};
      const otherLinks = getPath(otherProf, "links.connections", []);
      const backTypes  = counterpartTypesForDelete(rel.type);

      const filteredOther = otherLinks.filter(
        r => !(r.target_id === activeId && backTypes.includes(r.type))
      );

      await axios.patch(`/api/characters/${rel.target_id}`, {
        profile: setPathIn(otherProf, "links.connections", filteredOther)
      });
    } catch (e) { console.warn(e); }
  }, [activeId, profile]);

  // Autosave
  const saveTimer = useRef(null);
  const saveNow = useCallback(async () => {
    if (!activeId) return;
    const newName = draftFullName || "Neuer Charakter";
    try {
      await axios.patch(`/api/characters/${activeId}`, {
        name: newName,
        profile,
        age:          getPath(profile, "basic.age", null),
        gender:       getPath(profile, "basic.gender", null),
        residence:    getPath(profile, "basic.residence", null),
        nationality:  getPath(profile, "basic.nationality", null),
        nickname:     getPath(profile, "basic.nickname", null),
        religion:     getPath(profile, "basic.religion", null),
        hair_color:   getPath(profile, "appearance.hair_color", null),
        eye_color:    getPath(profile, "appearance.eye_color", null),
        traits:       getPath(profile, "personality.traits", null),
        backstory:    getPath(profile, "relations.family_background", null),
        skills:       getPath(profile, "skills.list", []),
        notes:        getPath(profile, "notes.text", null),
      });
      setLastSavedAt(new Date());
      setList(prev => prev.map(c => (c.id === activeId ? { ...c, name: newName } : c)));
    } catch (e) { console.warn("save failed", e); }
  }, [activeId, profile, draftFullName]);

  useEffect(() => {
    if (!activeId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(saveNow, 700);
    return () => clearTimeout(saveTimer.current);
  }, [activeId, profile, saveNow]);

  // Aktionen
  const addCharacter = async () => {
    try {
      const r = await axios.post(`/api/projects/${pid}/characters`, { name: "Neuer Charakter" });
      const c = r.data;
      setList(prev => [...prev, c]);
      setActiveId(c.id);
      setProfile({});
    } catch (e) {
      console.error(e);
      alert("Charakter konnte nicht angelegt werden.");
    }
  };
  const deleteCharacter = async (cid) => {
    if (!confirm("Charakter löschen?")) return;
    try {
      await axios.delete(`/api/characters/${cid}`);
      setList(prev => prev.filter(c => c.id !== cid));
      if (activeId === cid) {
        const next = list.find(c => c.id !== cid);
        setActiveId(next?.id ?? null);
      }
    } catch (e) {
      console.error(e);
      alert("Charakter konnte nicht gelöscht werden.");
    }
  };

  return (
    <div className="page-wrap characters-page">
      <aside className="side">
        <div className="tree">
          <div className="tree-head">
            <span className="tree-title">Charaktere</span>
            {/* NEU: Mindmap-Button in der Kopfzeile der Links-Navigation */}
            <button
              className="icon-btn"
              title="Mindmap (alle Beziehungen)"
              onClick={() => setShowWorldGraph(true)}
            >
              <TbTopologyStar3 />
            </button>
            <button className="icon-btn" title="Charakter hinzufügen" onClick={addCharacter}>
              <BsPlus />
            </button>
          </div>
          <ul className="tree-list">
            {list.map(ch => (
              <li key={ch.id} className={`tree-scene ${activeId === ch.id ? "active" : ""}`}>
                <div className="tree-row scene-row" onClick={() => setActiveId(ch.id)} title={displayNameForList(ch, activeId, draftFullName)}>
                  <span className="tree-dot" aria-hidden />
                  <span className="tree-name">{displayNameForList(ch, activeId, draftFullName)}</span>
                  <div className="row-actions" onClick={e => e.stopPropagation()}>
                    <button className="icon-btn danger" title="Löschen" onClick={() => deleteCharacter(ch.id)}>
                      <BsTrash />
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {!list.length && <li className="tree-empty">Noch keine Charaktere</li>}
          </ul>
        </div>
      </aside>

      <main className="main">
        {!activeId ? (
          <div className="panel" style={{ padding: "1rem" }}>
            <strong>Kein Charakter ausgewählt.</strong><br />
            <button className="btn btn-primary-quiet" onClick={addCharacter} style={{ marginTop: 8 }}>
              + Charakter anlegen
            </button>
          </div>
        ) : (
          <>
            <CharacterEditor
              characterId={activeId}
              profile={profile}
              onChangeProfilePath={onChangeProfilePath}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              lastSavedAt={lastSavedAt}
              allCharacters={list}
              onAddRelation={onAddRelation}
              onRemoveRelation={onRemoveRelation}
              onOpenGraph={()=>setShowGraph(true)}
            />
            <RelationsGraphModal
              open={showGraph}
              onClose={()=>setShowGraph(false)}
              activeId={activeId}
              profile={profile}
              allCharacters={list}
              onJumpToCharacter={(id) => setActiveId(id)}
            />
            <WorldGraphModal
              open={showWorldGraph}
              onClose={()=>setShowWorldGraph(false)}
              characters={list}
              activeId={activeId}
              onJumpToCharacter={(id) => { setActiveId(id); setShowWorldGraph(false); }}
            />
          </>
        )}
      </main>
    </div>
  );
}
