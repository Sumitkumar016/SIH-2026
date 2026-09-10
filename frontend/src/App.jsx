import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ChatbotWidget from './components/ChatbotWidget';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import StateDashboardLayout from './components/layout/StateDashboardLayout';
import MpDashboardLayout from './components/layout/MpDashboardLayout';
import DistrictDashboardLayout from './components/layout/DistrictDashboardLayout';
import AuditorDashboardLayout from './components/layout/AuditorDashboardLayout';

// Auth Page
import LoginPage from './pages/LoginPage';

// Ministry Pages
import NationalOverviewPage from './pages/NationalOverviewPage';
import FlaggedCasesPage from './pages/FlaggedCasesPage';
import TrendsAnalyticsPage from './pages/TrendsAnalyticsPage';
import PredictiveForecastPage from './pages/PredictiveForecastPage';
import MpPerformancePage from './pages/MpPerformancePage';

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

// Dedicated Work Detail Page
import WorkDetailPage from './pages/WorkDetailPage';

/**
 * RootRedirect Helper
 * Redirects authenticated users to their role-specific default view,
 * and unauthenticated users to the /login page.
 */
function RootRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={user.defaultPath || '/ministry/overview'} replace />;
}

/**
 * CasesRedirect Helper
 * Redirects general /cases/:workId requests to the user's role-scoped path.
 */
function CasesRedirect() {
  const { user, isAuthenticated } = useAuth();
  const { workId } = useParams();
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  const role = user.role || 'ministry';
  return <Navigate to={`/${role}/cases/${workId}`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Ministry (National View) Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ministry']} />}>
            <Route path="/ministry" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/ministry/overview" replace />} />
              <Route path="overview" element={<NationalOverviewPage />} />
              <Route path="mp-performance" element={<MpPerformancePage />} />
              <Route path="flagged" element={<FlaggedCasesPage />} />
              <Route path="trends" element={<TrendsAnalyticsPage />} />
              <Route path="predictions" element={<PredictiveForecastPage />} />
              <Route path="cases/:workId" element={<WorkDetailPage />} />
            </Route>
          </Route>

          {/* State Nodal Authority Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['state']} />}>
            <Route path="/state" element={<StateDashboardLayout />}>
              <Route index element={<Navigate to="/state/overview" replace />} />
              <Route path="overview" element={<StateOverviewPage />} />
              <Route path="cases/:workId" element={<WorkDetailPage />} />
            </Route>
          </Route>

          {/* MP (Individual View) Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['mp']} />}>
            <Route path="/mp" element={<MpDashboardLayout />}>
              <Route index element={<Navigate to="/mp/overview" replace />} />
              <Route path="overview" element={<MpConstituencyOverviewPage />} />
              <Route path="works" element={<MpWorksListPage />} />
              <Route path="cases/:workId" element={<WorkDetailPage />} />
            </Route>
          </Route>

          {/* District Authority Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['district']} />}>
            <Route path="/district" element={<DistrictDashboardLayout />}>
              <Route index element={<Navigate to="/district/overview" replace />} />
              <Route path="overview" element={<DistrictOverviewPage />} />
              <Route path="verification" element={<DistrictVerificationQueuePage />} />
              <Route path="cases/:workId" element={<WorkDetailPage />} />
            </Route>
          </Route>

          {/* Independent Auditor / Investigator Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['auditor']} />}>
            <Route path="/auditor" element={<AuditorDashboardLayout />}>
              <Route index element={<Navigate to="/auditor/queue" replace />} />
              <Route path="queue" element={<AuditorCaseQueuePage />} />
              <Route path="case/:workId" element={<AuditorCaseDetailPage />} />
              <Route path="cases/:workId" element={<WorkDetailPage />} />
              <Route path="vendor" element={<AuditorVendorToolPage />} />
            </Route>
          </Route>

          {/* Shared Dynamic Case Route: /cases/:workId */}
          <Route path="/cases/:workId" element={<CasesRedirect />} />

          {/* Fallback Root Redirects */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
        
        {/* Global Floating Chatbot Assistant */}
        <ChatbotWidget />
      </BrowserRouter>
    </AuthProvider>
  );
}
