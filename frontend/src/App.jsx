import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, CheckSquare, FileText, Search, BarChart2, LogOut, ArrowLeftRight } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages placeholders
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Tasks from './pages/Tasks';
import BusinessPlan from './pages/BusinessPlan';
import MarketResearch from './pages/MarketResearch';
import FundraisingPrep from './pages/FundraisingPrep';
import Competitors from './pages/Competitors';
import Login from './pages/Login';
import Register from './pages/Register';
import StartupPicker from './pages/StartupPicker';

const Layout = ({ children, setStartupId }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = () => {
    localStorage.removeItem('activeStartupId');
    setStartupId(null);
    navigate('/startups');
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('activeStartupId');
    setStartupId(null);
    navigate('/');
  };

  return (
    <div className="app-container">
      <div className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="sidebar-header">
          CoFoundr_
        </div>
        <div className="sidebar-nav" style={{ flex: 1 }}>
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
          <NavLink to="/market-research" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <Search size={18} /> Market Research
          </NavLink>
          <NavLink to="/fundraising-prep" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <FileText size={18} /> Fundraising Prep
          </NavLink>
          <NavLink to="/competitors" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <BarChart2 size={18} /> Competitors
          </NavLink>
        </div>
        <div className="sidebar-nav" style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <button className="nav-item" onClick={handleSwitch} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text-muted)' }}>
            <ArrowLeftRight size={18} /> Switch Startup
          </button>
          <button className="nav-item" onClick={handleLogout} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text-muted)' }}>
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  const { user } = useAuth();
  const [startupId, setStartupId] = useState(localStorage.getItem('activeStartupId'));

  if (user && !startupId) {
    return (
      <Routes>
        <Route path="/startups" element={<ProtectedRoute><StartupPicker setStartupId={setStartupId} /></ProtectedRoute>} />
        <Route path="/get-started" element={<ProtectedRoute><Onboarding setStartupId={setStartupId} /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/startups" replace />} />
      </Routes>
    );
  }

  if (!startupId) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout setStartupId={setStartupId}>
      <Routes>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard startupId={startupId} /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat startupId={startupId} /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks startupId={startupId} /></ProtectedRoute>} />
        <Route path="/business-plan" element={<ProtectedRoute><BusinessPlan startupId={startupId} /></ProtectedRoute>} />
        <Route path="/market-research" element={<ProtectedRoute><MarketResearch startupId={startupId} /></ProtectedRoute>} />
        <Route path="/fundraising-prep" element={<ProtectedRoute><FundraisingPrep startupId={startupId} /></ProtectedRoute>} />
        <Route path="/competitors" element={<ProtectedRoute><Competitors startupId={startupId} /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/get-started" element={<Navigate to="/dashboard" replace />} />
        <Route path="/startups" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
