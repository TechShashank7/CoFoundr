import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import ReactMarkdown from 'react-markdown';
import { Download } from 'lucide-react';

const BusinessPlan = ({ startupId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    problem: '',
    solution: '',
    businessModel: ''
  });

  useEffect(() => {
    fetchReports();
  }, [startupId]);

  const fetchReports = async () => {
    try {
      const res = await api.get(`/reports?startupId=${startupId}&type=business_plan`);
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/reports/business-plan', {
        startupId,
        ...formData
      });
      fetchReports();
      setFormData({ problem: '', solution: '', businessModel: '' });
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
    element.download = `Business_Plan_${new Date(createdAt).toISOString().split('T')[0]}.md`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="mono">Business Plan Generator</h1>
        <p style={{ color: 'var(--text-muted)' }}>Generate a structured business plan using your AI co-founder.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        <div className="card">
          <h3 className="mono" style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>New Plan Inputs</h3>
          <form onSubmit={handleGenerate}>
            <label>PROBLEM STATEMENT</label>
            <textarea 
              required
              name="problem"
              value={formData.problem}
              onChange={e => setFormData({...formData, problem: e.target.value})}
              rows={4}
              placeholder="What specific problem are you solving?"
            />

            <label>PROPOSED SOLUTION</label>
            <textarea 
              required
              name="solution"
              value={formData.solution}
              onChange={e => setFormData({...formData, solution: e.target.value})}
              rows={4}
              placeholder="How does your product solve this problem?"
            />

            <label>BUSINESS MODEL</label>
            <textarea 
              required
              name="businessModel"
              value={formData.businessModel}
              onChange={e => setFormData({...formData, businessModel: e.target.value})}
              rows={4}
              placeholder="How will you make money? (e.g. B2B SaaS, $99/mo per seat)"
            />

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'GENERATING...' : 'GENERATE PLAN'}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {reports.length === 0 && !loading && (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No business plans generated yet. Fill out the form to create one.
            </div>
          )}
          
          {reports.map((report) => (
            <div key={report._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div>
                  <h3 className="mono">Generated Plan</h3>
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

export default BusinessPlan;
