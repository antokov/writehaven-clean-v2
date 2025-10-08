import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Dashboard(){
  const [projects, setProjects] = useState([])
  const [title, setTitle] = useState('')

  async function load(){
    const r = await axios.get('/api/projects')
    setProjects(r.data)
  }
  useEffect(()=>{ load() }, [])

  async function addProject(){
    if(!title.trim()) return
    const r = await axios.post('/api/projects', {title})
    setProjects([r.data, ...projects]); setTitle('')
  }

  async function renameProject(p){
    const nt = prompt('Neuer Projektname', p.title) || p.title
    const r = await axios.put(`/api/projects/${p.id}`, {title: nt})
    setProjects(projects.map(x => x.id===p.id ? r.data : x))
  }

  async function removeProject(p){
    if(!confirm('Projekt wirklich löschen?')) return
    await axios.delete(`/api/projects/${p.id}`)
    setProjects(projects.filter(x => x.id!==p.id))
  }

  return (
    <div>
      <h1>Deine Projekte</h1>
      <div className="row">
        <input placeholder="Neues Projekt" value={title} onChange={e=>setTitle(e.target.value)} />
        <button onClick={addProject}>Anlegen</button>
      </div>
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
      </div>
    </div>
  )
}
