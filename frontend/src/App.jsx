import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, CheckSquare, FileText, Search, BarChart2 } from 'lucide-react';
import api from './lib/api';

// Pages placeholders
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Tasks from './pages/Tasks';
import BusinessPlan from './pages/BusinessPlan';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          CoFoundr_
        </div>
        <div className="sidebar-nav">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/chat" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <MessageSquare size={18} /> Co-Founder Chat
          </NavLink>
          <NavLink to="/tasks" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <CheckSquare size={18} /> Tasks
          </NavLink>
          <NavLink to="/business-plan" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <FileText size={18} /> Business Plan
          </NavLink>
          {/* P1 Features placeholders */}
          <NavLink to="/market-research" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <Search size={18} /> Market Research
          </NavLink>
          <NavLink to="/competitors" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <BarChart2 size={18} /> Competitors
          </NavLink>
        </div>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

function App() {
  const [startupId, setStartupId] = useState(localStorage.getItem('startupId'));

  if (!startupId) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Onboarding setStartupId={setStartupId} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard startupId={startupId} />} />
          <Route path="/chat" element={<Chat startupId={startupId} />} />
          <Route path="/tasks" element={<Tasks startupId={startupId} />} />
          <Route path="/business-plan" element={<BusinessPlan startupId={startupId} />} />
          <Route path="/market-research" element={<div>Market Research (Coming soon)</div>} />
          <Route path="/competitors" element={<div>Competitors (Coming soon)</div>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
