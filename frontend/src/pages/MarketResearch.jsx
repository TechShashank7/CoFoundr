import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import ReactMarkdown from 'react-markdown';
import { Download } from 'lucide-react';

const MarketResearch = ({ startupId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    industry: '',
    targetMarket: '',
    region: ''
  });

  useEffect(() => {
    fetchReports();
  }, [startupId]);

  const fetchReports = async () => {
    try {
      const res = await api.get(`/reports?startupId=${startupId}&type=market_research`);
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/reports/market-research', {
        startupId,
        ...formData
      });
      fetchReports();
      setFormData({ industry: '', targetMarket: '', region: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (content, createdAt) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `Market_Research_${new Date(createdAt).toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="mono">Market Research</h1>
        <p style={{ color: 'var(--text-muted)' }}>Generate a comprehensive market research report for your target segment.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        <div className="card">
          <h3 className="mono" style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Research Parameters</h3>
          <form onSubmit={handleGenerate}>
            <label>TARGET INDUSTRY SEGMENT</label>
            <input 
              required
              type="text"
              name="industry"
              value={formData.industry}
              onChange={e => setFormData({...formData, industry: e.target.value})}
              placeholder="e.g. B2B SaaS, HealthTech"
            />

            <label>SPECIFIC TARGET MARKET</label>
            <input 
              required
              type="text"
              name="targetMarket"
              value={formData.targetMarket}
              onChange={e => setFormData({...formData, targetMarket: e.target.value})}
              placeholder="e.g. Mid-sized dental clinics"
            />

            <label>REGION</label>
            <input 
              required
              type="text"
              name="region"
              value={formData.region}
              onChange={e => setFormData({...formData, region: e.target.value})}
              placeholder="e.g. North America, Global"
            />

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'GENERATING...' : 'GENERATE REPORT'}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {reports.length === 0 && !loading && (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No market research generated yet. Fill out the form to create one.
            </div>
          )}
          
          {reports.map((report) => (
            <div key={report._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div>
                  <h3 className="mono">Market Research Report</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(report.createdAt).toLocaleString()}
                  </div>
                </div>
                <button 
                  onClick={() => handleExport(report.content, report.createdAt)}
                  className="btn" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Download size={16} /> EXPORT .MD
                </button>
              </div>
              
              <div className="markdown-body">
                <ReactMarkdown>{report.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketResearch;
