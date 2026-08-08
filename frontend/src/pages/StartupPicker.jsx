import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import api from '../lib/api';

const StartupPicker = ({ setStartupId }) => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const res = await api.get('/startups');
        setStartups(res.data);
      } catch (err) {
        setError('Failed to load startups: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, []);

  const handleSelect = (id) => {
    localStorage.setItem('activeStartupId', id);
    setStartupId(id);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 2rem', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginBottom: '1rem', fontSize: '1.5rem' }}>
          Select a Startup
        </h2>
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {startups.map((startup) => (
            <div 
              key={startup._id} 
              className="card" 
              style={{ cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}
              onClick={() => handleSelect(startup._id)}
            >
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text)' }}>{startup.name}</h3>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {startup.industry} • {startup.stage}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text)', opacity: 0.8 }}>
                {startup.oneLiner}
              </p>
            </div>
          ))}

          <div 
            className="card" 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '2px dashed var(--border)',
              backgroundColor: 'transparent',
              minHeight: '150px'
            }}
            onClick={() => navigate('/get-started')}
          >
            <Plus size={32} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>New Startup</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupPicker;
