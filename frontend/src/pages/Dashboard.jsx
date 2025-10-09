import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Dashboard(){
  const [projects, setProjects] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)

  async function load(){
    try {
      const r = await axios.get('/api/projects')
      setProjects(r.data || [])
    } catch (err) {
      console.error('Load /api/projects failed', err)
      alert('Konnte Projekte nicht laden. Läuft das Backend?')
    } finally {
      setLoading(false)
    }
  }
  useEffect(()=>{ load() }, [])

  async function addProject(){
    if(!title.trim()) return
    try {
      const r = await axios.post('/api/projects', { title })
      setProjects([r.data, ...projects]); setTitle('')
    } catch (err) {
      console.error('Create project failed', err)
      alert('Projekt konnte nicht angelegt werden.')
    }
  }

  async function renameProject(p){
    try {
      const nt = prompt('Neuer Projektname', p.title) || p.title
      const r = await axios.put(`/api/projects/${p.id}`, { title: nt })
      setProjects(projects.map(x => x.id===p.id ? r.data : x))
    } catch (err) {
      console.error('Rename project failed', err)
      alert('Umbenennen fehlgeschlagen.')
    }
  }

  async function removeProject(p){
    try {
      if(!confirm('Projekt wirklich löschen?')) return
      await axios.delete(`/api/projects/${p.id}`)
      setProjects(projects.filter(x => x.id!==p.id))
    } catch (err) {
      console.error('Delete project failed', err)
      alert('Löschen fehlgeschlagen.')
    }
  }

  return (
    <div>
      <h1>Deine Projekte</h1>
      <div className="row">
        <input placeholder="Neues Projekt" value={title} onChange={e=>setTitle(e.target.value)} />
        <button onClick={addProject}>Anlegen</button>
      </div>

      {loading ? (
        <div style={{opacity:.7, marginTop: 16}}>Lade…</div>
      ) : (
        <div className="grid">
          {projects.map(p => (
            <div key={p.id} className="card">
              <div className="card-title">{p.title}</div>
              <div className="card-actions">
                <Link className="btn" to={`/project/${p.id}`}>Öffnen</Link>
                <button className="btn" onClick={()=>renameProject(p)}>Umbenennen</button>
                <button className="btn danger" onClick={()=>removeProject(p)}>Löschen</button>
              </div>
            </div>
          ))}
          {!projects.length && <div className="empty">Noch keine Projekte – lege oben ein neues an.</div>}
        </div>
      )}
    </div>
  )
}
