import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PortfolioManager from './pages/PortfolioManager';
import ServicesManager from './pages/ServicesManager';
import PricingManager from './pages/PricingManager';
import AboutManager from './pages/AboutManager';
import LeadManager from './pages/LeadManager';
import Sidebar from './components/Sidebar';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AdminAppContent() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      {user && <Sidebar />}
      <div className={`flex-1 ${user ? 'ml-64' : ''}`}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><PortfolioManager /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><ServicesManager /></ProtectedRoute>} />
          <Route path="/pricing" element={<ProtectedRoute><PricingManager /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><AboutManager /></ProtectedRoute>} />
          <Route path="/leads" element={<ProtectedRoute><LeadManager /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminAppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
