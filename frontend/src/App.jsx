import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Predict from './pages/Predict';
import LogoMark from './components/LogoMark';

function FullPageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#030712]">
      <div className="absolute inset-0 mesh-grid opacity-30 pointer-events-none" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
        className="relative"
      >
        <div className="w-14 h-14 rounded-full border-2 border-indigo-500/30 border-t-indigo-400" />
      </motion.div>
      <div className="flex items-center gap-3">
        <LogoMark className="w-10 h-10" iconClass="w-5 h-5" />
        <span className="font-display font-semibold text-white tracking-tight">StudentAI</span>
      </div>
      <p className="text-sm text-slate-500">Loading workspace…</p>
    </div>
  );
}

const HomeGate = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeGate><Home /></HomeGate>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/predict" element={<PrivateRoute><Predict /></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
