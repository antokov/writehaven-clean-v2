import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { BsPlus, BsTrash, BsChevronDown, BsChevronRight } from 'react-icons/bs'

export default function ProjectView() {
  const { id } = useParams()
  const pid = Number(id)

  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState(null)
  const [chapters, setChapters] = useState([])
  const [scenesByChapter, setScenesByChapter] = useState({})

  const [activeChapterId, setActiveChapterId] = useState(null)
  const [activeSceneId, setActiveSceneId] = useState(null)

  // Editor (Szene)
  const [sceneTitle, setSceneTitle] = useState('')
  const [sceneContent, setSceneContent] = useState('')
  const [lastSavedAt, setLastSavedAt] = useState(null)

  // Kapitel-Übersicht / -Titel
  const [chapterTitle, setChapterTitle] = useState('')
  const [lastChapterSavedAt, setLastChapterSavedAt] = useState(null)

  // Tree
  const [expanded, setExpanded] = useState({}) // { [chapterId]: true }

  // Autosave & Snapshot (Szene)
  const saveTimer = useRef(null)
  const snapshotRef = useRef({ id: null, title: '', content: '' })

  // Debounce (Kapitel)
  const chapterSaveTimer = useRef(null)

  // Race-Schutz für Szenen-Detail-Loads
  const sceneLoadToken = useRef(0)

  // Vorschau-Cache (Szene-ID -> Text)
  const [scenePreviewById, setScenePreviewById] = useState({})

  /* ----------------------------- Helpers -------------------------------- */
  function clearEditor() {
    setActiveSceneId(null)
    setSceneTitle('')
    setSceneContent('')
    snapshotRef.current = { id: null, title: '', content: '' }
  }

  // exakt ein Kapitel expandieren
  function expandOnly(chapterId) {
    if (chapterId) setExpanded({ [chapterId]: true })
    else setExpanded({})
  }

  function patchSceneInTree(chapterId, sceneId, patch) {
    setScenesByChapter(prev => {
      const arr = prev[chapterId]
      if (!arr) return prev
      const idx = arr.findIndex(s => s.id === sceneId)
      if (idx < 0) return prev
      const nextArr = arr.slice()
      nextArr[idx] = { ...nextArr[idx], ...patch }
      return { ...prev, [chapterId]: nextArr }
    })
  }

  function patchChapterInList(chapterId, patch) {
    setChapters(prev => {
      const idx = prev.findIndex(c => c.id === chapterId)
      if (idx < 0) return prev
      const next = prev.slice()
      next[idx] = { ...next[idx], ...patch }
      return next
    })
  }

  /* --------------------------- Initial Load ----------------------------- */
  useEffect(() => {
    let cancel = false
    async function loadAll() {
      setLoading(true)
      try {
        const [p, ch] = await Promise.all([
          axios.get(`/api/projects/${pid}`),
          axios.get(`/api/projects/${pid}/chapters`)
        ])
        if (cancel) return

        setProject(p.data)
        const chs = ch.data || []
        setChapters(chs)

        if (chs.length) {
          const chapterId = chs[0].id
          setActiveChapterId(chapterId)
          setChapterTitle(chs[0].title || '')
          expandOnly(chapterId)

          const r = await axios.get(`/api/chapters/${chapterId}/scenes`)
          if (cancel) return
          const scenes = r.data || []
          setScenesByChapter(prev => ({ ...prev, [chapterId]: scenes }))
          clearEditor() // Start in der Kapitel-Übersicht
        } else {
          setActiveChapterId(null)
          expandOnly(null)
          clearEditor()
        }
      } catch (err) {
        console.error('Load failed', err)
        alert(err?.response?.status === 404
          ? 'Projekt nicht gefunden. Bitte zuerst ein Projekt anlegen.'
          : 'Laden fehlgeschlagen. Bitte später erneut versuchen.')
      } finally {
        if (!cancel) setLoading(false)
      }
    }
    loadAll()
    return () => { cancel = true }
  }, [pid])

  /* --------------------------- Szene speichern -------------------------- */
  async function saveSceneNow(id, title, content) {
    if (!id) return
    try {
      await axios.put(`/api/scenes/${id}`, { title, content })
      snapshotRef.current = { id, title, content }
      setLastSavedAt(new Date())
      if (activeChapterId) patchSceneInTree(activeChapterId, id, { title })
      const txt = (content || '').replace(/\s+/g, ' ').trim()
      setScenePreviewById(prev => ({ ...prev, [id]: txt }))
    } catch (err) {
      console.warn('Save failed', err)
    }
  }

  async function flushIfDirty() {
    const snap = snapshotRef.current
    if (activeSceneId && (sceneTitle !== snap.title || sceneContent !== snap.content)) {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      await saveSceneNow(activeSceneId, sceneTitle, sceneContent)
    }
  }

  function scheduleSceneAutosave() {
    const snap = snapshotRef.current
    if (!activeSceneId) return
    const changed =
      activeSceneId !== snap.id || sceneTitle !== snap.title || sceneContent !== snap.content
    if (!changed) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveSceneNow(activeSceneId, sceneTitle, sceneContent)
    }, 600)
  }

  useEffect(() => {
    scheduleSceneAutosave()
    return () => clearTimeout(saveTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSceneId, sceneTitle, sceneContent])

  useEffect(() => {
    if (!activeSceneId) return
    const txt = (sceneContent || '').replace(/\s+/g, ' ').trim()
    setScenePreviewById(prev => ({ ...prev, [activeSceneId]: txt }))
  }, [activeSceneId, sceneContent])

  useEffect(() => {
    return () => {
      const snap = snapshotRef.current
      if (activeSceneId && (sceneTitle !== snap.title || sceneContent !== snap.content)) {
        saveSceneNow(activeSceneId, sceneTitle, sceneContent)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ----------------------- Kapitel speichern (Titel) --------------------- */
  async function saveChapterNow(chapterId, title) {
    if (!chapterId) return
    try {
      await axios.put(`/api/chapters/${chapterId}`, { title })
      setLastChapterSavedAt(new Date())
      patchChapterInList(chapterId, { title })
    } catch (err) {
      console.warn('Chapter save failed', err)
    }
  }

  useEffect(() => {
    if (!activeChapterId) return
    if (chapterSaveTimer.current) clearTimeout(chapterSaveTimer.current)
    chapterSaveTimer.current = setTimeout(() => {
      saveChapterNow(activeChapterId, chapterTitle)
    }, 500)
    return () => clearTimeout(chapterSaveTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChapterId, chapterTitle])

  /* ----------------------- Szenen-Previews laden ------------------------ */
  async function ensurePreviews(chapterId) {
    const list = scenesByChapter[chapterId] || []
    const missing = list.filter(s => scenePreviewById[s.id] === undefined)
    if (!missing.length) return
    try {
      const results = await Promise.all(
        missing.map(s => axios.get(`/api/scenes/${s.id}`))
      )
      setScenePreviewById(prev => {
        const next = { ...prev }
        results.forEach((r, i) => {
          const sc = r.data || {}
          const txt = (sc.content || '').replace(/\s+/g, ' ').trim()
          next[missing[i].id] = txt
        })
        return next
      })
    } catch (err) {
      console.warn('Preview fetch failed', err)
    }
  }

  useEffect(() => {
    if (activeChapterId && !activeSceneId) {
      ensurePreviews(activeChapterId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChapterId, activeSceneId, scenesByChapter])

  /* -------------------------- Scene open (Detail) ----------------------- */
  async function openScene(chapterId, sceneId) {
    await flushIfDirty()
    setActiveChapterId(chapterId)
    expandOnly(chapterId)

    const token = ++sceneLoadToken.current
    try {
      const r = await axios.get(`/api/scenes/${sceneId}`)
      if (sceneLoadToken.current !== token) return
      const s = r.data || {}
      setActiveSceneId(s.id)
      setSceneTitle(s.title || '')
      setSceneContent(s.content || '')
      snapshotRef.current = { id: s.id, title: s.title || '', content: s.content || '' }
      patchSceneInTree(chapterId, s.id, { title: s.title || '' })
      const txt = (s.content || '').replace(/\s+/g, ' ').trim()
      setScenePreviewById(prev => ({ ...prev, [s.id]: txt }))
    } catch (err) {
      console.error('Scene load failed', err)
      alert('Szene konnte nicht geladen werden.')
    }
  }

  /* ----------------------- Kapitel / Szene Aktionen --------------------- */
  async function addChapter() {
    try {
      const r = await axios.post(`/api/projects/${pid}/chapters`, {
        title: `Kapitel ${chapters.length + 1}`,
        order_index: chapters.length
      })
      const newCh = [...chapters, r.data]
      setChapters(newCh)
      setActiveChapterId(r.data.id)
      setChapterTitle(r.data.title || '')
      setScenesByChapter(prev => ({ ...prev, [r.data.id]: [] }))
      expandOnly(r.data.id)
      clearEditor()
    } catch (err) {
      console.error(err)
      alert('Kapitel konnte nicht angelegt werden.')
    }
  }

  async function addSceneForChapter(chapterId) {
    const cur = scenesByChapter[chapterId] || []
    try {
      await flushIfDirty()
      const r = await axios.post(`/api/chapters/${chapterId}/scenes`, {
        title: `Szene ${cur.length + 1}`,
        order_index: cur.length
      })
      const updated = { ...scenesByChapter, [chapterId]: [...cur, r.data] }
      setScenesByChapter(updated)
      expandOnly(chapterId)
      setScenePreviewById(prev => ({ ...prev, [r.data.id]: '' }))
      await openScene(chapterId, r.data.id)
    } catch (err) {
      console.error(err)
      alert('Szene konnte nicht angelegt werden.')
    }
  }

  async function deleteChapter(chapterId) {
    if (!confirm('Kapitel und alle zugehörigen Szenen löschen?')) return
    try {
      await axios.delete(`/api/chapters/${chapterId}`)
      const newChapters = chapters.filter(c => c.id !== chapterId)
      setChapters(newChapters)
      setScenesByChapter(prev => {
        const copy = { ...prev }
        delete copy[chapterId]
        return copy
      })
      if (activeChapterId === chapterId) {
        if (newChapters.length) {
          const next = newChapters[0]
          const r = await axios.get(`/api/chapters/${next.id}/scenes`)
          setScenesByChapter(prev => ({ ...prev, [next.id]: r.data || [] }))
          setActiveChapterId(next.id)
          setChapterTitle(next.title || '')
          expandOnly(next.id)
          clearEditor()
        } else {
          setActiveChapterId(null)
          setChapterTitle('')
          expandOnly(null)
          clearEditor()
        }
      } else {
        // falls ein anderes Kapitel gelöscht wurde, sicherstellen dass nur das aktive offen ist
        expandOnly(activeChapterId)
      }
    } catch (err) {
      console.error(err)
      alert('Kapitel konnte nicht gelöscht werden.')
    }
  }

  async function deleteScene(sceneId, chapterId) {
    if (!confirm('Szene löschen?')) return
    try {
      await axios.delete(`/api/scenes/${sceneId}`)
      const list = scenesByChapter[chapterId] || []
      const filtered = list.filter(s => s.id !== sceneId)
      setScenesByChapter(prev => ({ ...prev, [chapterId]: filtered }))
      setScenePreviewById(prev => {
        const next = { ...prev }; delete next[sceneId]; return next
      })
      if (activeSceneId === sceneId) {
        clearEditor()
      }
    } catch (err) {
      console.error(err)
      alert('Szene konnte nicht gelöscht werden.')
    }
  }

  async function loadScenesForChapter(chapterId) {
    try {
      const r = await axios.get(`/api/chapters/${chapterId}/scenes`)
      const scenes = r.data || []
      setScenesByChapter(prev => ({ ...prev, [chapterId]: scenes }))
    } catch (err) {
      console.error(err)
      alert('Szenen konnten nicht geladen werden.')
    }
  }

  // Kapitel-Klick → Überblick, nur dieses Kapitel offen
  async function onSelectChapter(chapterId) {
    await flushIfDirty()
    setActiveChapterId(chapterId)
    const ch = chapters.find(c => c.id === chapterId)
    setChapterTitle(ch?.title || '')
    if (!scenesByChapter[chapterId]) await loadScenesForChapter(chapterId)
    expandOnly(chapterId)
    clearEditor()
  }

  function onSelectScene(chapterId, scene) {
    openScene(chapterId, scene.id)
  }

  /* ------------------------------- Render ------------------------------- */
  if (loading) {
    return <div className="page-wrap"><div className="panel"><h3>Lade…</h3></div></div>
  }

  const scenesOfActive = activeChapterId ? (scenesByChapter[activeChapterId] || []) : []

  return (
    <div className="page-wrap">
      <aside className="side">
        <div className="tree">
          <div className="tree-head">
            <span className="tree-title">Struktur</span>
            <button className="icon-btn" title="Kapitel hinzufügen" onClick={addChapter}>
              <BsPlus />
            </button>
          </div>

          <ul className="tree-list">
            {chapters.map(ch => {
              const open = !!expanded[ch.id]
              const scenes = scenesByChapter[ch.id] || []
              return (
                <li key={ch.id} className={`tree-chapter ${activeChapterId === ch.id ? 'active' : ''}`}>
                  <div className="tree-row chapter-row" onClick={() => onSelectChapter(ch.id)}>
                    <button
                      className="icon-btn caret"
                      onClick={async (e) => {
                        e.stopPropagation()
                        // Caret fokussiert dieses Kapitel, alle anderen zu
                        if (!scenesByChapter[ch.id]) await loadScenesForChapter(ch.id)
                        setActiveChapterId(ch.id)
                        setChapterTitle(ch.title || '')
                        expandOnly(ch.id)
                        clearEditor()
                      }}
                      title={open ? 'Kapitel anzeigen' : 'Kapitel anzeigen'}
                    >
                      {open ? <BsChevronDown /> : <BsChevronRight />}
                    </button>

                    <span className="tree-name">{ch.title}</span>

                    <div className="row-actions" onClick={e => e.stopPropagation()}>
                      <button className="icon-btn" title="Szene hinzufügen" onClick={() => addSceneForChapter(ch.id)}>
                        <BsPlus />
                      </button>
                      <button className="icon-btn danger" title="Kapitel löschen" onClick={() => deleteChapter(ch.id)}>
                        <BsTrash />
                      </button>
                    </div>
                  </div>

                  {open && (
                    <ul className="tree-scenes">
                      {scenes.map(s => (
                        <li key={s.id} className={`tree-scene ${activeSceneId === s.id ? 'active' : ''}`}>
                          <div className="tree-row scene-row" onClick={() => onSelectScene(ch.id, s)}>
                            <span className="tree-dot" aria-hidden />
                            <span className="tree-name">{s.title}</span>
                            <div className="row-actions" onClick={e => e.stopPropagation()}>
                              <button className="icon-btn danger" title="Szene löschen" onClick={() => deleteScene(s.id, ch.id)}>
                                <BsTrash />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                      {!scenes.length && <li className="tree-empty">Keine Szenen</li>}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      <main className="main">
        <div className="panel">
          {/* Modus 1: Szene geöffnet → Editor */}
          {activeSceneId ? (
            <>
              <div style={{display:'flex', alignItems:'center', gap:'.6rem', marginBottom:'.6rem'}}>
                <input
                  className="scene-title"
                  value={sceneTitle}
                  onChange={(e) => {
                    const v = e.target.value
                    setSceneTitle(v)
                    if (activeChapterId && activeSceneId) {
                      patchSceneInTree(activeChapterId, activeSceneId, { title: v })
                    }
                  }}
                  onBlur={() => saveSceneNow(activeSceneId, sceneTitle, sceneContent)}
                  placeholder="Szenen-Titel"
                />
                <div style={{marginLeft:'auto', fontSize:12, color:'var(--muted)'}}>
                  {lastSavedAt ? <>Gespeichert {lastSavedAt.toLocaleTimeString()}</> : '—'}
                </div>
              </div>
              <textarea
                className="scene-editor"
                value={sceneContent}
                onChange={(e) => setSceneContent(e.target.value)}
                onBlur={() => saveSceneNow(activeSceneId, sceneTitle, sceneContent)}
                placeholder="Dein Text…"
              />
            </>
          ) : (
          // Modus 2: Kapitel-Übersicht
          activeChapterId ? (
            <ChapterOverview
              chapterTitle={chapterTitle}
              setChapterTitle={(v) => { setChapterTitle(v); patchChapterInList(activeChapterId, { title: v }) }}
              lastChapterSavedAt={lastChapterSavedAt}
              saveChapter={() => saveChapterNow(activeChapterId, chapterTitle)}
              scenesOfActive={scenesOfActive}
              scenePreviewById={scenePreviewById}
              openScene={(sceneId) => openScene(activeChapterId, sceneId)}
              deleteScene={(sceneId) => deleteScene(sceneId, activeChapterId)}
              addScene={() => addSceneForChapter(activeChapterId)}
            />
          ) : (
            // Modus 3: Gar kein Kapitel
            <div className="empty-state">
              <div className="empty-title">Kein Kapitel vorhanden.</div>
              <div className="empty-sub">Lege zuerst ein Kapitel an.</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

/* Ausgelagerter Überblicks-Block für bessere Lesbarkeit */
function ChapterOverview({
  chapterTitle, setChapterTitle, lastChapterSavedAt, saveChapter,
  scenesOfActive, scenePreviewById, openScene, deleteScene, addScene
}) {
  return (
    <div className="chapter-overview">
      <div className="chapter-head">
        <input
          className="chapter-title-input"
          value={chapterTitle}
          onChange={(e) => setChapterTitle(e.target.value)}
          onBlur={saveChapter}
          placeholder="Kapitel-Titel"
        />
        <div className="chapter-meta">
          {lastChapterSavedAt ? <>Gespeichert {lastChapterSavedAt.toLocaleTimeString()}</> : ' '}
        </div>
      </div>

      {scenesOfActive.length ? (
        <div className="scene-grid">
          {scenesOfActive.map(s => {
            const preview = scenePreviewById[s.id] ?? ''
            return (
              <div
                key={s.id}
                className="scene-card"
                role="button"
                onClick={() => openScene(s.id)}
                title={s.title}
              >
                <div className="scene-card-delete">
                  <button
                    className="icon-btn danger"
                    title="Szene löschen"
                    onClick={(e) => { e.stopPropagation(); deleteScene(s.id) }}
                  >
                    <BsTrash />
                  </button>
                </div>
                <div className="scene-card-title">{s.title}</div>
                <div className="scene-card-preview">
                  {preview ? preview : <span className="muted">Kein Inhalt</span>}
                </div>
              </div>
            )
          })}
          {/* „Neue Szene“ als Kachel am Ende der letzten Reihe */}
          <button className="scene-card add-card" onClick={addScene} title="Szene hinzufügen">
            <BsPlus className="icon" />
            <span>Szene hinzufügen</span>
          </button>
        </div>
      ) : (
        <div className="overview-empty">
          <div className="empty-title">Noch keine Szenen.</div>
          <div className="empty-sub">Lege die erste an.</div>
          <button className="btn btn-cta" onClick={addScene}>
            <BsPlus className="icon" /> Szene hinzufügen
          </button>
        </div>
      )}
    </div>
  )
}
