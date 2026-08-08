import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const Onboarding = ({ setStartupId }) => {
  const [formData, setFormData] = useState({
    name: '',
    oneLiner: '',
    industry: '',
    targetMarket: '',
    stage: 'idea'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/startups', formData);
      const newStartupId = res.data._id;
      localStorage.setItem('activeStartupId', newStartupId);
      setStartupId(newStartupId);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '2rem', backgroundColor: 'var(--bg)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--accent)', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>
          Welcome to CoFoundr_
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Tell me about your startup so we can get to work.
        </p>

        {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>STARTUP NAME</label>
          <input required name="name" value={formData.name} onChange={handleChange} placeholder="Acme Corp" />

          <label>ONE-LINER</label>
          <input required name="oneLiner" value={formData.oneLiner} onChange={handleChange} placeholder="We do X for Y by Z" />

          <label>INDUSTRY</label>
          <input required name="industry" value={formData.industry} onChange={handleChange} placeholder="e.g. B2B SaaS, HealthTech" />

          <label>TARGET MARKET</label>
          <input required name="targetMarket" value={formData.targetMarket} onChange={handleChange} placeholder="e.g. Mid-market HR teams" />

          <label>CURRENT STAGE</label>
          <select name="stage" value={formData.stage} onChange={handleChange}>
            <option value="idea">Idea Stage</option>
            <option value="mvp">MVP Built</option>
            <option value="pre_seed">Pre-Seed</option>
            <option value="seed">Seed</option>
            <option value="growth">Growth</option>
          </select>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'INITIALIZING...' : 'INITIALIZE CO-FOUNDER'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
