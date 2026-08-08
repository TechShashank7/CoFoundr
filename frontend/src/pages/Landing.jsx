import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, BarChart2, FileText, CheckSquare, Target, Code } from 'lucide-react';

// Scroll reveal — fires once per section, never re-triggers
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
    }, { threshold: 0.08 });

    const el = domRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
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
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCTA = () => navigate('/get-started');
  const scrollToHow = (e) => {
    e.preventDefault();
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-container has-texture">

      {/* ── Sticky Navbar ── */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <span className="landing-logo">CoFoundr_</span>
          <button className="btn btn-primary nav-cta" onClick={handleCTA}>
            Launch Your Co-Founder
          </button>
        </div>
      </nav>

      {/* ── Asymmetric Hero ── */}
      <RevealSection className="hero-section hero-asymmetric">
        <div className="hero-left">
          <h1 className="hero-title">
            Your AI co-founder for the parts of building a startup that never sleep
          </h1>
          <p className="hero-subtitle">
            From market research to fundraising prep, get strategic advice and
            automated planning tailored to your business context.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary cta-button" onClick={handleCTA}>
              Launch Your Co-Founder
            </button>
            <a href="#how-it-works" className="secondary-link" onClick={scrollToHow}>
              See how it works ↓
            </a>
          </div>
        </div>

        <div className="hero-right">
          {/* ── Product preview mockup ── */}
          <div className="product-mockup">
            <div className="mockup-header">
              <div className="mockup-dot red"></div>
              <div className="mockup-dot yellow"></div>
              <div className="mockup-dot green"></div>
              <div className="mockup-live-dot"></div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-icon-placeholder active"></div>
                <div className="mockup-icon-placeholder"></div>
                <div className="mockup-icon-placeholder"></div>
                <div className="mockup-icon-placeholder"></div>
              </div>
              <div className="mockup-content">
                <div className="mockup-chat-exchange">
                  <div className="mockup-message user">
                    How should we price our SaaS product?
                  </div>
                  <div className="mockup-message ai">
                    Based on competitors, a freemium model with a $29/mo pro tier fits best — it matches your target ICP and lowers the activation barrier.
                  </div>
                </div>
                <div className="mockup-kanban">
                  <div className="mockup-kanban-col">
                    <div className="mockup-kanban-title">TODO</div>
                    <div className="mockup-task-chip">
                      <span className="task-priority-dot" style={{ background: '#ef4444' }}></span>
                      Landing page copy
                    </div>
                    <div className="mockup-task-chip">
                      <span className="task-priority-dot" style={{ background: '#f59e0b' }}></span>
                      Set up Stripe
                    </div>
                  </div>
                  <div className="mockup-kanban-col">
                    <div className="mockup-kanban-title">IN PROGRESS</div>
                    <div className="mockup-task-chip">
                      <span className="task-priority-dot" style={{ background: '#3b82f6' }}></span>
                      Competitor analysis
                    </div>
                  </div>
                  <div className="mockup-kanban-col">
                    <div className="mockup-kanban-title">DONE</div>
                    <div className="mockup-task-chip">
                      <span className="task-priority-dot" style={{ background: '#22c55e' }}></span>
                      Market sizing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ── How it Works ── */}
      <RevealSection className="how-it-works-section" id="how-it-works">
        <div className="how-it-works-container">
          <div className="step-item">
            <div className="step-circle">
              <span className="step-number">01</span>
            </div>
            <div className="step-text">Tell us about your startup</div>
          </div>
          <div className="step-connector-wrap">
            <div className="step-connector"></div>
          </div>
          <div className="step-item">
            <div className="step-circle">
              <span className="step-number">02</span>
            </div>
            <div className="step-text">Get research, plans, and competitive intel instantly</div>
          </div>
          <div className="step-connector-wrap">
            <div className="step-connector"></div>
          </div>
          <div className="step-item">
            <div className="step-circle">
              <span className="step-number">03</span>
            </div>
            <div className="step-text">Execute with a task board that keeps you moving</div>
          </div>
        </div>
      </RevealSection>

      {/* ── Feature Grid ── */}
      <RevealSection className="features-section v2">
        <div className="feature-grid v2-grid">

          {/* Flagship 1 — Competitor Analysis */}
          <div className="card feature-card feature-card-flagship">
            <span className="flagship-badge">CORE FEATURE</span>
            <div className="feature-icon-wrap">
              <BarChart2 className="feature-icon" size={22} />
            </div>
            <h3>Competitor Analysis</h3>
            <p>AI-identified competitors plus real local businesses mapped via Google Maps.</p>
          </div>

          {/* Flagship 2 — Task Management */}
          <div className="card feature-card feature-card-flagship">
            <span className="flagship-badge">CORE FEATURE</span>
            <div className="feature-icon-wrap">
              <CheckSquare className="feature-icon" size={22} />
            </div>
            <h3>Task Management</h3>
            <p>AI-suggested next steps with automated notifications.</p>
          </div>

          {/* Standard cards */}
          <div className="card feature-card">
            <div className="feature-icon-wrap">
              <MessageSquare className="feature-icon" size={20} />
            </div>
            <h3>Co-Founder Chat</h3>
            <p>Strategic advice grounded in your startup's context.</p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon-wrap">
              <Search className="feature-icon" size={20} />
            </div>
            <h3>Market Research</h3>
            <p>TAM/SAM/SOM, trends, and customer profiles on demand.</p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon-wrap">
              <FileText className="feature-icon" size={20} />
            </div>
            <h3>Business Plan Generator</h3>
            <p>Structured plans in minutes, not days.</p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon-wrap">
              <Target className="feature-icon" size={20} />
            </div>
            <h3>Fundraising Prep</h3>
            <p>Pitch deck outlines and investor Q&amp;A prep.</p>
          </div>

        </div>
      </RevealSection>

      {/* ── Closing CTA Banner ── */}
      <RevealSection className="closing-cta-section">
        <div className="closing-cta-panel">
          <h2 className="closing-title">Ready to build faster?</h2>
          <button className="btn btn-primary cta-button cta-large" onClick={handleCTA}>
            Launch Your Co-Founder
          </button>
        </div>
      </RevealSection>

      {/* ── Footer ── */}
      <div className="landing-footer-wrap">
        <footer className="landing-footer">
          <div className="footer-content">
            <span className="footer-wordmark">CoFoundr_</span>
            <span className="footer-tagline">Build your startup faster.</span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="footer-github"
          >
            <Code size={18} />
            <span>GitHub</span>
          </a>
        </footer>
      </div>

    </div>
  );
};

export default Landing;
