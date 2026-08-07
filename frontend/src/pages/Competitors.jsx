import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download } from 'lucide-react';

const Competitors = ({ startupId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productDescription: '',
    knownCompetitors: ''
  });

  useEffect(() => {
    fetchReports();
  }, [startupId]);

  const fetchReports = async () => {
    try {
      const res = await api.get(`/reports?startupId=${startupId}&type=competitor_analysis`);
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/competitors/analyze', {
        startupId,
        ...formData
      });
      fetchReports();
      setFormData({ productDescription: '', knownCompetitors: '' });
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
    element.download = `Competitor_Analysis_${new Date(createdAt).toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="mono">Competitor Analysis</h1>
        <p style={{ color: 'var(--text-muted)' }}>Generate a structured comparison table against key competitors.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        <div className="card">
          <h3 className="mono" style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Analysis Inputs</h3>
          <form onSubmit={handleGenerate}>
            <label>PRODUCT DESCRIPTION</label>
            <textarea 
              required
              name="productDescription"
              value={formData.productDescription}
              onChange={e => setFormData({...formData, productDescription: e.target.value})}
              rows={4}
              placeholder="What exactly are you building?"
            />

            <label>KNOWN COMPETITORS (Optional)</label>
            <textarea 
              name="knownCompetitors"
              value={formData.knownCompetitors}
              onChange={e => setFormData({...formData, knownCompetitors: e.target.value})}
              rows={3}
              placeholder="List any competitors you already know about..."
            />

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'ANALYZING...' : 'ANALYZE COMPETITORS'}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {reports.length === 0 && !loading && (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No competitor analysis generated yet. Fill out the form to create one.
            </div>
          )}
          
          {reports.map((report) => (
            <div key={report._id} className="card" style={{ overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div>
                  <h3 className="mono">Competitor Analysis</h3>
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
              
              <div className="markdown-body table-responsive">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {report.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Competitors;
