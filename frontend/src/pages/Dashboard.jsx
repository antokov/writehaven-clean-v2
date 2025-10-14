import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

// Bootstrap-Icons als React-SVGs (keine Fonts nötig)
import { BsBoxArrowUpRight, BsPencil, BsTrash, BsPlus } from 'react-icons/bs'

import ConfirmModal from '../components/ConfirmModal'
import PromptModal from '../components/PromptModal'
import CreateProjectModal from '../components/CreateProjectModal'

export default function Dashboard(){
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmModal, setConfirmModal] = useState(null)
  const [promptModal, setPromptModal] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

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

  async function handleCreateProject({ title, file }) {
    try {
      let response

      if (file) {
        // Mit File-Upload (multipart/form-data)
        const formData = new FormData()
        formData.append('title', title)
        formData.append('file', file)

        response = await axios.post('/api/projects', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // Ohne File (JSON)
        response = await axios.post('/api/projects', { title })
      }

      setProjects([response.data, ...projects])
      setShowCreateModal(false)
    } catch (err) {
      console.error('Create project failed', err)
      const errorMsg = err.response?.data?.error || 'Projekt konnte nicht angelegt werden.'
      alert(errorMsg)
      throw err // Re-throw to keep modal open
    }
  }

  async function renameProject(p){
    setPromptModal({
      title: 'Projekt umbenennen',
      message: 'Gib einen neuen Namen für das Projekt ein:',
      defaultValue: p.title,
      onConfirm: async (newTitle) => {
        setPromptModal(null)
        try {
          const r = await axios.put(`/api/projects/${p.id}`, { title: newTitle })
          setProjects(projects.map(x => x.id===p.id ? r.data : x))
        } catch (err) {
          console.error('Rename project failed', err)
          alert('Umbenennen fehlgeschlagen.')
        }
      },
      onCancel: () => setPromptModal(null)
    })
  }

  async function removeProject(p){
    setConfirmModal({
      title: 'Projekt löschen',
      message: `Möchtest du das Projekt "${p.title}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`,
      confirmText: 'Löschen',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmModal(null)
        try {
          await axios.delete(`/api/projects/${p.id}`)
          setProjects(projects.filter(x => x.id!==p.id))
        } catch (err) {
          console.error('Delete project failed', err)
          alert('Löschen fehlgeschlagen.')
        }
      },
      onCancel: () => setConfirmModal(null)
    })
  }

  return (
    <div className="dash-wrap">
      {loading ? (
        <div className="dash-loading">Lade…</div>
      ) : (
        <>
          {!projects.length && (
            <div className="dash-empty">Noch keine Projekte – klicke auf die Plus-Karte, um ein neues anzulegen.</div>
          )}

          <div className="project-grid">
            {/* Plus-Karte zum Hinzufügen */}
            <article className="project-card project-card-add" onClick={() => setShowCreateModal(true)}>
              <div className="add-card-content">
                <BsPlus className="add-icon" />
                <span className="add-text">Neues Projekt</span>
              </div>
            </article>

            {projects.map(p => (
              <article key={p.id} className="project-card">
                {/* Cover links (2:3) */}
                <Link to={`/app/project/${p.id}`} className="project-cover" aria-label={`${p.title} öffnen`}>
                  <div className="cover-art">
                    <span className="cover-letter">{(p.title || '?').slice(0,1).toUpperCase()}</span>
                  </div>
                </Link>

                {/* Rechts: Titel + Actions */}
                <div className="project-body">
                  <div className="project-top">
                    <h3 className="project-title" title={p.title}>
                      <Link to={`/app/project/${p.id}`}>{p.title}</Link>
                    </h3>
                  </div>

                  <div className="project-actions">
                    <div className="actions-left">
                      <Link className="btn btn-primary-quiet" to={`/app/project/${p.id}`}>
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

      {confirmModal && <ConfirmModal {...confirmModal} />}
      {promptModal && <PromptModal {...promptModal} />}
      {showCreateModal && (
        <CreateProjectModal
          onConfirm={handleCreateProject}
          onCancel={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}
