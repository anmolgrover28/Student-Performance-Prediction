import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LogoMark from './LogoMark';
import ServiceStatus from './ServiceStatus';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/predict', label: 'Predict' },
  ];

  return (
    <motion.nav
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 nav-glass"
    >
      <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <LogoMark className="w-10 h-10 group-hover:scale-105 transition-transform" iconClass="w-5 h-5" />
          <div className="hidden sm:block">
            <span className="font-display font-bold text-white text-lg tracking-tight block leading-tight">StudentAI</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Insights</span>
          </div>
        </Link>

        <div className="flex items-center p-1 rounded-xl bg-slate-900/60 border border-slate-700/40">
          {links.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} className="relative px-4 py-2 rounded-lg text-sm font-medium">
                {active && (
                  <motion.span
                    layoutId="navPill"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg shadow-lg shadow-indigo-500/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={`relative z-10 ${active ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>{label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
          <ServiceStatus />
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white truncate max-w-[140px]">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate max-w-[160px]">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
          >
            Log out
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
