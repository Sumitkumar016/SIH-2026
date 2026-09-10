import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNavbar from '../common/TopNavbar';
import ErrorBoundary from '../common/loading/ErrorBoundary';
import { districtApi } from '../../api/districtApi';
import { useAuth } from '../../context/AuthContext';

/**
 * DistrictDashboardLayout Component
 * Wraps all District Authority views with TopNavbar configured for District role,
 * and manages case drill-down navigation.
 */
export default function DistrictDashboardLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [districtProfile, setDistrictProfile] = useState(null);
  const [queueCount, setQueueCount] = useState(0);

  const loadData = async () => {
    const profile = await districtApi.getDistrictProfile(user?.districtId);
    setDistrictProfile(profile);
    const queue = await districtApi.getVerificationQueue(user?.districtId);
    setQueueCount(queue.total || 0);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleOpenWorkDetail = (work) => {
    if (!work?.workId) return;
    navigate(`/district/cases/${work.workId}`, { state: { work } });
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
        <ErrorBoundary>
          <Outlet context={{ onOpenWorkDetail: handleOpenWorkDetail, districtProfile, refreshData: loadData }} />
        </ErrorBoundary>
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
    </div>
  );
}
