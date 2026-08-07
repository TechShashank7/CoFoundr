import React, { useEffect, useState } from 'react';
import api from '../lib/api';

const Dashboard = ({ startupId }) => {
  const [startup, setStartup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [startupRes, tasksRes] = await Promise.all([
          api.get(`/startups/${startupId}`),
          api.get(`/tasks?startupId=${startupId}`)
        ]);
        setStartup(startupRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startupId]);

  if (loading) return <div>Loading...</div>;
  if (!startup) return <div>Startup not found. Please reset.</div>;

  const taskStats = {
    backlog: tasks.filter(t => t.status === 'backlog').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="mono">Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Overview of your startup's status.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h3 className="mono" style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Startup Profile</h3>
          <p><strong>Name:</strong> {startup.name}</p>
          <p><strong>One-liner:</strong> {startup.oneLiner}</p>
          <p><strong>Industry:</strong> {startup.industry}</p>
          <p><strong>Target Market:</strong> {startup.targetMarket}</p>
          <p><strong>Stage:</strong> {startup.stage}</p>
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Created at: {new Date(startup.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="card">
          <h3 className="mono" style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Task Overview</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{taskStats.backlog}</div>
              <div className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>BACKLOG</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa' }}>{taskStats.in_progress}</div>
              <div className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>IN PROGRESS</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#34d399' }}>{taskStats.done}</div>
              <div className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>DONE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
