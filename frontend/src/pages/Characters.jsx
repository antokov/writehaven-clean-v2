import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
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
import { useTranslation } from "react-i18next";

/* ---------------- Beziehungen (i18n Labels, deutsche Werte bleiben gespeichert) ---------------- */
export const REL_OPTIONS = [
  { value: "Freundschaft",     key: "friendship" },
  { value: "Familie",          key: "family" },
  { value: "Feindschaft",      key: "enmity" },
  { value: "Mentor",           key: "mentor" },
  { value: "Schüler",          key: "student" },
  { value: "Geschäftspartner", key: "business_partner" },
  { value: "Konkurrenz",       key: "rivalry" },
  { value: "Liebesbeziehung",  key: "romance" },
];

// Falls andere Stellen noch REL_TYPES nutzen:
export const REL_TYPES = REL_OPTIONS.map(o => o.value);

export function relTypeLabel(type, t) {
  const opt = REL_OPTIONS.find(o => o.value === type);
  return opt ? t(`characters.relations.types.${opt.key}`) : type;
}

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

/** Get display name for character in list (i18n-aware) */
function displayNameForList(ch, activeId, draftFullName, unnamedLabel) {
  if (ch.id === activeId && draftFullName) {
    return draftFullName;
  }
  return ch.name || unnamedLabel;
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
  const firstName = (getPath(profile, "basic.first_name", "") || "").trim();
  const lastName  = (getPath(profile, "basic.last_name", "") || "").trim();
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  return "";
}

/** Tabs (Labels via i18n) */
const TABS = [
  { key: "basic",        labelKey: "characters.tabs.basic" },
  { key: "appearance",   labelKey: "characters.tabs.appearance" },
  { key: "personality",  labelKey: "characters.tabs.personality" },
  { key: "relations",    labelKey: "characters.tabs.background" },   // = Hintergrund
  { key: "skills",       labelKey: "characters.tabs.skills" },
  { key: "links",        labelKey: "characters.tabs.relationships" }, // = Beziehungen
  { key: "notes",        labelKey: "characters.tabs.notes" },
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
  const { t } = useTranslation();
  const [targetId, setTargetId] = useState("");
  const [type, setType] = useState(REL_OPTIONS[0].value);
  const [note, setNote] = useState("");
  const options = (allCharacters || []).filter(c => c.id !== currentId);

  return (
    <div style={{display:"grid", gridTemplateColumns:"1.5fr 1.2fr 1fr auto", gap:8}}>
      <select className="input" value={targetId} onChange={e=>setTargetId(Number(e.target.value))}>
        <option value="">{t('characters.relations.targetPlaceholder')}</option>
        {options.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <select className="input" value={type} onChange={e=>setType(e.target.value)}>
        {REL_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>
            {t(`characters.relations.types.${o.key}`)}
          </option>
        ))}
      </select>

      <input
        className="input"
        placeholder={t('characters.relations.notePlaceholder')}
        value={note}
        onChange={e=>setNote(e.target.value)}
      />
      <button className="btn" onClick={()=> targetId && onAdd({ target_id: targetId, type, note })}>
        {t('characters.relations.add')}
      </button>
    </div>
  );
}

