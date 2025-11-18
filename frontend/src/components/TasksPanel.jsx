import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsPlus, BsTrash, BsPencil, BsCheck, BsChevronDown, BsChevronRight } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

export default function TasksPanel({ contextType, contextId, onRequestDelete }) {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    // Load collapsed state from localStorage
    const saved = localStorage.getItem('tasksPanel.collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [completedCollapsed, setCompletedCollapsed] = useState(() => {
    // Load completed collapsed state from localStorage
    const saved = localStorage.getItem('tasksPanel.completedCollapsed');
    return saved ? JSON.parse(saved) : true;
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');

  const baseUrl = contextType === 'scene'
    ? `/api/scenes/${contextId}/tasks`
    : contextType === 'character'
    ? `/api/characters/${contextId}/tasks`
    : contextType === 'worldnode'
    ? `/api/world/${contextId}/tasks`
    : `/api/chapters/${contextId}/tasks`;

  const openTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Save collapsed states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasksPanel.collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    localStorage.setItem('tasksPanel.completedCollapsed', JSON.stringify(completedCollapsed));
  }, [completedCollapsed]);

  useEffect(() => {
    if (!contextId) return;
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextId, contextType]);

  async function loadTasks() {
    if (!contextId) return;
    setLoading(true);
    try {
      const response = await axios.get(baseUrl);
      setTasks(response.data || []);
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  }

  async function createTask() {
    if (!newTaskTitle.trim()) return;
    try {
      await axios.post(baseUrl, { title: newTaskTitle.trim() });
      setNewTaskTitle('');
      await loadTasks();
    } catch (err) {
      console.error('Failed to create task', err);
      alert(t('writing.tasks.createFailed'));
    }
  }

  async function toggleTask(taskId, completed) {
    try {
      await axios.put(`${baseUrl}/${taskId}`, { completed: !completed });
      await loadTasks();
    } catch (err) {
      console.error('Failed to toggle task', err);
      alert(t('writing.tasks.updateFailed'));
    }
  }

  async function updateTaskTitle(taskId) {
    if (!editingTaskTitle.trim()) return;
    try {
      await axios.put(`${baseUrl}/${taskId}`, { title: editingTaskTitle.trim() });
      setEditingTaskId(null);
      setEditingTaskTitle('');
      await loadTasks();
    } catch (err) {
      console.error('Failed to update task', err);
      alert(t('writing.tasks.updateFailed'));
    }
  }

  function requestDelete(taskId) {
    onRequestDelete({
      title: t('writing.tasks.deleteTask'),
      message: t('writing.tasks.deleteConfirm'),
      onConfirm: async () => {
        try {
          await axios.delete(`${baseUrl}/${taskId}`);
          await loadTasks();
        } catch (err) {
          console.error('Failed to delete task', err);
        }
        onRequestDelete(null);
      },
      onCancel: () => {
        onRequestDelete(null);
      }
    });
  }

  function startEditTask(task) {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  }

  function cancelEdit() {
    setEditingTaskId(null);
    setEditingTaskTitle('');
  }

  function handleNewTaskKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      createTask();
    }
  }

  function handleEditTaskKeyDown(e, taskId) {
    if (e.key === 'Enter') {
      e.preventDefault();
      updateTaskTitle(taskId);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  }

  return (
    <div className="tasks-panel">
      <div className="panel-head" onClick={() => setCollapsed(!collapsed)}>
        <button className="icon-btn caret" aria-label={collapsed ? t('common.expand') : t('common.collapse')}>
          {collapsed ? <BsChevronRight /> : <BsChevronDown />}
        </button>
        <span className="panel-title">{t('writing.tasks.title')}</span>
      </div>

      {!collapsed && (
        <div className="panel-content">
          {/* New Task Input */}
          <div className="task-new">
            <input
              type="text"
              className="task-new-input"
              placeholder={t('writing.tasks.newTaskPlaceholder')}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleNewTaskKeyDown}
            />
            <button
              className="icon-btn"
              onClick={createTask}
              disabled={!newTaskTitle.trim()}
              title={t('writing.tasks.addTask')}
            >
              <BsPlus />
            </button>
          </div>

          {/* Open Tasks */}
          {loading ? (
            <div className="panel-empty">{t('common.loading')}</div>
          ) : (
            <>
              {openTasks.length === 0 && completedTasks.length === 0 ? (
                <div className="panel-empty">{t('writing.tasks.noTasks')}</div>
              ) : (
                <>
                  {openTasks.length > 0 && (
                    <div className="tasks-section">
                      <div className="tasks-list">
                        {openTasks.map(task => (
                          <div key={task.id} className="task-item">
                            <button
                              className="task-checkbox"
                              onClick={() => toggleTask(task.id, task.completed)}
                              aria-label={t('writing.tasks.markComplete')}
                            >
                              <span className="checkbox-box"></span>
                            </button>
                            {editingTaskId === task.id ? (
                              <input
                                type="text"
                                className="task-edit-input"
                                value={editingTaskTitle}
                                onChange={(e) => setEditingTaskTitle(e.target.value)}
                                onKeyDown={(e) => handleEditTaskKeyDown(e, task.id)}
                                onBlur={() => updateTaskTitle(task.id)}
                                autoFocus
                              />
                            ) : (
                              <div className="task-title" onClick={() => startEditTask(task)}>
                                {task.title}
                              </div>
                            )}
                            <div className="task-actions">
                              <button
                                className="icon-btn"
                                onClick={() => startEditTask(task)}
                                title={t('common.edit')}
                              >
                                <BsPencil />
                              </button>
                              <button
                                className="icon-btn danger"
                                onClick={() => requestDelete(task.id)}
                                title={t('common.delete')}
                              >
                                <BsTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Completed Tasks */}
                  {completedTasks.length > 0 && (
                    <div className="tasks-section completed-section">
                      <div
                        className="tasks-section-header"
                        onClick={() => setCompletedCollapsed(!completedCollapsed)}
                      >
                        <button className="icon-btn caret">
                          {completedCollapsed ? <BsChevronRight /> : <BsChevronDown />}
                        </button>
                        <span>{t('writing.tasks.completed')} ({completedTasks.length})</span>
                      </div>
                      {!completedCollapsed && (
                        <div className="tasks-list">
                          {completedTasks.map(task => (
                            <div key={task.id} className="task-item completed">
                              <button
                                className="task-checkbox"
                                onClick={() => toggleTask(task.id, task.completed)}
                                aria-label={t('writing.tasks.markIncomplete')}
                              >
                                <span className="checkbox-box checked">
                                  <BsCheck />
                                </span>
                              </button>
                              <div className="task-title">{task.title}</div>
                              <div className="task-actions">
                                <button
                                  className="icon-btn danger"
                                  onClick={() => requestDelete(task.id)}
                                  title={t('common.delete')}
                                >
                                  <BsTrash />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
