import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Bootstrap-Icons als React-SVGs (keine Fonts nötig)
import { BsBoxArrowUpRight, BsPencil, BsTrash, BsPlus, BsThreeDotsVertical } from 'react-icons/bs';

import ConfirmModal from '../components/ConfirmModal';
import PromptModal from '../components/PromptModal';
import CreateProjectModal from '../components/CreateProjectModal';
import { useTranslation } from 'react-i18next';

export default function Dashboard(){
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(null);
  const [promptModal, setPromptModal] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  async function load(){
    try {
      const r = await axios.get('/api/projects');
      setProjects(r.data || []);
    } catch (err) {
      console.error('Load /api/projects failed', err);
      alert(t('dashboard.loadFailed'));
    } finally {
      setLoading(false);
    }
  }
  useEffect(()=>{ load(); }, []);

  // Menü schließen bei Klick außerhalb
  useEffect(() => {
    function handleClickOutside(event) {
      // Prüfen ob der Klick außerhalb des Menü-Containers ist
      const menuButton = event.target.closest('.project-menu-btn');
      const menuDropdown = event.target.closest('.project-dropdown-menu');

      if (!menuButton && !menuDropdown) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openMenuId]);

  function toggleMenu(e, projectId) {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(openMenuId === projectId ? null : projectId);
  }

  function handleOpenProject(project) {
    setOpenMenuId(null);
    navigate(`/app/project/${project.id}`);
  }

  async function handleCreateProject({ title, file }) {
    try {
      let response;

      if (file) {
        // Mit File-Upload (multipart/form-data)
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);

        response = await axios.post('/api/projects', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Ohne File (JSON)
        response = await axios.post('/api/projects', { title });
      }

      setProjects([response.data, ...projects]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Create project failed', err);
      const errorMsg = err.response?.data?.error || t('dashboard.createFailed');
      alert(errorMsg);
      throw err; // Re-throw to keep modal open
    }
  }

  async function renameProject(p){
    setOpenMenuId(null);
    setPromptModal({
      title: t('dashboard.renameTitle'),
      message: t('dashboard.renameMessage'),
      defaultValue: p.title,
      onConfirm: async (newTitle) => {
        setPromptModal(null);
        try {
          const r = await axios.put(`/api/projects/${p.id}`, { title: newTitle });
          setProjects(projects.map(x => x.id===p.id ? r.data : x));
        } catch (err) {
          console.error('Rename project failed', err);
          alert(t('dashboard.renameFailed'));
        }
      },
      onCancel: () => setPromptModal(null)
    });
  }

  async function removeProject(p){
    setOpenMenuId(null);
    setConfirmModal({
      title: t('dashboard.deleteTitle'),
      message: t('dashboard.deleteMessage', { title: p.title }),
      confirmText: t('common.delete'),
      variant: 'danger',
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await axios.delete(`/api/projects/${p.id}`);
          setProjects(projects.filter(x => x.id!==p.id));
        } catch (err) {
          console.error('Delete project failed', err);
          alert(t('dashboard.deleteFailed'));
        }
      },
      onCancel: () => setConfirmModal(null)
    });
  }

  return (
    <div className="dash-wrap">
      {loading ? (
        <div className="dash-loading">{t('common.loading')}</div>
      ) : (
        <>
          <div className="project-grid">
            {/* Plus-Karte zum Hinzufügen */}
            <article className="project-card project-card-add" onClick={() => setShowCreateModal(true)} data-testid="new-project-button">
              <div className="add-card-content">
                <BsPlus className="add-icon" />
                <span className="add-text">{t('dashboard.newProject')}</span>
              </div>
            </article>

            {projects.map(p => (
              <article
                key={p.id}
                className="project-card"
                data-testid={`project-card-${p.id}`}
                onClick={() => navigate(`/app/project/${p.id}`)}
                style={{ cursor: 'pointer' }}
              >
                {/* Cover links (2:3) */}
                <div className="project-cover" data-testid={`project-cover-${p.id}`}>
                  <div className="cover-art">
                    <span className="cover-letter">{(p.title || '?').slice(0,1).toUpperCase()}</span>
                  </div>
                </div>

                {/* Rechts: Titel + Menü-Icon + Description */}
                <div className="project-body">
                  <div className="project-top">
                    <h3 className="project-title" title={p.title}>
                      {p.title}
                    </h3>
                    <div className="project-menu-container">
                      <button
                        className="project-menu-btn"
                        onClick={(e) => toggleMenu(e, p.id)}
                        aria-label="Menü öffnen"
                        data-testid={`project-menu-${p.id}`}
                      >
                        <BsThreeDotsVertical />
                      </button>
                      {openMenuId === p.id && (
                        <div ref={menuRef} className="project-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="dropdown-menu-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenProject(p);
                            }}
                            data-testid={`project-open-${p.id}`}
                          >
                            <BsBoxArrowUpRight className="icon" aria-hidden />
                            <span>{t('common.open')}</span>
                          </button>
                          <button
                            className="dropdown-menu-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              renameProject(p);
                            }}
                            data-testid={`project-rename-${p.id}`}
                          >
                            <BsPencil className="icon" aria-hidden />
                            <span>{t('common.rename')}</span>
                          </button>
                          <div className="dropdown-menu-separator"></div>
                          <button
                            className="dropdown-menu-item danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeProject(p);
                            }}
                            data-testid={`project-delete-${p.id}`}
                          >
                            <BsTrash className="icon" aria-hidden />
                            <span>{t('common.delete')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className={`project-description ${!p.description ? 'placeholder' : ''}`}>
                    {p.description || t('dashboard.noDescription')}
                  </p>
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
  );
}