function RelationList({ profile, allCharacters, onRemove }) {
  const { t } = useTranslation();
  const links = getPath(profile, "links.connections", []) || [];
  const validLinks = links.filter(r => allCharacters.find(c => c.id === r.target_id));

  if (!validLinks.length) return <div className="small muted">{t('characters.relations.none')}</div>;
  const nameOf = (id) => (allCharacters.find(c=>c.id===id)?.name) || `#${id}`;
  return (
    <ul style={{listStyle:"none", padding:0, margin:0, display:"grid", gap:8}}>
      {validLinks.map((r, idx) => (
        <li key={idx} className="panel" style={{padding:"8px 10px"}}>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            <div style={{flex: "0 0 auto", fontWeight: 600, color: "var(--brand)"}}>
              {relTypeLabel(r.type, t)}
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

/* ------------- Graph Modal (Ego-Netz) mit ReactFlow ------------- */
function RelationsGraphModal({ open, onClose, activeId, allCharacters, onJumpToCharacter }) {
  const { t } = useTranslation();
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !activeId) return;

    async function loadRelations() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/characters/${activeId}`);
        const charProfile = response.data?.profile || {};

        let rels = getPath(charProfile, "links.connections", []) || [];
        if (rels.length === 0 && charProfile.links) {
          if (Array.isArray(charProfile.links)) rels = charProfile.links;
        }

        const validRels = rels.filter(r => allCharacters.find(c => c.id === r.target_id));
        const nameOf = (id) => allCharacters.find(c => c.id === id)?.name || `#${id}`;
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
          const typeLabel = relTypeLabel(r.type, t);
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
  }, [open, activeId, allCharacters, t]);

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
      onJumpToCharacter(id);
      onClose();
    }
  }, [onJumpToCharacter, onClose]);

  if (!open) return null;

  if (loading) {
    return (
      <Modal open={open} onClose={onClose} title={t('characters.graph.title')}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#64748b",
          background: "#f8fafc"
        }}>
          {t('characters.graph.loading')}
        </div>
      </Modal>
    );
  }

  const hasRelations = edges.length > 0;

  return (
    <Modal open={open} onClose={onClose} title={t('characters.graph.title')}>
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
                {t('characters.graph.hint')}
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
            <div style={{ fontSize: 16, fontWeight: 500 }}>{t('characters.graph.emptyTitle')}</div>
            <div style={{ fontSize: 14, textAlign: "center", maxWidth: 400 }}>
              {t('characters.graph.emptySub')}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ------------- Radiale Beziehungs-Übersicht ------------- */
function WorldGraphModal({ open, onClose, characters, activeId, onJumpToCharacter }) {
  const { t } = useTranslation();
  const [relationData, setRelationData] = useState(null);

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

        const relMap = new Map();
        for (const p of profiles) {
          const rels = getPath(p.profile, "links.connections", []) || [];
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
      <Modal open={open} onClose={onClose} title={t('characters.worldGraph.title')}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#64748b",
          background: "#f8fafc"
        }}>
          {t('characters.worldGraph.loading')}
        </div>
      </Modal>
    );
  }

  const { profiles, relMap } = relationData;

  return (
    <Modal open={open} onClose={onClose} title={t('characters.worldGraph.title')}>
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
                      {t('characters.worldGraph.count', { count: relations.length })}
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
                        <span style={{ color: "#0ea5e9", fontWeight: 500, flexShrink: 0 }}>
                          {relTypeLabel(rel.type, t)}
                        </span>
                        <span style={{ color: "#64748b" }}>→</span>
                        <span style={{ color: "#0f172a", fontWeight: 500 }}>
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
                    {t('characters.worldGraph.none')}
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
  const { t } = useTranslation();
  return (
    <div className="panel" key={characterId}>
      <nav className="tabs tabs-inline">
        {TABS.map(ti => (
          <button
            key={ti.key}
            type="button"
            className={`tab ${activeTab === ti.key ? "active" : ""}`}
            onClick={() => setActiveTab(ti.key)}
          >
            {t(ti.labelKey)}
          </button>
        ))}
        <div className="tabs-meta">
          {lastSavedAt ? <>{t('common.saved', { time: lastSavedAt.toLocaleTimeString() })}</> : "—"}
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
        <div className="dynamic-fields-tab">
          <div className="fields-grid">
            <div className="dynamic-field">
              <label className="dynamic-field-label">
                <span>{t('characters.skills.label')}</span>
              </label>
              <div className="dynamic-field-input-wrapper">
                <textarea
                  className="input textarea"
                  placeholder={t('characters.skills.placeholder')}
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
              </div>
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
                      title={t('common.delete')}
                    >×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "personality" && (
        <DynamicFieldsTab
          fieldConfig={PERSONALITY_FIELDS}
          profile={profile}
          onChangeProfilePath={onChangeProfilePath}
          getPath={getPath}
        />
      )}

      {activeTab === "links" && (
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label className="small muted">{t('characters.relations.new')}</label>
            <RelationEditor
              currentId={characterId}
              allCharacters={allCharacters}
              onAdd={onAddRelation}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label className="small muted">{t('characters.relations.existing')}</label>
            <RelationList
              profile={profile}
              allCharacters={allCharacters}
              onRemove={onRemoveRelation}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 8 }}>
            <button
              type="button"
              onClick={onOpenGraph}
              title={t('characters.graph.open')}
              aria-label={t('characters.graph.open')}
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
      )}

      {activeTab === "relations" && (
        <DynamicFieldsTab
          fieldConfig={BACKGROUND_FIELDS}
          profile={profile}
          onChangeProfilePath={onChangeProfilePath}
          getPath={getPath}
        />
      )}

      {activeTab === "notes" && (
        <div className="dynamic-fields-tab">
          <div className="fields-grid">
            <div className="dynamic-field">
              <label className="dynamic-field-label">
                <span>{t('characters.notes.label')}</span>
              </label>
              <div className="dynamic-field-input-wrapper">
                <textarea
                  className="input textarea"
                  value={getPath(profile, "notes.text", "")}
                  onChange={e => onChangeProfilePath("notes.text", e.target.value)}
                  rows={10}
                />
              </div>
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
  const { state } = useLocation();
  const { t } = useTranslation();
  const pid = Number(id);

  const [list, setList] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [profile, setProfile] = useState({});
  const [activeTab, setActiveTab] = useState("basic");
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  const [showWorldGraph, setShowWorldGraph] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);

  const saveTimer = useRef(null);
  const isLoadingRef = useRef(false);
  const hasHandledNewCharacter = useRef(false);

  const draftFullName = useMemo(() => fullNameFromProfile(profile), [profile]);

  useEffect(() => {
    let cancel = false;
    async function load() {
      try {
        const r = await axios.get(`/api/projects/${pid}/characters`);
        if (cancel) return;
        const items = r.data || [];
        setList(items);

        const newCharId = state?.newCharacterId;
        if (newCharId && items.find(c => c.id === newCharId) && !hasHandledNewCharacter.current) {
          hasHandledNewCharacter.current = true;
          setActiveId(newCharId);
          return;
        }

        if (!activeId && items.length) {
          setActiveId(items[0].id);
        }
      } catch (e) { console.warn(e); }
    }
    if (pid) load();
    return () => { cancel = true; };
  }, [pid, activeId, state?.newCharacterId]);

  useEffect(() => {
    if (!activeId) { setProfile({}); return; }
    let cancel = false;

    async function loadOne() {
      isLoadingRef.current = true;
      try {
        const r = await axios.get(`/api/characters/${activeId}`);
        if (cancel) return;
        const loadedProfile = r.data?.profile;
        if (loadedProfile && typeof loadedProfile === 'object') {
          setProfile(loadedProfile);
        } else {
          setProfile({});
        }
      } catch (e) {
        console.warn('Fehler beim Laden des Charakters:', e);
      } finally {
        isLoadingRef.current = false;
      }
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
  const saveNow = useCallback(async () => {
    if (!activeId) return;
    if (isLoadingRef.current) return;

    const newName = draftFullName || t('characters.newCharacter');
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
  }, [activeId, profile, draftFullName, t]);

  useEffect(() => {
    if (!activeId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(saveNow, 700);
    return () => clearTimeout(saveTimer.current);
  }, [activeId, profile, saveNow]);

  const addCharacter = async () => {
    try {
      const r = await axios.post(`/api/projects/${pid}/characters`, { name: t('characters.newCharacter') });
      const c = r.data;
      setList(prev => [...prev, c]);
      setActiveId(c.id);
      setProfile({});
    } catch (e) {
      console.error(e);
      alert(t('characters.errors.createFailed'));
    }
  };

  const deleteCharacter = async (cid) => {
    const character = list.find(c => c.id === cid);
    setConfirmModal({
      title: t('characters.delete.title'),
      message: t('characters.delete.message', { name: character?.name || t('characters.unnamed') }),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      variant: 'danger',
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await axios.delete(`/api/characters/${cid}`);
          setList(prev => prev.filter(c => c.id !== cid));
          if (activeId === cid) {
            const next = list.find(c => c.id !== cid);
            setActiveId(next?.id ?? null);
          }
        } catch (e) {
          console.error(e);
          alert(t('characters.errors.deleteFailed'));
        }
      },
      onCancel: () => setConfirmModal(null)
    });
  };

  const unnamed = t('characters.unnamed');

  return (
    <div className="page-wrap characters-page">
      <aside className="side">
        <div className="tree">
          <div className="tree-head">
            <span className="tree-title">{t('characters.title')}</span>
            <button
              className="icon-btn"
              title={t('characters.worldGraph.open')}
              onClick={() => setShowWorldGraph(true)}
            >
              <TbTopologyStar3 />
            </button>
            <button className="icon-btn" title={t('characters.add')} onClick={addCharacter}>
              <BsPlus />
            </button>
          </div>
          <ul className="tree-list">
            {list.map(ch => (
              <li key={ch.id} className={`tree-scene ${activeId === ch.id ? "active" : ""}`}>
                <div
                  className="tree-row scene-row"
                  onClick={() => setActiveId(ch.id)}
                  title={displayNameForList(ch, activeId, draftFullName, unnamed)}
                >
                  <span className="tree-dot" aria-hidden />
                  <span className="tree-name">{displayNameForList(ch, activeId, draftFullName, unnamed)}</span>
                  <div className="row-actions" onClick={e => e.stopPropagation()}>
                    <button className="icon-btn danger" title={t('common.delete')} onClick={() => deleteCharacter(ch.id)}>
                      <BsTrash />
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {!list.length && <li className="tree-empty">{t('characters.empty')}</li>}
          </ul>
        </div>
      </aside>

      <main className="main">
        {!activeId ? (
          <div className="panel" style={{ padding: "1rem" }}>
            <strong>{t('characters.noneSelected')}</strong><br />
            <button className="btn btn-primary-quiet" onClick={addCharacter} style={{ marginTop: 8 }}>
              + {t('characters.add')}
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

      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
}
