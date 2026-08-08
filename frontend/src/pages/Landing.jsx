import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, BarChart2, FileText, CheckSquare, Target, Github } from 'lucide-react';

// Scroll reveal component
const RevealSection = ({ children, className = '', id = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div 
      id={id}
      className={`reveal-section ${isVisible ? 'is-visible' : ''} ${className}`} 
      ref={domRef}
    >
      {children}
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTA = () => navigate('/get-started');
  
  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-container has-texture">
      {/* Sticky Navbar */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <div className="landing-logo mono">CoFoundr_</div>
          <button className="btn btn-primary nav-cta" onClick={handleCTA}>
            Launch Your Co-Founder
          </button>
        </div>
      </nav>

      {/* Asymmetric Hero */}
      <RevealSection className="hero-section hero-asymmetric">
        <div className="hero-left">
          <h1 className="hero-title">Your AI co-founder for the parts of building a startup that never sleep</h1>
          <p className="hero-subtitle">
            From market research to fundraising prep, get strategic advice and automated planning tailored to your business context.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary cta-button" onClick={handleCTA}>
              Launch Your Co-Founder
            </button>
            <a href="#how-it-works" className="secondary-link" onClick={scrollToHowItWorks}>
              See how it works &darr;
            </a>
          </div>
        </div>
        
        <div className="hero-right">
          {/* Product Mockup */}
          <div className="product-mockup">
            <div className="mockup-header">
              <div className="mockup-dot red"></div>
              <div className="mockup-dot yellow"></div>
              <div className="mockup-dot green"></div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-icon-placeholder active"></div>
                <div className="mockup-icon-placeholder"></div>
                <div className="mockup-icon-placeholder"></div>
              </div>
              <div className="mockup-content">
                <div className="mockup-chat-exchange">
                  <div className="mockup-message user">
                    How should we price our SaaS product?
                  </div>
                  <div className="mockup-message ai">
                    Based on competitors, a freemium model with a $29/mo pro tier fits best.
                  </div>
                </div>
                <div className="mockup-kanban">
                  <div className="mockup-kanban-col">
                    <div className="mockup-kanban-title mono">TODO</div>
                    <div className="mockup-task-chip">Draft landing page copy</div>
                    <div className="mockup-task-chip">Set up Stripe</div>
                  </div>
                  <div className="mockup-kanban-col">
                    <div className="mockup-kanban-title mono">IN PROGRESS</div>
                    <div className="mockup-task-chip">Competitor analysis</div>
                  </div>
                  <div className="mockup-kanban-col">
                    <div className="mockup-kanban-title mono">DONE</div>
                    <div className="mockup-task-chip">Market sizing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* How it Works */}
      <RevealSection className="how-it-works-section" id="how-it-works">
        <div className="how-it-works-container">
          <div className="step-item">
            <div className="step-number mono">01</div>
            <div className="step-text">Tell us about your startup</div>
          </div>
          <div className="step-connector"></div>
          <div className="step-item">
            <div className="step-number mono">02</div>
            <div className="step-text">Get research, plans, and competitive intel instantly</div>
          </div>
          <div className="step-connector"></div>
          <div className="step-item">
            <div className="step-number mono">03</div>
            <div className="step-text">Execute with a task board that keeps you moving</div>
          </div>
        </div>
      </RevealSection>

      {/* Feature Grid v2 */}
      <RevealSection className="features-section v2">
        <div className="feature-grid v2-grid">
          {/* Flagship Cards */}
          <div className="card feature-card feature-card-flagship">
            <BarChart2 className="feature-icon" size={32} />
            <h3 className="mono">Competitor Analysis</h3>
            <p>AI-identified competitors plus real local businesses mapped via Google Maps.</p>
          </div>
          
          <div className="card feature-card feature-card-flagship">
            <CheckSquare className="feature-icon" size={32} />
            <h3 className="mono">Task Management</h3>
            <p>AI-suggested next steps with automated notifications.</p>
          </div>

          {/* Standard Cards */}
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
            <FileText className="feature-icon" size={24} />
            <h3 className="mono">Business Plan Generator</h3>
            <p>Structured plans in minutes, not days.</p>
          </div>
          <div className="card feature-card">
            <Target className="feature-icon" size={24} />
            <h3 className="mono">Fundraising Prep</h3>
            <p>Pitch deck outlines and investor Q&A prep.</p>
          </div>
        </div>
      </RevealSection>

      {/* Closing CTA Banner */}
      <RevealSection className="closing-cta-section">
        <div className="closing-cta-panel">
          <h2 className="closing-title">Ready to build faster?</h2>
          <button className="btn btn-primary cta-button cta-large" onClick={handleCTA}>
            Launch Your Co-Founder
          </button>
        </div>
      </RevealSection>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p className="mono">CoFoundr_</p>
          <p className="footer-tagline">Build your startup faster.</p>
        </div>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-github">
          <Github size={20} />
        </a>
      </footer>
    </div>
  );
};

export default Landing;
