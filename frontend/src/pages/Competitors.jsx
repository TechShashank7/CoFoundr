import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, MapPin } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
  marginBottom: '1.5rem'
};

const Competitors = ({ startupId }) => {
  const [reports, setReports] = useState([]);
  const [mapCompetitors, setMapCompetitors] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default SF
  
  const [aiLoading, setAiLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);

  const [aiFormData, setAiFormData] = useState({
    productDescription: '',
    knownCompetitors: ''
  });

  const [mapFormData, setMapFormData] = useState({
    businessType: '',
    address: ''
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    fetchData();
  }, [startupId]);

  const fetchData = async () => {
    try {
      const [reportsRes, compsRes] = await Promise.all([
        api.get(`/reports?startupId=${startupId}&type=competitor_analysis`),
        api.get(`/competitors/${startupId}`)
      ]);
      setReports(reportsRes.data);
      setMapCompetitors(compsRes.data.filter(c => c.source === 'maps'));
      
      // If there are existing map competitors, center the map on the first one
      if (compsRes.data.length > 0) {
        setMapCenter({ lat: compsRes.data[0].lat, lng: compsRes.data[0].lng });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAiGenerate = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      await api.post('/competitors/analyze', {
        startupId,
        ...aiFormData
      });
      fetchData();
      setAiFormData({ productDescription: '', knownCompetitors: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleMapSearch = async (e) => {
    e.preventDefault();
    setMapLoading(true);
    try {
      const res = await api.post('/competitors/nearby', {
        startupId,
        ...mapFormData
      });
      if (res.data.center) {
        setMapCenter(res.data.center);
      }
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to fetch nearby competitors');
    } finally {
      setMapLoading(false);
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
        <p style={{ color: 'var(--text-muted)' }}>Identify local and global competitors to refine your positioning.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Nearby Competitors Form */}
          <div className="card">
            <h3 className="mono" style={{ marginBottom: '1.5rem', color: '#60a5fa' }}>Find Nearby (Maps)</h3>
            <form onSubmit={handleMapSearch}>
              <label>BUSINESS TYPE / KEYWORD</label>
              <input 
                required
                name="businessType"
                value={mapFormData.businessType}
                onChange={e => setMapFormData({...mapFormData, businessType: e.target.value})}
                placeholder="e.g. coffee shop, gym, clinic"
              />

              <label>LOCATION (Address/City)</label>
              <input 
                required
                name="address"
                value={mapFormData.address}
                onChange={e => setMapFormData({...mapFormData, address: e.target.value})}
                placeholder="e.g. San Francisco, CA"
              />

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', backgroundColor: '#3b82f6' }} disabled={mapLoading}>
                {mapLoading ? 'SEARCHING...' : 'FIND LOCAL COMPETITORS'}
              </button>
            </form>
          </div>

          {/* AI Analysis Form */}
          <div className="card">
            <h3 className="mono" style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>AI Analysis (Global)</h3>
            <form onSubmit={handleAiGenerate}>
              <label>PRODUCT DESCRIPTION</label>
              <textarea 
                required
                name="productDescription"
                value={aiFormData.productDescription}
                onChange={e => setAiFormData({...aiFormData, productDescription: e.target.value})}
                rows={4}
                placeholder="What exactly are you building?"
              />

              <label>KNOWN COMPETITORS (Optional)</label>
              <textarea 
                name="knownCompetitors"
                value={aiFormData.knownCompetitors}
                onChange={e => setAiFormData({...aiFormData, knownCompetitors: e.target.value})}
                rows={3}
                placeholder="List any competitors you already know about..."
              />

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={aiLoading}>
                {aiLoading ? 'ANALYZING...' : 'ANALYZE COMPETITORS'}
              </button>
            </form>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Maps Results View */}
          {(mapCompetitors.length > 0 || mapLoading) && (
            <div className="card">
              <h3 className="mono" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa' }}>
                <MapPin size={20} /> Real Local Businesses (Maps)
              </h3>
              
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={12}
                >
                  {mapCompetitors.map((comp) => (
                    <Marker 
                      key={comp._id} 
                      position={{ lat: comp.lat, lng: comp.lng }} 
                      title={comp.name}
                    />
                  ))}
                </GoogleMap>
              ) : (
                <div style={{ height: '400px', backgroundColor: '#2d3748', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  Loading map...
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {mapCompetitors.map(comp => (
                  <div key={comp._id} style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 'bold' }}>{comp.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{comp.address}</div>
                    {comp.notes && <div style={{ fontSize: '0.85rem', color: 'var(--accent)', marginTop: '0.25rem' }}>{comp.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Analysis View */}
          {reports.map((report) => (
            <div key={report._id} className="card" style={{ overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div>
                  <h3 className="mono" style={{ color: 'var(--accent)' }}>AI-Identified Indirect Competitors</h3>
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

          {reports.length === 0 && mapCompetitors.length === 0 && !aiLoading && !mapLoading && (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No competitor analysis generated yet. Use the forms to find local businesses or generate an AI comparison.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Competitors;
