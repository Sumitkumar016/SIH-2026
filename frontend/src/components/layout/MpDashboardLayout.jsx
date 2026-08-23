import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../common/TopNavbar';
import WorkDetailModal from '../common/WorkDetailModal';
import { mpApi } from '../../api/mpApi';

/**
 * MpDashboardLayout Component
 * Wraps all MP views with TopNavbar configured for MP role,
 * and manages the shared WorkDetailModal with `allowJustification={true}`.
 */
export default function MpDashboardLayout() {
  const [mpOverview, setMpOverview] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    const data = await mpApi.getMyConstituencyOverview();
    setMpOverview(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenWorkDetail = (work) => {
    setSelectedWork(work);
    setIsModalOpen(true);
  };

  const handleCloseWorkDetail = () => {
    setIsModalOpen(false);
    setSelectedWork(null);
  };

  const handleJustificationSubmitted = async (workId, text) => {
    await mpApi.submitWorkJustification(workId, text);
    // Refresh MP data to sync
    await loadData();
  };

  const alerts = mpOverview?.flaggedWorks || [];

  return (
    <div className="min-h-screen bg-white text-[#0F1419] flex flex-col font-sans">
      {/* Top Navbar with MP role */}
      <TopNavbar
        role="MP"
        alerts={alerts}
        onSelectAlert={(alertItem) => handleOpenWorkDetail(alertItem)}
        mpInfo={mpOverview?.mp}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet context={{ onOpenWorkDetail: handleOpenWorkDetail, mpOverview, refreshData: loadData }} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EFF3F4] bg-[#F7F9F9] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Member of Parliament Constituency Portal • MPLADS Scheme Management
          </span>
          <span className="text-slate-400">
            Automated Milestone Tracking & Compliance Support
          </span>
        </div>
      </footer>

      {/* Global WorkDetailModal with MP Justification enabled */}
      <WorkDetailModal
        work={selectedWork}
        isOpen={isModalOpen}
        onClose={handleCloseWorkDetail}
        allowJustification={true}
        onSubmitJustification={handleJustificationSubmitted}
      />
    </div>
  );
}
