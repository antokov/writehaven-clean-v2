import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsPlus, BsTrash, BsChevronDown, BsChevronRight, BsCheck, BsX } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

export default function NotesPanel({ contextType, contextId, onRequestDelete, onCountChange }) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    // Load collapsed state from localStorage
    const saved = localStorage.getItem('notesPanel.collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');

  const baseUrl = contextType === 'scene'
    ? `/api/scenes/${contextId}/notes`
    : contextType === 'character'
    ? `/api/characters/${contextId}/notes`
    : contextType === 'worldnode'
    ? `/api/world/${contextId}/notes`
    : `/api/chapters/${contextId}/notes`;

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('notesPanel.collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    if (!contextId) return;
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextId, contextType]);

  async function loadNotes() {
    if (!contextId) return;
    setLoading(true);
    try {
      const response = await axios.get(baseUrl);
      const loadedNotes = response.data || [];
      setNotes(loadedNotes);
      if (onCountChange) onCountChange(loadedNotes.length);
    } catch (err) {
      console.error('Failed to load notes', err);
    } finally {
      setLoading(false);
    }
  }

  async function createNote() {
    try {
      await axios.post(baseUrl, {
        title: t('writing.notes.untitled'),
        content: ''
      });
      await loadNotes();
    } catch (err) {
      console.error('Failed to create note', err);
    }
  }

  async function saveNote(noteId) {
    try {
      await axios.put(`${baseUrl}/${noteId}`, {
        title: editingTitle,
        content: editingContent
      });
      await loadNotes();
      setEditingNoteId(null);
      setEditingTitle('');
      setEditingContent('');
    } catch (err) {
      console.error('Failed to save note', err);
    }
  }

  function startEdit(note) {
    setEditingNoteId(note.id);
    setEditingTitle(note.title);
    setEditingContent(note.content);
  }

  function cancelEdit() {
    setEditingNoteId(null);
    setEditingTitle('');
    setEditingContent('');
  }

  function requestDelete(noteId) {
    const note = notes.find(n => n.id === noteId);
    onRequestDelete({
      title: t('writing.notes.deleteNote'),
      message: t('writing.notes.deleteConfirm'),
      onConfirm: async () => {
        try {
          await axios.delete(`${baseUrl}/${noteId}`);
          await loadNotes();
        } catch (err) {
          console.error('Failed to delete note', err);
        }
        onRequestDelete(null);
      },
      onCancel: () => {
        onRequestDelete(null);
      }
    });
  }

  return (
    <div className="notes-panel">
      <div className="panel-head" onClick={() => setCollapsed(!collapsed)}>
        <button className="icon-btn caret">
          {collapsed ? <BsChevronRight /> : <BsChevronDown />}
        </button>
        <span className="panel-title">{t('writing.notes.title')}</span>
        {notes.length > 0 && <span className="panel-count notes-count">{notes.length}</span>}
        {!collapsed && (
          <button
            className="icon-btn"
            onClick={(e) => { e.stopPropagation(); createNote(); }}
            title={t('writing.notes.addNote')}
          >
            <BsPlus />
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="panel-content">
          {loading ? (
            <div className="panel-empty">{t('common.loading')}</div>
          ) : notes.length === 0 ? (
            <div className="panel-empty">{t('writing.notes.noNotes')}</div>
          ) : (
            <ul className="notes-list">
              {notes.map(note => (
                <li key={note.id} className="note-item">
                  {editingNoteId === note.id ? (
                    <div className="note-edit">
                      <input
                        type="text"
                        className="note-title-edit"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        placeholder={t('writing.notes.titlePlaceholder')}
                      />
                      <textarea
                        className="note-content-edit"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        placeholder={t('writing.notes.contentPlaceholder')}
                        rows={4}
                      />
                      <div className="note-edit-actions">
                        <button
                          className="icon-btn"
                          onClick={cancelEdit}
                          title={t('common.cancel')}
                        >
                          <BsX />
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => saveNote(note.id)}
                          title={t('common.save')}
                          style={{ color: 'var(--brand)' }}
                        >
                          <BsCheck />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="note-row" onClick={() => startEdit(note)}>
                      <div className="note-info">
                        <span className="note-title">{note.title || t('writing.notes.untitled')}</span>
                        {note.content && (
                          <span className="note-preview">
                            — {note.content.substring(0, 50)}{note.content.length > 50 ? '...' : ''}
                          </span>
                        )}
                      </div>
                      <div className="note-actions">
                        <button
                          className="icon-btn danger"
                          onClick={(e) => { e.stopPropagation(); requestDelete(note.id); }}
                          title={t('common.delete')}
                        >
                          <BsTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
