import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function ProjectView(){
  const { id } = useParams()
  const pid = Number(id)

  const [tab, setTab] = useState('write')
  const [project, setProject] = useState(null)
  const [chapters, setChapters] = useState([])
  const [activeChapterId, setActiveChapterId] = useState(null)

  const [scenesByChapter, setScenesByChapter] = useState({})
  const [activeSceneId, setActiveSceneId] = useState(null)
  const [sceneTitle, setSceneTitle] = useState('')
  const [sceneContent, setSceneContent] = useState('')

  const [characters, setCharacters] = useState([])
  const [world, setWorld] = useState([])

  async function loadAll(){
    const [p, ch, chars, w] = await Promise.all([
      axios.get(`/api/projects/${pid}`),
      axios.get(`/api/projects/${pid}/chapters`),
      axios.get(`/api/projects/${pid}/characters`),
      axios.get(`/api/projects/${pid}/world`),
    ])
    setProject(p.data)
    setChapters(ch.data)
    setCharacters(chars.data)
    setWorld(w.data)
    if(ch.data.length){
      setActiveChapterId(ch.data[0].id)
      // preload scenes for first chapter
      const r = await axios.get(`/api/chapters/${ch.data[0].id}/scenes`)
      setScenesByChapter(prev => ({...prev, [ch.data[0].id]: r.data}))
      if(r.data.length){
        const s = r.data[0]
        setActiveSceneId(s.id); setSceneTitle(s.title); setSceneContent(s.content||'')
      }
    }
  }
  useEffect(()=>{ loadAll() }, [pid])

  async function loadScenesForChapter(cid){
    const r = await axios.get(`/api/chapters/${cid}/scenes`)
    setScenesByChapter(prev => ({...prev, [cid]: r.data}))
    if(cid === activeChapterId && r.data.length){
      const s = r.data[0]
      setActiveSceneId(s.id); setSceneTitle(s.title); setSceneContent(s.content||'')
    }else if(cid === activeChapterId){
      setActiveSceneId(null); setSceneTitle(''); setSceneContent('')
    }
  }

  useEffect(()=>{
    if(activeChapterId){
      loadScenesForChapter(activeChapterId)
    }
  }, [activeChapterId])

  useEffect(()=>{
    if(!activeSceneId) return
    const t = setTimeout(()=>{
      axios.put(`/api/scenes/${activeSceneId}`, { title: sceneTitle, content: sceneContent })
    }, 600)
    return ()=> clearTimeout(t)
  }, [activeSceneId, sceneTitle, sceneContent])

  async function addChapter(){
    const r = await axios.post(`/api/projects/${pid}/chapters`, { title: 'Kapitel ' + (chapters.length + 1), order_index: chapters.length })
    setChapters([...chapters, r.data])
    setActiveChapterId(r.data.id)
  }

  async function addScene(){
    if(!activeChapterId) return
    const cur = scenesByChapter[activeChapterId] || []
    const r = await axios.post(`/api/chapters/${activeChapterId}/scenes`, { title: 'Szene ' + (cur.length + 1), order_index: cur.length })
    const updated = {...scenesByChapter, [activeChapterId]: [...cur, r.data]}
    setScenesByChapter(updated)
    setActiveSceneId(r.data.id); setSceneTitle(r.data.title); setSceneContent(r.data.content||'')
  }

  function pickScene(s){
    setActiveSceneId(s.id)
    setSceneTitle(s.title)
    setSceneContent(s.content||'')
  }

  async function addCharacter(){
    const name = prompt('Name der Figur?') || 'Neue Figur'
    const r = await axios.post(`/api/projects/${pid}/characters`, { name })
    setCharacters([...characters, r.data])
  }

  async function addWorld(){
    const title = prompt('Titel des Welt-Elements?') || 'Neues Element'
    const r = await axios.post(`/api/projects/${pid}/world`, { title })
    setWorld([...world, r.data])
  }

  return (
    <div className="project">
      <div className="tabs">
        <button className={tab==='write'?'active':''} onClick={()=>setTab('write')}>Schreiben</button>
        <button className={tab==='characters'?'active':''} onClick={()=>setTab('characters')}>Charaktere</button>
        <button className={tab==='world'?'active':''} onClick={()=>setTab('world')}>Welt</button>
        <button className={tab==='preview'?'active':''} onClick={()=>setTab('preview')}>Vorschau</button>
      </div>

      {tab==='write' && (
        <div className="two-col">
          <aside className="left">
            <div className="section">
              <div className="section-title">Kapitel</div>
              <button className="btn small" onClick={addChapter}>+ Kapitel</button>
              <ul className="list">
                {chapters.map(c => (
                  <li key={c.id} className={c.id===activeChapterId?'active':''} onClick={()=>setActiveChapterId(c.id)}>
                    {c.title}
                  </li>
                ))}
              </ul>
            </div>
            <div className="section">
              <div className="section-title">Szenen</div>
              <button className="btn small" onClick={addScene}>+ Szene</button>
              <ul className="list">
                {(scenesByChapter[activeChapterId]||[]).map(s => (
                  <li key={s.id} className={s.id===activeSceneId?'active':''} onClick={()=>pickScene(s)}>
                    {s.title}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <section className="right">
            {activeSceneId ? (
              <div className="editor">
                <input className="title-input" value={sceneTitle} onChange={e=>setSceneTitle(e.target.value)} />
                <textarea className="content-input" value={sceneContent} onChange={e=>setSceneContent(e.target.value)} placeholder="Schreibe deine Szene..." />
              </div>
            ) : (
              <div className="empty">Bitte Szene wählen oder erstellen.</div>
            )}
          </section>
        </div>
      )}

      {tab==='characters' && (
        <div>
          <div className="row"><button className="btn" onClick={addCharacter}>+ Figur</button></div>
          <div className="grid">
            {characters.map(c => (
              <div key={c.id} className="card">
                <div className="card-title">{c.name}</div>
                <div className="card-body">{c.summary || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='world' && (
        <div>
          <div className="row"><button className="btn" onClick={addWorld}>+ Element</button></div>
          <div className="grid">
            {world.map(w => (
              <div key={w.id} className="card">
                <div className="card-title">{w.icon} {w.title}</div>
                <div className="card-subtitle">{w.kind}</div>
                <div className="card-body">{w.summary || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='preview' && (
        <div className="preview">
          {chapters.map(c => (
            <div key={c.id} className="preview-chapter">
              <h2>{c.title}</h2>
              {(scenesByChapter[c.id]||[]).map(s => (
                <div key={s.id} className="preview-scene">
                  <h3>{s.title}</h3>
                  <p>{s.content}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
