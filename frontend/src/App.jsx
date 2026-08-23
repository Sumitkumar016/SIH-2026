import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import StateDashboardLayout from './components/layout/StateDashboardLayout';
import MpDashboardLayout from './components/layout/MpDashboardLayout';
import DistrictDashboardLayout from './components/layout/DistrictDashboardLayout';
import AuditorDashboardLayout from './components/layout/AuditorDashboardLayout';

// Ministry Pages
import NationalOverviewPage from './pages/NationalOverviewPage';
import FlaggedCasesPage from './pages/FlaggedCasesPage';
import TrendsAnalyticsPage from './pages/TrendsAnalyticsPage';
import PredictiveForecastPage from './pages/PredictiveForecastPage';

// State Pages
import StateOverviewPage from './pages/state/StateOverviewPage';

// MP Pages
import MpConstituencyOverviewPage from './pages/mp/MpConstituencyOverviewPage';
import MpWorksListPage from './pages/mp/MpWorksListPage';

// District Pages
import DistrictOverviewPage from './pages/district/DistrictOverviewPage';
import DistrictVerificationQueuePage from './pages/district/DistrictVerificationQueuePage';

// Auditor Pages
import AuditorCaseQueuePage from './pages/auditor/AuditorCaseQueuePage';
import AuditorCaseDetailPage from './pages/auditor/AuditorCaseDetailPage';
import AuditorVendorToolPage from './pages/auditor/AuditorVendorToolPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ministry (National View) Dashboard Routes */}
        <Route path="/ministry" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/ministry/overview" replace />} />
          <Route path="overview" element={<NationalOverviewPage />} />
          <Route path="flagged" element={<FlaggedCasesPage />} />
          <Route path="trends" element={<TrendsAnalyticsPage />} />
          <Route path="predictions" element={<PredictiveForecastPage />} />
        </Route>

        {/* State Nodal Authority Dashboard Routes */}
        <Route path="/state" element={<StateDashboardLayout />}>
          <Route index element={<Navigate to="/state/overview" replace />} />
          <Route path="overview" element={<StateOverviewPage />} />
        </Route>

        {/* MP (Individual View) Dashboard Routes */}
        <Route path="/mp" element={<MpDashboardLayout />}>
          <Route index element={<Navigate to="/mp/overview" replace />} />
          <Route path="overview" element={<MpConstituencyOverviewPage />} />
          <Route path="works" element={<MpWorksListPage />} />
        </Route>

        {/* District Authority Dashboard Routes */}
        <Route path="/district" element={<DistrictDashboardLayout />}>
          <Route index element={<Navigate to="/district/overview" replace />} />
          <Route path="overview" element={<DistrictOverviewPage />} />
          <Route path="verification" element={<DistrictVerificationQueuePage />} />
        </Route>

        {/* Independent Auditor / Investigator Dashboard Routes */}
        <Route path="/auditor" element={<AuditorDashboardLayout />}>
          <Route index element={<Navigate to="/auditor/queue" replace />} />
          <Route path="queue" element={<AuditorCaseQueuePage />} />
          <Route path="case/:workId" element={<AuditorCaseDetailPage />} />
          <Route path="vendor" element={<AuditorVendorToolPage />} />
        </Route>

        {/* Fallback Root Redirect */}
        <Route path="/" element={<Navigate to="/ministry/overview" replace />} />
        <Route path="*" element={<Navigate to="/ministry/overview" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
