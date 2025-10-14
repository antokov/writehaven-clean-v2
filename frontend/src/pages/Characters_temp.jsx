import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BsPlus, BsTrash } from "react-icons/bs";
import { TbNetwork, TbTopologyStar3 } from "react-icons/tb";
import { createPortal } from "react-dom";
import axios from "axios";

import ConfirmModal from "../components/ConfirmModal";
import DynamicFieldsTab from "../components/DynamicFieldsTab";
import { BASIC_FIELDS, APPEARANCE_FIELDS, PERSONALITY_FIELDS, BACKGROUND_FIELDS } from "../config/characterFields";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MarkerType,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

// Relationship types and their reciprocal mappings
const REL_TYPES = [
  "Freundschaft",
  "Familie",
  "Feindschaft",
  "Mentor",
  "Schüler",
  "Geschäftspartner",
  "Konkurrenz",
  "Liebesbeziehung"
];

const RECIPROCAL = {
  "Freundschaft": "Freundschaft",
  "Familie": "Familie",
  "Feindschaft": "Feindschaft",
  "Mentor": "Schüler",
  "Schüler": "Mentor",
  "Geschäftspartner": "Geschäftspartner",
  "Konkurrenz": "Konkurrenz",
  "Liebesbeziehung": "Liebesbeziehung"
};

/** Safely get a value from an object using a path string */
function getPath(obj, path, defaultValue = undefined) {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result === undefined || result === null || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }
  return result === undefined ? defaultValue : result;
}

/** Set a value in an object using a path string (returns new object) */
function setPathIn(obj, path, val) {
  const parts = path.split(".");
  const next = { ...(obj || {}) };
  let cur = next;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    cur[k] = { ...(cur[k] || {}) };
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = val;
  return next;
}

