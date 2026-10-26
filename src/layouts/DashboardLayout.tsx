import React, { useState } from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { ToastContainer } from '../components/ToastContainer';
import { GlobalSearchModal } from '../components/GlobalSearchModal';
import { useApp } from '../context/AppContext';
import { Info, ArrowUpRight } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Academic Disclaimer Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs px-4 py-1.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 truncate">
          <Info className="w-3.5 h-3.5 shrink-0 text-blue-200" />
          <span className="font-medium truncate">
            <strong>CampusEase Usability Prototype:</strong> Redesigned student portal for third-year Computer Engineering HMI lab assessment.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          <Link
            to="/usability-evaluation"
            className="hidden sm:inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded font-semibold transition-colors"
          >
            <span>Live Usability Lab</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
          <Link
            to="/hmi-principles"
            className="hover:underline text-blue-100 hidden md:inline"
          >
            12 HMI Principles
          </Link>
        </div>
      </div>

      {/* Main App Layout */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header onToggleSidebar={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
            <Outlet />
          </main>

          {/* Persistent Footer */}
          <footer className="mt-auto px-6 py-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                CampusEase — Human–Machine Interaction (HMI) Laboratory Assessment
              </p>
              <p className="text-[11px] text-slate-400">
                Department of Computer Engineering • Demonstrating Nielsen-Norman Heuristics & Usability Metrics
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <Link to="/help" className="hover:text-blue-600 dark:hover:text-blue-400">
                Status Glossary
              </Link>
              <Link to="/hmi-principles" className="hover:text-blue-600 dark:hover:text-blue-400">
                HMI Principles
              </Link>
              <Link to="/usability-evaluation" className="hover:text-blue-600 dark:hover:text-blue-400">
                Usability Tasks
              </Link>
            </div>
          </footer>
        </div>
      </div>

      {/* Global Utilities */}
      <ToastContainer />
      <GlobalSearchModal />
    </div>
  );
};
