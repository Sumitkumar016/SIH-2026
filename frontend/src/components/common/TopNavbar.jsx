import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building,
  UserCheck,
  ChevronDown,
  LogOut,
  Sparkles,
  LayoutDashboard,
  AlertTriangle,
  LineChart,
  ListFilter,
  CheckCircle2,
  FileSpreadsheet,
  FileCheck,
  MapPin,
  Landmark,
  Search,
  Fingerprint,
} from 'lucide-react';
import AlertBellIcon from './AlertBellIcon';

/**
 * TopNavbar Component
 * Reusable across Ministry, State, MP, District, and Auditor role dashboards.
 * Dynamically renders role indicator and respective navigation tabs based on `role` prop.
 */
export default function TopNavbar({
  role = 'Ministry', // 'Ministry' | 'State' | 'MP' | 'District' | 'Auditor'
  alerts = [],
  onSelectAlert,
  mpInfo = null,
  districtInfo = null,
  stateInfo = null,
}) {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const isMpRole = role === 'MP' || role === 'Member of Parliament (MP)';
  const isDistrictRole = role === 'District' || role === 'District Authority' || role === 'District Nodal Officer (DNO)';
  const isStateRole = role === 'State' || role === 'State Nodal Authority';
  const isAuditorRole = role === 'Auditor' || role === 'Independent Auditor' || role === 'Investigator';

  let currentRoleLabel = 'Ministry (National View)';
  if (isAuditorRole) currentRoleLabel = 'Independent Auditor';
  if (isStateRole) currentRoleLabel = 'State Nodal Authority';
  if (isMpRole) currentRoleLabel = 'Member of Parliament (MP)';
  if (isDistrictRole) currentRoleLabel = 'District Authority';

  const roles = [
    { name: 'Ministry (National View)', path: '/ministry/overview', desc: 'Central MoSPI oversight & macro analytics' },
    { name: 'State Nodal Authority', path: '/state/overview', desc: 'State-wide district rollup & monitoring' },
    { name: 'Member of Parliament (MP)', path: '/mp/overview', desc: 'Constituency recommendations & progress' },
    { name: 'District Authority', path: '/district/overview', desc: 'District level tenders, ground verification & escalation' },
    { name: 'Independent Auditor', path: '/auditor/queue', desc: 'Forensic investigations & vendor cross-referencing' },
  ];

  // Ministry Navigation Tabs
  const ministryNavLinks = [
    {
      to: '/ministry/overview',
      label: 'National Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/ministry/flagged',
      label: 'All Flagged Cases',
      icon: AlertTriangle,
      badge: alerts.length > 0 ? `${alerts.length}` : null,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      to: '/ministry/trends',
      label: 'Trends & Analytics',
      icon: LineChart,
      badge: null,
    },
    {
      to: '/ministry/predictions',
      label: 'Predictive Risk Forecast',
      icon: Sparkles,
      badge: 'AI Early Warning',
      badgeColor: 'bg-indigo-100 text-indigo-700 font-semibold',
    },
  ];

  // Auditor Navigation Tabs
  const auditorNavLinks = [
    {
      to: '/auditor/queue',
      label: 'High-Risk Case Queue',
      icon: AlertTriangle,
      badge: alerts.length > 0 ? `${alerts.length}` : null,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold',
    },
    {
      to: '/auditor/vendor',
      label: 'Vendor Cross-Reference Tool',
      icon: Fingerprint,
      badge: 'Key Differentiator',
      badgeColor: 'bg-purple-100 text-purple-800 font-bold',
    },
  ];

  // State Navigation Tabs
  const stateNavLinks = [
    {
      to: '/state/overview',
      label: 'State Overview',
      icon: LayoutDashboard,
      badge: null,
    },
  ];

  // MP Navigation Tabs
  const mpNavLinks = [
    {
      to: '/mp/overview',
      label: 'My Constituency Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/mp/works',
      label: 'My Works (Full List)',
      icon: FileSpreadsheet,
      badge: null,
    },
  ];

  // District Authority Navigation Tabs
  const districtNavLinks = [
    {
      to: '/district/overview',
      label: 'District Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/district/verification',
      label: 'Work Verification Queue',
      icon: FileCheck,
      badge: alerts.length > 0 ? `${alerts.length} Pending` : null,
      badgeColor: 'bg-amber-100 text-amber-800 font-semibold',
    },
  ];

  let activeNavLinks = ministryNavLinks;
  if (isAuditorRole) activeNavLinks = auditorNavLinks;
  if (isStateRole) activeNavLinks = stateNavLinks;
  if (isMpRole) activeNavLinks = mpNavLinks;
  if (isDistrictRole) activeNavLinks = districtNavLinks;

  const handleSwitchRole = (targetRole) => {
    setRoleDropdownOpen(false);
    if (targetRole.path) {
      navigate(targetRole.path);
    } else {
      alert(`Switched context to ${targetRole.name}. (Shared components & theme are reusable across all role dashboards)`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EFF3F4] shadow-xs">
      {/* Top Level Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D9BF0] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-[#0F1419] tracking-tight">
                  MPLADS <span className="text-[#1D9BF0]">SENTINEL</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-slate-100 text-slate-700 border border-[#EFF3F4]">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {isAuditorRole
                  ? 'Central Forensic Audit & Investigation Wing • Ministry Oversight'
                  : isStateRole
                  ? (stateInfo ? `${stateInfo.stateName} State Nodal Authority • ${stateInfo.nodalDepartment}` : 'State Nodal Authority • Govt of Bihar')
                  : isMpRole
                  ? (mpInfo ? `${mpInfo.mpName} • ${mpInfo.constituency} (${mpInfo.state})` : 'MP Constituency Portal • Govt of India')
                  : isDistrictRole
                  ? (districtInfo ? `${districtInfo.districtName} District Authority (${districtInfo.state}) • ${districtInfo.nodalOfficer}` : 'District Authority Nodal Portal • Govt of Bihar')
                  : 'Ministry of Statistics & Programme Implementation • Govt of India'}
              </p>
            </div>
          </div>

          {/* Right Action Controls: Role Switcher & Notifications */}
          <div className="flex items-center gap-3">
            
            {/* Notification Bell */}
            <AlertBellIcon alerts={alerts} onSelectAlert={onSelectAlert} />

            <div className="h-6 w-px bg-[#EFF3F4] mx-1" />

            {/* Role Indicator & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#EFF3F4] bg-[#F7F9F9] hover:bg-slate-100 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-white border border-[#EFF3F4] flex items-center justify-center text-[#1D9BF0] shadow-2xs">
                  <Building className="w-4 h-4" />
                </div>
                <div className="hidden md:block">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                    Current Role
                  </span>
                  <span className="text-xs font-bold text-[#0F1419]">
                    {currentRoleLabel}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#EFF3F4] rounded-2xl shadow-hover z-50 overflow-hidden animate-in fade-in duration-150">
                  <div className="p-3 bg-[#F7F9F9] border-b border-[#EFF3F4]">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Switch Role Portal
                    </span>
                  </div>
                  <div className="p-1.5">
                    {roles.map((r) => {
                      const isSelected = isAuditorRole
                        ? r.name.includes('Auditor')
                        : isStateRole
                        ? r.name.includes('State')
                        : isDistrictRole
                        ? r.name.includes('District')
                        : isMpRole
                        ? r.name.includes('Member of Parliament')
                        : r.name.includes('Ministry');

                      return (
                        <button
                          key={r.name}
                          onClick={() => handleSwitchRole(r)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-[#1D9BF0]/10 text-[#1D9BF0] font-bold'
                              : 'hover:bg-[#F7F9F9] text-[#0F1419]'
                          }`}
                        >
                          <UserCheck className="w-4 h-4 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold">{r.name}</div>
                            <div className="text-[11px] text-slate-500 font-normal">{r.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="p-2 bg-[#F7F9F9] border-t border-[#EFF3F4]">
                    <button
                      onClick={() => alert('Logout action performed.')}
                      className="w-full py-1.5 px-3 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pt-1 -mb-px">
          {activeNavLinks.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-[#1D9BF0] text-[#1D9BF0]'
                      : 'border-transparent text-slate-500 hover:text-[#0F1419] hover:border-slate-300'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${tab.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {tab.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
