import React from 'react';
import {
  X,
  Building2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  MapPin,
  Layers,
  TrendingUp,
} from 'lucide-react';
import RiskBadge from './RiskBadge';

/**
 * DistrictSummaryModal Component
 * Lightweight drill-down popup for State Nodal Authority dashboard.
 * Displays district KPI summary, Low/Medium/High risk counts, and top 3 highest-risk projects.
 */
export default function DistrictSummaryModal({
  districtSummary,
  isOpen,
  onClose,
  onSelectProject,
}) {
  if (!isOpen || !districtSummary) return null;

  const { district, totalWorks, sanctionedCr, completed, flaggedCount, avgRiskScore, riskBreakdown, topProjects } = districtSummary;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-modal border border-[#EFF3F4] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4.5 bg-[#F7F9F9] border-b border-[#EFF3F4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-xl border border-[#EFF3F4] text-[#1D9BF0] shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F1419]">
                {district} District Summary
              </h3>
              <p className="text-xs text-slate-500">
                State Nodal Oversight • Bihar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F1419] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          
          {/* Total Projects & Sanction Header */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-[#EFF3F4]">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Projects
              </span>
              <div className="text-xl font-extrabold text-[#0F1419] font-mono mt-0.5">
                {totalWorks} <span className="text-xs font-normal text-slate-500">Works</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">
                {completed} Completed ({Math.round((completed / totalWorks) * 100)}%)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-[#EFF3F4]">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Sanctioned Amount
              </span>
              <div className="text-xl font-extrabold text-[#0F1419] font-mono mt-0.5">
                ₹{sanctionedCr?.toFixed(1)} <span className="text-xs font-normal text-slate-500">Cr</span>
              </div>
              <span className="text-[11px] text-slate-500">
                Avg Risk Score: <strong className="font-mono">{avgRiskScore}/100</strong>
              </span>
            </div>
          </div>

          {/* Risk Breakdown: 3 Stat Blocks */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              District Risk Severity Breakdown
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">High Risk</span>
                <span className="text-base font-extrabold text-rose-600 font-mono">{riskBreakdown?.high || 0}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Medium</span>
                <span className="text-base font-extrabold text-amber-600 font-mono">{riskBreakdown?.medium || 0}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Low</span>
                <span className="text-base font-extrabold text-emerald-600 font-mono">{riskBreakdown?.low || 0}</span>
              </div>
            </div>
          </div>

          {/* Top 3 Highest-Risk Projects List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Top 3 Highest-Risk Projects
              </span>
              <span className="text-[11px] text-slate-400">Click to inspect</span>
            </div>

            <div className="space-y-2">
              {topProjects && topProjects.length > 0 ? (
                topProjects.map((proj) => (
                  <div
                    key={proj.workId}
                    onClick={() => onSelectProject(proj)}
                    className="p-3 rounded-xl border border-[#EFF3F4] bg-[#F7F9F9] hover:bg-white hover:border-[#1D9BF0] hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono font-bold text-xs text-[#0F1419] group-hover:text-[#1D9BF0]">
                        {proj.workId}
                      </span>
                      <RiskBadge level={proj.riskLevel} score={proj.riskScore} size="sm" />
                    </div>
                    <p className="text-xs text-slate-700 font-medium line-clamp-1">
                      {proj.description || proj.flagReason}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-200/50">
                      <span>Amount: <strong className="font-mono text-slate-700">₹{proj.sanctionedAmount?.toFixed(1)}L</strong></span>
                      <span className="text-[#1D9BF0] font-semibold flex items-center group-hover:translate-x-0.5 transition-transform">
                        Full Audit Detail <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-xs text-slate-400">
                  No flagged projects found in this district.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-[#F7F9F9] border-t border-[#EFF3F4] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#0F1419] bg-white border border-[#EFF3F4] rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
