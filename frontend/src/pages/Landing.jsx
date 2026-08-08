import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, BarChart2, FileText, CheckSquare, Target } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Hero */}
      <div className="hero-section">
        <h1 className="hero-logo mono">CoFoundr_</h1>
        <h2 className="hero-title">Your AI co-founder for the parts of building a startup that never sleep</h2>
        <p className="hero-subtitle">
          From market research to fundraising prep, get strategic advice and automated planning tailored to your business context.
        </p>
        <button className="btn btn-primary cta-button" onClick={() => navigate('/get-started')}>
          Launch Your Co-Founder
        </button>
      </div>

      {/* Feature grid */}
      <div className="features-section">
        <div className="feature-grid">
          <div className="card feature-card">
            <MessageSquare className="feature-icon" size={24} />
            <h3 className="mono">Co-Founder Chat</h3>
            <p>Strategic advice grounded in your startup's context.</p>
          </div>
          <div className="card feature-card">
            <Search className="feature-icon" size={24} />
            <h3 className="mono">Market Research</h3>
            <p>TAM/SAM/SOM, trends, and customer profiles on demand.</p>
          </div>
          <div className="card feature-card">
            <BarChart2 className="feature-icon" size={24} />
            <h3 className="mono">Competitor Analysis</h3>
            <p>AI-identified competitors plus real local businesses mapped via Google Maps.</p>
          </div>
          <div className="card feature-card">
            <FileText className="feature-icon" size={24} />
            <h3 className="mono">Business Plan Generator</h3>
            <p>Structured plans in minutes, not days.</p>
          </div>
          <div className="card feature-card">
            <Target className="feature-icon" size={24} />
            <h3 className="mono">Fundraising Prep</h3>
            <p>Pitch deck outlines and investor Q&A prep.</p>
          </div>
          <div className="card feature-card">
            <CheckSquare className="feature-icon" size={24} />
            <h3 className="mono">Task Management</h3>
            <p>AI-suggested next steps with automated notifications.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <p className="mono">CoFoundr_</p>
        <p className="footer-tagline">Build your startup faster.</p>
      </footer>
    </div>
  );
};

export default Landing;
