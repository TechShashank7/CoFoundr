import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Plus, Trash2 } from 'lucide-react';

const Tasks = ({ startupId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');

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

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const res = await api.post('/tasks', {
        startupId,
        title: newTaskTitle,
        status: 'backlog',
        priority: 'medium'
      });
      setTasks([res.data, ...tasks]);
      setNewTaskTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/tasks/${id}`, { status });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const columns = ['backlog', 'in_progress', 'done'];
  const columnTitles = {
    backlog: 'BACKLOG',
    in_progress: 'IN PROGRESS',
    done: 'DONE'
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <h1 className="mono">Tasks</h1>
        <p style={{ color: 'var(--text-muted)' }}>Kanban board for your startup's execution.</p>
      </div>

      <form onSubmit={addTask} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          value={newTaskTitle} 
          onChange={e => setNewTaskTitle(e.target.value)} 
          placeholder="New task title..." 
          style={{ margin: 0, flex: 1, maxWidth: '400px' }}
        />
        <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> ADD TASK
        </button>
      </form>

      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', flex: 1 }}>
          {columns.map(col => (
            <div key={col} className="card" style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
              <h3 className="mono" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                {columnTitles[col]} ({tasks.filter(t => t.status === col).length})
              </h3>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                {tasks.filter(t => t.status === col).map(task => (
                  <div key={task._id} className="card" style={{ padding: '1rem', backgroundColor: 'var(--panel-bg)', cursor: 'grab' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong>{task.title}</strong>
                      <button onClick={() => deleteTask(task._id)} style={{ background: 'none', border: 'none', color: '#ef4444' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <select 
                        value={task.status} 
                        onChange={(e) => updateStatus(task._id, e.target.value)}
                        style={{ margin: 0, padding: '0.25rem', fontSize: '0.8rem', width: 'auto' }}
                      >
                        <option value="backlog">Backlog</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