/** Remove duplicates from array based on key function */
function uniqBy(arr, keyFn) {
  const seen = new Set();
  return arr.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Get display name for character in list */
function displayNameForList(ch, activeId, draftFullName) {
  if (ch.id === activeId && draftFullName && draftFullName !== "Unbenannt") {
    return draftFullName;
  }
  return ch.name || "Unbenannt";
}

/** Get reciprocal relation types for deletion */
function counterpartTypesForDelete(type) {
  const reciprocal = RECIPROCAL[type];
  if (reciprocal === type) {
    return [type];
  }
  return [reciprocal];
}

/** Name from profile */
function fullNameFromProfile(profile) {
  const firstName = getPath(profile, "basic.first_name", "").trim();
  const lastName = getPath(profile, "basic.last_name", "").trim();
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  return "Unbenannt";
}

/** Tabs */
const TABS = [
  { key: "basic",        label: "Grunddaten" },
  { key: "appearance",   label: "Äußeres" },
  { key: "personality",  label: "Persönlichkeit" },
  { key: "relations",    label: "Hintergrund" },
  { key: "skills",       label: "Fähigkeiten" },
  { key: "links",        label: "Beziehungen" },
  { key: "notes",        label: "Notizen" },
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
function RelationEditor({ currentId, allCharacters, onAdd }) {
  const [targetId, setTargetId] = useState("");
  const [type, setType] = useState(REL_TYPES[0]);
  const [note, setNote] = useState("");
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
  // Filtere Beziehungen zu gelöschten Charakteren heraus
  const validLinks = links.filter(r => allCharacters.find(c => c.id === r.target_id));

  if (!validLinks.length) return <div className="small muted">Keine Verbindungen</div>;
  const nameOf = (id) => (allCharacters.find(c=>c.id===id)?.name) || `#${id}`;
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
function RelationsGraphModal({ open, onClose, activeId, allCharacters, onJumpToCharacter }) {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lade Beziehungen direkt aus der API
  useEffect(() => {
    if (!open || !activeId) return;

    async function loadRelations() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/characters/${activeId}`);
        const charProfile = response.data?.profile || {};

        console.log("Vollständiges Profil:", charProfile);
        console.log("Links-Objekt:", charProfile.links);

        // Versuche verschiedene mögliche Pfade
        let rels = getPath(charProfile, "links.connections", []) || [];

        if (rels.length === 0 && charProfile.links) {
          // Fallback: Schaue ob links direkt ein Array ist
          if (Array.isArray(charProfile.links)) {
            rels = charProfile.links;
          }
        }

        console.log("Gefundene Beziehungen:", rels);

        // Filtere Beziehungen zu gelöschten Charakteren heraus
        const validRels = rels.filter(r => allCharacters.find(c => c.id === r.target_id));
        console.log("Valide Beziehungen (nach Filter):", validRels);

        const nameOf = (id) => allCharacters.find(c => c.id === id)?.name || `#${id}`;
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

        console.log("Graph-Daten erstellt - Nodes:", nodes.length, "Edges:", edges.length);
        setGraphData({ nodes, edges });
      } catch (error) {
        console.error("Fehler beim Laden der Beziehungen:", error);
        setGraphData({ nodes: [], edges: [] });
      } finally {
        setLoading(false);
      }
    }

    loadRelations();
  }, [open, activeId, allCharacters]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update nodes and edges when graphData changes
  useEffect(() => {
    if (graphData) {
      console.log("Setze Nodes und Edges:", graphData.nodes.length, graphData.edges.length);
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
    }
  }, [graphData, setNodes, setEdges]);

  const onNodeClick = useCallback((_event, node) => {
    const id = Number(node.id);
    console.log("Node geklickt:", id, "Aktuell:", activeId);
    if (id) {
      onJumpToCharacter(id);
      onClose();
    }
  }, [activeId, onJumpToCharacter, onClose]);

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
                Klicke auf einen Charakter um zu seinem Profil zu springen
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

/* ------------- Radiale Beziehungs-Übersicht ------------- */
function WorldGraphModal({ open, onClose, characters, activeId, onJumpToCharacter }) {
  const [relationData, setRelationData] = useState(null);

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

        // Gruppiere alle Beziehungen nach Charakteren
        const relMap = new Map();
        for (const p of profiles) {
          const rels = getPath(p.profile, "links.connections", []) || [];
          // Filtere nur Beziehungen zu existierenden Charakteren
          const validRels = rels
            .filter(r => profiles.find(pr => pr.id === r.target_id))
            .map(r => ({
              targetId: r.target_id,
              targetName: profiles.find(pr => pr.id === r.target_id)?.name || `#${r.target_id}`,
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
  }, [open, characters]);

  if (!open) return null;

  if (!relationData) {
    return (
      <Modal open={open} onClose={onClose} title="Beziehungsübersicht – alle Charaktere">
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
    <Modal open={open} onClose={onClose} title="Beziehungsübersicht – alle Charaktere">
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
                onClick={() => onJumpToCharacter(p.id)}
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
                    {p.name}
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
                          onJumpToCharacter(rel.targetId);
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
        <DynamicFieldsTab
          fieldConfig={BASIC_FIELDS}
          profile={profile}
          onChangeProfilePath={onChangeProfilePath}
          getPath={getPath}
        />
      )}

      {activeTab === "appearance" && (
        <DynamicFieldsTab
          fieldConfig={APPEARANCE_FIELDS}
          profile={profile}
          onChangeProfilePath={onChangeProfilePath}
          getPath={getPath}
        />
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
                    const skillText = val.slice(0, -1).trim();
                    if (skillText) {
                      const currentSkills = getPath(profile, "skills.list", []);
                      const updatedSkills = Array.from(new Set([...currentSkills, skillText]));
                      onChangeProfilePath("skills.list", updatedSkills);
                      onChangeProfilePath("skills.input", "");
                    }
                  } else {
                    onChangeProfilePath("skills.input", val);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
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

