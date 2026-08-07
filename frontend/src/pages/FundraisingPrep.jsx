import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import ReactMarkdown from 'react-markdown';
import { Download } from 'lucide-react';

const FundraisingPrep = ({ startupId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    stage: 'Pre-seed',
    amountSeeking: '',
    useOfFunds: ''
  });

  useEffect(() => {
    fetchReports();
  }, [startupId]);

  const fetchReports = async () => {
    try {
      const res = await api.get(`/reports?startupId=${startupId}&type=fundraising_prep`);
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/reports/fundraising-prep', {
        startupId,
        ...formData
      });
      fetchReports();
      setFormData({ stage: 'Pre-seed', amountSeeking: '', useOfFunds: '' });
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
    element.download = `Fundraising_Prep_${new Date(createdAt).toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="mono">Fundraising Prep</h1>
        <p style={{ color: 'var(--text-muted)' }}>Generate pitch deck outlines and anticipate investor questions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        <div className="card">
          <h3 className="mono" style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Fundraising Details</h3>
          <form onSubmit={handleGenerate}>
            <label>CURRENT STAGE</label>
            <select 
              required
              name="stage"
              value={formData.stage}
              onChange={e => setFormData({...formData, stage: e.target.value})}
            >
              <option value="Pre-seed">Pre-seed</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B+">Series B+</option>
            </select>

            <label>AMOUNT SEEKING</label>
            <input 
              required
              type="text"
              name="amountSeeking"
              value={formData.amountSeeking}
              onChange={e => setFormData({...formData, amountSeeking: e.target.value})}
              placeholder="e.g. $500,000"
            />

            <label>USE OF FUNDS</label>
            <textarea 
              required
              name="useOfFunds"
              value={formData.useOfFunds}
              onChange={e => setFormData({...formData, useOfFunds: e.target.value})}
              rows={4}
              placeholder="e.g. 50% Engineering, 30% Marketing, 20% Ops"
            />

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'GENERATING...' : 'GENERATE MATERIALS'}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {reports.length === 0 && !loading && (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No fundraising materials generated yet. Fill out the form to create one.
            </div>
          )}
          
          {reports.map((report) => (
            <div key={report._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div>
                  <h3 className="mono">Fundraising Prep Materials</h3>
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

export default FundraisingPrep;
