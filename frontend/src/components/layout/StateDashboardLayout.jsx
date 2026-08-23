import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../common/TopNavbar';
import WorkDetailModal from '../common/WorkDetailModal';
import { stateApi } from '../../api/stateApi';

/**
 * StateDashboardLayout Component
 * Wraps State Nodal Authority views with TopNavbar configured for State role,
 * and manages the shared WorkDetailModal when drill-down works are inspected.
 */
export default function StateDashboardLayout() {
  const [stateProfile, setStateProfile] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const p = await stateApi.getStateProfile();
      setStateProfile(p);
    }
    loadProfile();
  }, []);

  const handleOpenWorkDetail = (work) => {
    setSelectedWork(work);
    setIsWorkModalOpen(true);
  };

  const handleCloseWorkDetail = () => {
    setIsWorkModalOpen(false);
    setSelectedWork(null);
  };

  return (
    <div className="min-h-screen bg-white text-[#0F1419] flex flex-col font-sans">
      <TopNavbar
        role="State Nodal Authority"
        alerts={[]}
        stateInfo={stateProfile}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet context={{ stateProfile, onOpenWorkDetail: handleOpenWorkDetail }} />
      </main>

      <footer className="border-t border-[#EFF3F4] bg-[#F7F9F9] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            State Nodal Authority Portal • Planning & Development Department, Govt of Bihar
          </span>
          <span className="text-slate-400">
            State-Wide District Rollup & Monitoring Dashboard
          </span>
        </div>
      </footer>

      {/* Shared WorkDetailModal */}
      <WorkDetailModal
        work={selectedWork}
        isOpen={isWorkModalOpen}
        onClose={handleCloseWorkDetail}
        allowJustification={false}
      />
    </div>
  );
}
