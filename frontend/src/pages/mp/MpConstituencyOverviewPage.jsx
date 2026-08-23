import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  IndianRupee,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import RiskBadge from '../../components/common/RiskBadge';
import { mpApi } from '../../api/mpApi';

/**
 * PAGE 1: My Constituency Overview (MP Individual View)
 * Route: /mp/overview
 */
export default function MpConstituencyOverviewPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      setLoading(true);
      const res = await mpApi.getMyConstituencyOverview();
      setData(res);
      setLoading(false);
    }
    loadOverview();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D9BF0]" />
      </div>
    );
  }

  const { mp, kpis, flaggedWorks } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* MP HEADER PROFILE CARD */}
      <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#EFF3F4] flex items-center justify-center text-[#1D9BF0] shadow-xs shrink-0 font-black text-xl font-mono">
            {mp.mpName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F1419] tracking-tight">
                {mp.mpName}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-sky-50 text-[#1D9BF0] border border-sky-200">
                {mp.house} • {mp.term}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[#0F1419] font-bold">{mp.constituency}</span> ({mp.state})
              </span>
              <span>•</span>
              <span>District: <span className="text-[#0F1419] font-semibold">{mp.district}</span></span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Nodal Constituency
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            to="/mp/works"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1D9BF0] text-white hover:bg-[#1A8CD8] transition-colors shadow-xs"
          >
            <span>View All My Works</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* SUMMARY KPI CARDS (SCOPED TO THIS MP ONLY) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Allocated Amount */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Annual Allocation</span>
            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 border border-[#EFF3F4]">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            ₹{kpis.annualEntitlementCr.toFixed(2)} <span className="text-sm font-normal text-slate-500">Cr</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            ₹{kpis.annualEntitlementLakhs} Lakhs entitlement
          </div>
        </div>

        {/* Card 2: Total Recommended */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Recommended</span>
            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 border border-[#EFF3F4]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            {kpis.totalRecommendedCount} <span className="text-sm font-normal text-slate-500">Works</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Submitted to District Nodal Officer
          </div>
        </div>

        {/* Card 3: Total Sanctioned */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sanctioned</span>
            <div className="p-1.5 bg-sky-50 rounded-lg text-[#1D9BF0] border border-sky-100">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            {kpis.totalSanctionedCount} <span className="text-sm font-normal text-slate-500">Works</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            ₹{kpis.totalSanctionedLakhs} Lakhs approved
          </div>
        </div>

        {/* Card 4: Total Completed */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">
            {kpis.totalCompletedCount} <span className="text-sm font-normal text-slate-500">Works</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium">
            100% verified asset delivery
          </div>
        </div>

        {/* Card 5: Total Expenditure */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Expenditure</span>
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            ₹{kpis.totalExpenditureCr.toFixed(2)} <span className="text-sm font-normal text-slate-500">Cr</span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-700 font-medium">
            ₹{kpis.totalExpenditureLakhs} Lakhs drawn
          </div>
        </div>

      </div>

      {/* FUND UTILIZATION RATE PROGRESS SECTION */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-[#0F1419]">
                MPLADS Fund Utilization Rate
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cumulative expenditure drawn against the ₹{kpis.annualEntitlementCr.toFixed(2)} Cr annual statutory allocation for {mp.constituency}.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xl font-extrabold text-[#1D9BF0] font-mono">
              {kpis.utilizationRatePercent}%
            </span>
            <span className="text-xs text-slate-500 block font-medium">
              (₹{kpis.totalExpenditureCr.toFixed(2)} Cr of ₹{kpis.annualEntitlementCr.toFixed(2)} Cr utilized)
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#F7F9F9] border border-[#EFF3F4] rounded-full h-3.5 p-0.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#1D9BF0] to-sky-400 transition-all duration-500"
            style={{ width: `${Math.min(100, kpis.utilizationRatePercent)}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#EFF3F4] text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1D9BF0]" />
            <span>Utilized: <strong className="text-[#0F1419] font-mono">₹{kpis.totalExpenditureLakhs} L</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>Uncommitted Balance: <strong className="text-[#0F1419] font-mono">₹{(kpis.annualEntitlementLakhs - kpis.totalExpenditureLakhs).toFixed(1)} L</strong></span>
          </div>
          <div className="flex items-center gap-2 sm:justify-end text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Next Installment SLA: Active</span>
          </div>
        </div>
      </div>

      {/* MY FLAGGED CASES SECTION (REUSING WORKDETAILMODAL WITH JUSTIFICATION) */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F1419]">
                My Flagged Works & Actionable Risk Notices
              </h2>
              <span className="text-[11px] text-slate-500">
                Works in {mp.constituency} flagged by automated AI audit algorithms requiring your clarification
              </span>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
            {flaggedWorks.length} Flagged
          </span>
        </div>

        {/* Empty State vs Flagged Works List */}
        {flaggedWorks.length === 0 ? (
          <div className="p-8 text-center bg-[#F7F9F9] rounded-xl border border-[#EFF3F4]">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#0F1419]">
              No risk flags on your works — all clear!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              All recommended and sanctioned projects in {mp.constituency} are executing within standard milestone schedules and financial ceilings.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {flaggedWorks.map((work) => (
              <div
                key={work.workId}
                onClick={() => onOpenWorkDetail(work)}
                className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/20 hover:bg-white hover:border-[#1D9BF0] hover:shadow-card transition-all cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#0F1419] group-hover:text-[#1D9BF0]">
                      {work.workId}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {work.category}
                    </span>
                  </div>
                  <RiskBadge level={work.riskLevel} score={work.riskScore} size="sm" />
                </div>

                <p className="text-xs font-semibold text-[#0F1419] mb-1">
                  {work.description || work.flagReason}
                </p>

                <div className="p-2.5 rounded-lg bg-white border border-rose-100 text-xs text-rose-900 mb-2">
                  <span className="font-bold text-rose-800 uppercase text-[10px] tracking-wider block">
                    AI Anomaly Trigger:
                  </span>
                  <span>{work.flagReason}</span>
                </div>

                {/* If already submitted a justification */}
                {work.mpJustification && (
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Justification on file:</strong> "{work.mpJustification.justification}"
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <span>Sanctioned: <strong className="font-mono text-slate-700">₹{work.sanctionedAmount?.toFixed(1)}L</strong></span>
                    <span>Vendor: <strong className="text-slate-700">{work.vendorName}</strong></span>
                  </div>

                  <span className="text-[#1D9BF0] font-semibold flex items-center group-hover:translate-x-0.5 transition-transform">
                    {work.mpJustification ? 'Review / Edit Justification' : 'Submit MP Justification'} <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
