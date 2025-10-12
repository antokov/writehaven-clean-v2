import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

// Bootstrap-Icons als React-SVGs (keine Fonts nötig)
import { BsBoxArrowUpRight, BsPencil, BsTrash } from 'react-icons/bs'

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
      setProjects([r.data, ...projects])
      setTitle('')
    } catch (err) {
      console.error('Create project failed', err)
      alert('Projekt konnte nicht angelegt werden.')
    }
  }

  async function renameProject(p){
    try {
      const nt = prompt('Neuer Projektname', p.title)
      if (nt == null) return
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
    <div className="dash-wrap">
      <div className="dash-head">
        <h1>Deine Projekte</h1>
        <div className="dash-new">
          <input
            className="dash-input"
            placeholder="Neues Projekt"
            value={title}
            onChange={e=>setTitle(e.target.value)}
            onKeyDown={e => (e.key === 'Enter') && addProject()}
          />
          <button className="btn primary" onClick={addProject}>Anlegen</button>
        </div>
      </div>

      {loading ? (
        <div className="dash-loading">Lade…</div>
      ) : (
        <>
          {!projects.length && (
            <div className="dash-empty">Noch keine Projekte – lege oben ein neues an.</div>
          )}

          <div className="project-grid">
            {projects.map(p => (
              <article key={p.id} className="project-card">
                {/* Cover links (2:3) */}
                <Link to={`/project/${p.id}`} className="project-cover" aria-label={`${p.title} öffnen`}>
                  <div className="cover-art">
                    <span className="cover-letter">{(p.title || '?').slice(0,1).toUpperCase()}</span>
                  </div>
                </Link>

                {/* Rechts: Titel + Actions */}
                <div className="project-body">
                  <div className="project-top">
                    <h3 className="project-title" title={p.title}>
                      <Link to={`/project/${p.id}`}>{p.title}</Link>
                    </h3>
                  </div>

                  <div className="project-actions">
                    <div className="actions-left">
                      <Link className="btn btn-primary-quiet" to={`/project/${p.id}`}>
                        <BsBoxArrowUpRight className="icon" aria-hidden />
                        <span>Öffnen</span>
                      </Link>
                      <button className="btn btn-quiet" onClick={()=>renameProject(p)}>
                        <BsPencil className="icon" aria-hidden />
                        <span>Umbenennen</span>
                      </button>
                    </div>
                    <div className="actions-right">
                      <button className="btn btn-danger-quiet" onClick={()=>removeProject(p)}>
                        <BsTrash className="icon" aria-hidden />
                        <span>Löschen</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
