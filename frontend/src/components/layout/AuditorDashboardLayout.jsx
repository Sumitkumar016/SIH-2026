import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNavbar from '../common/TopNavbar';
import ErrorBoundary from '../common/loading/ErrorBoundary';
import { auditorApi } from '../../api/auditorApi';

/**
 * AuditorDashboardLayout Component
 * Wraps all Auditor views with TopNavbar configured for Auditor role,
 * and manages case drill-down navigation.
 */
export default function AuditorDashboardLayout() {
  const navigate = useNavigate();
  const [activeQueueCount, setActiveQueueCount] = useState(0);

  const loadAlerts = async () => {
    const queue = await auditorApi.getCaseQueue();
    setActiveQueueCount(queue.total || 0);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleOpenWorkDetail = (work) => {
    if (!work?.workId) return;
    navigate(`/auditor/cases/${work.workId}`, { state: { work } });
  };

  return (
    <div className="min-h-screen bg-white text-[#0F1419] flex flex-col font-sans">
      {/* Top Navbar with Auditor role */}
      <TopNavbar
        role="Auditor"
        alerts={new Array(activeQueueCount).fill({})}
        onSelectAlert={() => {}}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorBoundary>
          <Outlet context={{ onOpenWorkDetail: handleOpenWorkDetail, refreshQueue: loadAlerts }} />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EFF3F4] bg-[#F7F9F9] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Independent Auditor Investigation Portal • Central MoSPI Forensic Audit Wing
          </span>
          <span className="text-slate-400">
            Automated Collusion Detection & Evidence Verification
          </span>
        </div>
      </footer>
    </div>
  );
}
