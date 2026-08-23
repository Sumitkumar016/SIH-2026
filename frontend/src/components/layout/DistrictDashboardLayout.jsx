import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../common/TopNavbar';
import WorkDetailModal from '../common/WorkDetailModal';
import { districtApi } from '../../api/districtApi';

/**
 * DistrictDashboardLayout Component
 * Wraps all District Authority views with TopNavbar configured for District role,
 * and manages the shared WorkDetailModal.
 */
export default function DistrictDashboardLayout() {
  const [districtProfile, setDistrictProfile] = useState(null);
  const [queueCount, setQueueCount] = useState(0);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    const profile = await districtApi.getDistrictProfile();
    setDistrictProfile(profile);
    const queue = await districtApi.getVerificationQueue();
    setQueueCount(queue.total || 0);
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

  return (
    <div className="min-h-screen bg-white text-[#0F1419] flex flex-col font-sans">
      {/* Top Navbar with District role */}
      <TopNavbar
        role="District Authority"
        alerts={new Array(queueCount).fill({})}
        onSelectAlert={() => {}}
        districtInfo={districtProfile}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet context={{ onOpenWorkDetail: handleOpenWorkDetail, districtProfile, refreshData: loadData }} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EFF3F4] bg-[#F7F9F9] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            District Nodal Authority Portal • MPLADS Ground Verification & Escalation Cell
          </span>
          <span className="text-slate-400">
            District Magistrate & Collectorate Administration
          </span>
        </div>
      </footer>

      {/* Shared WorkDetailModal */}
      <WorkDetailModal
        work={selectedWork}
        isOpen={isModalOpen}
        onClose={handleCloseWorkDetail}
        allowJustification={false}
      />
    </div>
  );
}
