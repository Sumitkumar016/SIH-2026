import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNavbar from '../common/TopNavbar';
import { mpApi } from '../../api/mpApi';
import { useAuth } from '../../context/AuthContext';

/**
 * MpDashboardLayout Component
 * Wraps all MP views with TopNavbar configured for MP role,
 * and manages navigation to dedicated WorkDetailPage.
 */
export default function MpDashboardLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mpOverview, setMpOverview] = useState(null);

  const loadData = async () => {
    const data = await mpApi.getMyConstituencyOverview(user?.mpId);
    setMpOverview(data);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleOpenWorkDetail = (work) => {
    if (!work?.workId) return;
    navigate(`/mp/cases/${work.workId}`, { state: { work } });
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
    </div>
  );
}
