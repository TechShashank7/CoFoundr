import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Plus, Trash2, Calendar, X, Bell } from 'lucide-react';

const Tasks = ({ startupId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Toast state
  const [toast, setToast] = useState(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Add Task Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?startupId=${startupId}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [startupId]);

  const showToast = (message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNotify = async (id, e) => {
    e.stopPropagation();
    try {
      showToast('Sending notification...');
      await api.post(`/tasks/${id}/notify`);
      showToast('Webhook notified successfully!');
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to notify webhook', true);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.title.trim()) return;
    try {
      const res = await api.post('/tasks', {
        startupId,
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        status: 'backlog',
        priority: 'medium'
      });
      setTasks([res.data, ...tasks]);
      closeAddModal();
    } catch (err) {
      console.error('Failed to create task:', err.response?.data || err.message || err);
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setFormData({ title: '', description: '', dueDate: '' });
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/tasks/${id}`, { status });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      if (selectedTask && selectedTask._id === id) {
        setSelectedTask(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      // Find the task and update status if it changed
      const task = tasks.find(t => t._id === taskId);
      if (task && task.status !== status) {
        updateStatus(taskId, status);
      }
    }
  };

  const columns = ['backlog', 'in_progress', 'done'];
  const columnTitles = {
    backlog: 'BACKLOG',
    in_progress: 'IN PROGRESS',
    done: 'DONE'
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: toast.isError ? '#ef4444' : '#10b981',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}>
          {toast.message}
        </div>
      )}

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="mono">Tasks</h1>
          <p style={{ color: 'var(--text-muted)' }}>Kanban board for your startup's execution.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> ADD TASK
        </button>
      </div>

      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', flex: 1 }}>
          {columns.map(col => (
            <div 
              key={col} 
              className="card" 
              style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col)}
            >
              <h3 className="mono" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                {columnTitles[col]} ({tasks.filter(t => t.status === col).length})
              </h3>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', minHeight: '100px' }}>
                {tasks.filter(t => t.status === col).map(task => (
                  <div 
                    key={task._id} 
                    className="card" 
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id)}
                    onClick={() => setSelectedTask(task)}
                    style={{ padding: '1rem', backgroundColor: 'var(--panel-bg)', cursor: 'grab' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <strong style={{ display: 'block', marginBottom: '0.5rem' }}>{task.title}</strong>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button 
                          onClick={(e) => handleNotify(task._id, e)} 
                          style={{ background: 'none', border: 'none', color: '#60a5fa', padding: '0.25rem', cursor: 'pointer' }}
                          title="Trigger n8n webhook"
                        >
                          <Bell size={16} />
                        </button>
                        <button 
                          onClick={(e) => deleteTask(task._id, e)} 
                          style={{ background: 'none', border: 'none', color: '#ef4444', padding: '0.25rem', cursor: 'pointer' }}
                          title="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {task.dueDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Calendar size={12} /> {formatDate(task.dueDate)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={closeAddModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Task</h2>
              <button className="modal-close" onClick={closeAddModal}><X size={24} /></button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <label>TITLE</label>
              <input 
                type="text" 
                required
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                placeholder="What needs to be done?" 
              />
              
              <label>DESCRIPTION (Optional)</label>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                rows={4}
                placeholder="Add more details..." 
              />
              
              <label>DEADLINE (Optional)</label>
              <input 
                type="date" 
                value={formData.dueDate} 
                onChange={e => setFormData({...formData, dueDate: e.target.value})} 
              />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn" onClick={closeAddModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedTask.title}</h2>
              <button className="modal-close" onClick={() => setSelectedTask(null)}><X size={24} /></button>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }} className="mono">
                STATUS
              </strong>
              <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: '#2d3748', borderRadius: '4px', fontSize: '0.9rem' }}>
                {columnTitles[selectedTask.status]}
              </div>
            </div>

            {selectedTask.dueDate && (
              <div style={{ marginBottom: '1.5rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }} className="mono">
                  DEADLINE
                </strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} /> {new Date(selectedTask.dueDate).toLocaleDateString()}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }} className="mono">
                DESCRIPTION
              </strong>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {selectedTask.description || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No description provided.</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
