import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNavbar from '../common/TopNavbar';
import ErrorBoundary from '../common/loading/ErrorBoundary';
import { mpladsService } from '../../api/mpladsService';

/**
 * DashboardLayout Component
 * Wraps all Ministry views with shared header, notification streams,
 * and centralized case navigation context.
 */
export default function DashboardLayout() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function loadAlerts() {
      const data = await mpladsService.getNationalOverviewMetrics();
      if (data && data.recentAlerts) {
        setAlerts(data.recentAlerts);
      }
    }
    loadAlerts();
  }, []);

  const handleOpenWorkDetail = (work) => {
    if (!work?.workId) return;
    navigate(`/ministry/cases/${work.workId}`, { state: { work } });
  };

  return (
    <div className="min-h-screen bg-white text-[#0F1419] flex flex-col font-sans">
      {/* Top Navbar with Alerts & Tabs */}
      <TopNavbar
        alerts={alerts}
        onSelectAlert={(alertItem) => handleOpenWorkDetail(alertItem)}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorBoundary>
          {/* Pass handleOpenWorkDetail to child routes via context */}
          <Outlet context={{ onOpenWorkDetail: handleOpenWorkDetail }} />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EFF3F4] bg-[#F7F9F9] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Smart India Hackathon 2026 • MPLADS AI Risk Screening & Early Warning System
          </span>
          <span className="text-slate-400">
            Powered by Automated Geospatial & Financial Risk ML Models
          </span>
        </div>
      </footer>
    </div>
  );
}
