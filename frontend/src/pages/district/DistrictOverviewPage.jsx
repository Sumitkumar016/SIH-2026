import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  IndianRupee,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MapPin,
  User,
  ShieldAlert,
  ArrowUpRight,
  FileCheck,
  ExternalLink,
  Layers,
} from 'lucide-react';
import RiskBadge from '../../components/common/RiskBadge';
import {
  CardSkeleton,
  ListSkeleton,
  ErrorState,
} from '../../components/common/loading';
import { districtApi } from '../../api/districtApi';

/**
 * PAGE 1: District Overview (District Authority View)
 * Route: /district/overview
 */
export default function DistrictOverviewPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMp, setExpandedMp] = useState(null);

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await districtApi.getDistrictOverview();
      setData(res);
      // Auto-expand first MP for demo scannability
      if (res.mpBreakdown && res.mpBreakdown.length > 0) {
        setExpandedMp(res.mpBreakdown[0].mpName);
      }
    } catch (err) {
      console.error('Failed to load district overview:', err);
      setError(err?.message || 'Failed to retrieve district telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const district = data?.district || {
    districtName: 'Patna',
    headquarters: 'Patna Collectorate',
    state: 'Bihar',
    nodalOfficer: 'District Magistrate & Collector',
  };
  const kpis = data?.kpis;
  const mpBreakdown = data?.mpBreakdown || [];

  const toggleExpand = (mpName) => {
    setExpandedMp(prev => prev === mpName ? null : mpName);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* DISTRICT HEADER PROFILE CARD */}
      <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#EFF3F4] flex items-center justify-center text-[#1D9BF0] shadow-xs shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F1419] tracking-tight">
                {district.districtName} District Authority
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-sky-50 text-[#1D9BF0] border border-sky-200">
                {district.state} • Nodal Office
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[#0F1419] font-bold">{district.headquarters}</span>
              </span>
              <span>•</span>
              <span className="text-slate-700">{district.nodalOfficer}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            to="/district/verification"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1D9BF0] text-white hover:bg-[#1A8CD8] transition-colors shadow-xs"
          >
            <FileCheck className="w-4 h-4" />
            <span>Open Verification Queue</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {error && !data ? (
        <ErrorState
          title="District Telemetry Offline"
          message={error}
          onRetry={loadOverview}
        />
      ) : !data ? (
        <>
          <CardSkeleton count={4} />
          <ListSkeleton count={3} title="MP Portfolio Breakdown" />
        </>
      ) : (
        <>
          {/* SUMMARY KPI CARDS (SCOPED TO THIS DISTRICT) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Works */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Works in District</span>
            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 border border-[#EFF3F4]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            {kpis.totalWorks} <span className="text-sm font-normal text-slate-500">Active</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Across {mpBreakdown.length} MPs (Lok Sabha & Rajya Sabha)
          </div>
        </div>

        {/* Card 2: Total Sanctioned */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sanctioned Volume</span>
            <div className="p-1.5 bg-sky-50 rounded-lg text-[#1D9BF0] border border-sky-100">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            ₹{kpis.totalSanctionedCr.toFixed(2)} <span className="text-sm font-normal text-slate-500">Cr</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            {kpis.totalSanctionedCount} works sanctioned by Collectorate
          </div>
        </div>

        {/* Card 3: Total Completed */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Works</span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">
            {kpis.totalCompletedCount} <span className="text-sm font-normal text-slate-500">Works</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium font-mono">
            {kpis.completionRate}% district completion rate
          </div>
        </div>

        {/* Card 4: Total Flagged Cases */}
        <div className="bg-white border border-rose-200/80 rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all bg-rose-50/20">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Flagged Anomalies</span>
            <div className="p-1.5 bg-rose-100 rounded-lg text-rose-600 border border-rose-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            {kpis.totalFlaggedCount} <span className="text-sm font-normal text-rose-700">Cases</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-700 font-medium">
            Requires ground audit / DNO verification
          </div>
        </div>

      </div>

      {/* MP-WISE BREAKDOWN SECTION & EXPANDABLE WORKS SUB-TABLE */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-lg">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F1419]">
                MP-Wise Works Breakdown in {district.districtName} District
              </h2>
              <span className="text-[11px] text-slate-500">
                Click on any MP to expand and inspect their specific works running within this district
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {mpBreakdown.length} MPs active
          </span>
        </div>

        {/* MP Breakdown Accordion Table */}
        <div className="divide-y divide-[#EFF3F4] border border-[#EFF3F4] rounded-xl overflow-hidden">
          {mpBreakdown.map((mpEntry) => {
            const isExpanded = expandedMp === mpEntry.mpName;

            return (
              <div key={mpEntry.mpName} className="bg-white">
                {/* MP Summary Row */}
                <div
                  onClick={() => toggleExpand(mpEntry.mpName)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F9F9] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 font-mono">
                      {mpEntry.mpName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#0F1419] flex items-center gap-2">
                        <span>{mpEntry.mpName}</span>
                        <span className="text-xs font-normal text-slate-500">({mpEntry.constituency})</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Sanctioned: <strong className="font-mono text-slate-700">₹{mpEntry.totalSanctionedCr} Cr</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 self-end sm:self-auto">
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#0F1419] font-mono">
                        {mpEntry.totalWorks} Works ({mpEntry.completedCount} Completed)
                      </div>
                      <div className="text-[11px] text-emerald-600 font-semibold">
                        {mpEntry.completionRate}% Completion Rate
                      </div>
                    </div>

                    <div className="text-right min-w-[70px]">
                      {mpEntry.flaggedCount > 0 ? (
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {mpEntry.flaggedCount} Flagged
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          0 Flagged
                        </span>
                      )}
                    </div>

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expandable Works Sub-Table */}
                {isExpanded && (
                  <div className="bg-[#F7F9F9] p-4 border-t border-[#EFF3F4] space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Works by {mpEntry.mpName} in {district.districtName}
                    </div>

                    <div className="space-y-2">
                      {mpEntry.works.map((work) => (
                        <div
                          key={work.workId}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenWorkDetail(work);
                          }}
                          className="bg-white p-3 rounded-xl border border-[#EFF3F4] hover:border-[#1D9BF0] hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono font-bold text-xs text-[#0F1419] group-hover:text-[#1D9BF0]">
                                {work.workId}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs text-slate-600 font-medium truncate">
                                {work.category}
                              </span>
                              <RiskBadge level={work.riskLevel} score={work.riskScore} size="sm" />
                            </div>
                            <p className="text-xs text-slate-700 font-medium line-clamp-1">
                              {work.description || work.flagReason}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 text-xs">
                            <div className="text-right font-mono">
                              <div className="font-bold text-[#0F1419]">₹{work.sanctionedAmount?.toFixed(1)}L</div>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                work.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {work.status}
                              </span>
                            </div>

                            <span className="text-[#1D9BF0] font-semibold flex items-center text-xs group-hover:translate-x-0.5 transition-transform">
                              Inspect <ExternalLink className="w-3 h-3 ml-1" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
        </>
      )}

    </div>
  );
}
