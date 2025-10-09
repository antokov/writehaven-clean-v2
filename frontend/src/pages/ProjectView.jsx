import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export default function ProjectView() {
  const { id } = useParams()
  const pid = Number(id)

  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState(null)
  const [chapters, setChapters] = useState([])
  const [scenesByChapter, setScenesByChapter] = useState({})

  const [activeChapterId, setActiveChapterId] = useState(null)
  const [activeSceneId, setActiveSceneId] = useState(null)

  const [sceneTitle, setSceneTitle] = useState('')
  const [sceneContent, setSceneContent] = useState('')

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
        setChapters(ch.data || [])

        if ((ch.data || []).length) {
          const chapterId = ch.data[0].id
          setActiveChapterId(chapterId)
          const r = await axios.get(`/api/chapters/${chapterId}/scenes`)
          if (cancel) return
          setScenesByChapter(prev => ({ ...prev, [chapterId]: r.data || [] }))

          if ((r.data || []).length) {
            const s = r.data[0]
            setActiveSceneId(s.id)
            setSceneTitle(s.title || '')
            setSceneContent(s.content || '')
          }
        }
      } catch (err) {
        if (err?.response?.status === 404) {
          alert('Projekt nicht gefunden. Bitte zuerst ein Projekt anlegen.')
        } else {
          console.error('Load failed', err)
          alert('Laden fehlgeschlagen. Bitte später erneut versuchen.')
        }
      } finally {
        if (!cancel) setLoading(false)
      }
    }
    loadAll()
    return () => { cancel = true }
  }, [pid])

  useEffect(() => {
    if (!activeSceneId) return
    const t = setTimeout(async () => {
      try {
        await axios.put(`/api/scenes/${activeSceneId}`, {
          title: sceneTitle,
          content: sceneContent
        })
      } catch (err) {
        console.warn('Autosave failed', err)
      }
    }, 600)
    return () => clearTimeout(t)
  }, [activeSceneId, sceneTitle, sceneContent])

  async function addChapter() {
    try {
      const r = await axios.post(`/api/projects/${pid}/chapters`, {
        title: `Kapitel ${chapters.length + 1}`,
        order_index: chapters.length
      })
      const newChapters = [...chapters, r.data]
      setChapters(newChapters)
      setActiveChapterId(r.data.id)
      setScenesByChapter(prev => ({ ...prev, [r.data.id]: [] }))
      setActiveSceneId(null)
      setSceneTitle('')
      setSceneContent('')
    } catch (err) {
      console.error(err)
      alert('Kapitel konnte nicht angelegt werden.')
    }
  }

  async function addScene() {
    if (!activeChapterId) return
    const cur = scenesByChapter[activeChapterId] || []
    try {
      const r = await axios.post(`/api/chapters/${activeChapterId}/scenes`, {
        title: `Szene ${cur.length + 1}`,
        order_index: cur.length
      })
      const updated = { ...scenesByChapter, [activeChapterId]: [...cur, r.data] }
      setScenesByChapter(updated)
      setActiveSceneId(r.data.id)
      setSceneTitle(r.data.title || '')
      setSceneContent(r.data.content || '')
    } catch (err) {
      if (err?.response?.status === 404) {
        alert('Kapitel existiert nicht (mehr). Bitte Seite neu laden.')
      } else {
        console.error(err)
        alert('Szene konnte nicht angelegt werden.')
      }
    }
  }

  async function loadScenesForChapter(chapterId) {
    try {
      const r = await axios.get(`/api/chapters/${chapterId}/scenes`)
      setScenesByChapter(prev => ({ ...prev, [chapterId]: r.data || [] }))
      if ((r.data || []).length) {
        const s = r.data[0]
        setActiveSceneId(s.id)
        setSceneTitle(s.title || '')
        setSceneContent(s.content || '')
      } else {
        setActiveSceneId(null)
        setSceneTitle('')
        setSceneContent('')
      }
    } catch (err) {
      console.error(err)
      alert('Szenen konnten nicht geladen werden.')
    }
  }

  function onSelectChapter(chapterId) {
    setActiveChapterId(chapterId)
    // Szenen immer nachladen, damit Content aktuell ist
    loadScenesForChapter(chapterId)
  }

  function onSelectScene(scene) {
    setActiveSceneId(scene.id)
    setSceneTitle(scene.title || '')
    setSceneContent(scene.content || '')
  }

  if (loading) {
    return <div className="page-wrap"><div className="panel"><h3>Lade…</h3></div></div>
  }

  return (
    <div className="page-wrap">
      <aside className="side">
        <div className="side-group">
          <div className="side-head">Kapitel</div>
          <button className="btn small" onClick={addChapter}>+ Kapitel</button>
          <div className="side-list">
            {chapters.map(ch => (
              <button
                key={ch.id}
                type="button"
                className={`side-item-btn ${activeChapterId === ch.id ? 'active' : ''}`}
                onClick={() => onSelectChapter(ch.id)}
              >
                {ch.title}
              </button>
            ))}
          </div>
        </div>

        <div className="side-group">
          <div className="side-head">Szenen</div>
          <button className="btn small" onClick={addScene} disabled={!activeChapterId}>+ Szene</button>
          <div className="side-list">
            {(scenesByChapter[activeChapterId] || []).map(s => (
              <button
                key={s.id}
                type="button"
                className={`side-item-btn ${activeSceneId === s.id ? 'active' : ''}`}
                onClick={() => onSelectScene(s)}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="panel">
          <input
            className="scene-title"
            value={sceneTitle}
            onChange={(e) => setSceneTitle(e.target.value)}
            placeholder="Szenen-Titel"
          />
          <textarea
            className="scene-editor"
            value={sceneContent}
            onChange={(e) => setSceneContent(e.target.value)}
            placeholder="Dein Text…"
          />
        </div>
      </main>
    </div>
  )
}
