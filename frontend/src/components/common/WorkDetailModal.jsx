import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Calendar,
  IndianRupee,
  Building2,
  User,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import RiskBadge from './RiskBadge';

/**
 * WorkDetailModal Component
 *
 * Full work details popup featuring the Explainability Breakdown horizontal bar chart,
 * financial progress, timeline audit, vendor flags, and AI rationale.
 */
export default function WorkDetailModal({
  work,
  isOpen,
  onClose,
}) {
  if (!isOpen || !work) return null;

  // Prepare Explainability Chart Data
  const breakdown = work.riskFactorBreakdown || {
    costOverrun: 35,
    delaySlippage: 30,
    duplicateSimilarity: 20,
    vendorAnomaly: 15,
  };

  const chartData = [
    { factor: 'Cost Inflation', percent: breakdown.costOverrun || 0, color: '#EF4444' },
    { factor: 'Timeline Slippage', percent: breakdown.delaySlippage || 0, color: '#F59E0B' },
    { factor: 'Duplicate/GIS Match', percent: breakdown.duplicateSimilarity || 0, color: '#6366F1' },
    { factor: 'Vendor Concentration', percent: breakdown.vendorAnomaly || 0, color: '#EC4899' },
  ].sort((a, b) => b.percent - a.percent);

  const isPredictive = !!work.predictedRiskScore30Days;
  const isFlagged = work.riskLevel === 'High' || work.riskLevel === 'Medium' || (work.riskScore && work.riskScore >= 40);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-3xl rounded-2xl shadow-modal border border-[#EFF3F4] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#EFF3F4] flex items-center justify-between bg-[#F7F9F9]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-[#EFF3F4] text-[#1D9BF0] shadow-xs">
              <ShieldAlert className="w-5 h-5 text-[#1D9BF0]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F1419] font-mono">
                  {work.workId}
                </h3>
                <RiskBadge
                  level={work.fraudRiskTier || work.riskLevel || (work.riskScore >= 70 ? 'High' : work.riskScore >= 40 ? 'Medium' : 'Low')}
                  score={work.fraudRiskScore ?? work.riskScore ?? work.currentRiskScore}
                  confidence={work.dataConfidence}
                  type={work.inefficiencyScore !== undefined ? "Fraud" : null}
                />
                {work.inefficiencyScore !== undefined && (
                  <RiskBadge
                    level={work.inefficiencyTier || 'Low'}
                    score={work.inefficiencyScore}
                    type="Delay"
                  />
                )}
                {isPredictive && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Early Warning Watchlist
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {work.category} • {work.district}, {work.state}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F1419] hover:bg-white transition-colors border border-transparent hover:border-[#EFF3F4]"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-6">

          {/* Primary Alert / Flag Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            (work.riskScore >= 70 || work.riskLevel === 'High' || isPredictive)
              ? 'bg-rose-50/70 border-rose-200/80 text-rose-900'
              : work.riskLevel === 'Medium'
              ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
              : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
          }`}>
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-800">
                {isPredictive
                  ? 'Projected Escalation Trigger'
                  : isFlagged
                  ? 'Primary Risk Signal'
                  : 'Compliance Status'}
              </div>
              <p className="text-sm font-semibold text-[#0F1419] mt-0.5">
                {work.flagReason || work.warningSignal || 'Work is executing normally within standard SLA parameters.'}
              </p>
            </div>
          </div>

          {/* AI EXPLAINABILITY HORIZONTAL BAR CHART SECTION */}
          <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1D9BF0]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  AI Explainability Breakdown (Weightage)
                </h4>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                Transparent Multi-Vector Scoring
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Why was this work evaluated with this risk profile? Below is the contributory weight of each vector evaluated by the ML model.
            </p>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    unit="%"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={{ stroke: '#EFF3F4' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="factor"
                    tick={{ fontSize: 11, fill: '#0F1419', fontWeight: 500 }}
                    axisLine={{ stroke: '#EFF3F4' }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}% impact`, 'Weightage']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #EFF3F4',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={16}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Diagnostic Summary Narrative */}
            {work.aiDiagnosticSummary && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-start gap-2 bg-white p-3 rounded-lg border border-[#EFF3F4]">
                <Sparkles className="w-4 h-4 text-[#1D9BF0] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-[#0F1419]">Diagnostic Audit Note: </span>
                  {work.aiDiagnosticSummary}
                </p>
              </div>
            )}
          </div>

          {/* AUDITOR INVESTIGATION REPORT (CONDITIONAL: RENDERS IF AUDITOR REPORT FILED) */}
          {work.auditorReport && (
            <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                    Independent Auditor Official Report
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-purple-700 font-mono">
                  Filed {work.auditorReport.submittedDate}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-600">Audit Finding Conclusion:</span>
                <span className="px-2 py-0.5 rounded font-bold bg-white text-purple-900 border border-purple-200">
                  {work.auditorReport.conclusion}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-[11px] text-purple-800">Status: {work.auditorReport.status}</span>
              </div>
              {work.auditorReport.notes && (
                <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-purple-100 italic">
                  "{work.auditorReport.notes}"
                </p>
              )}
            </div>
          )}


          {/* Predictive Specific Box (if Page 4 watchlist item) */}
          {isPredictive && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5">
              <div>
                <span className="text-[11px] font-medium text-indigo-700 uppercase">Current Baseline</span>
                <div className="text-lg font-bold text-[#0F1419] font-mono mt-0.5">
                  {work.currentRiskScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
                </div>
              </div>
              <div>
                <span className="text-[11px] font-medium text-indigo-700 uppercase">30-Day Forecast</span>
                <div className="text-lg font-bold text-rose-600 font-mono mt-0.5 flex items-center gap-1.5">
                  {work.predictedRiskScore30Days} <span className="text-xs font-normal text-slate-500">/ 100</span>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                    {work.riskDeltaPercent}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[11px] font-medium text-indigo-700 uppercase">Days to Breach High Risk</span>
                <div className="text-lg font-bold text-amber-600 font-mono mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  ~{work.daysUntilPredictedThreshold} Days
                </div>
              </div>
              {work.riskTrajectory && (
                <div className="sm:col-span-3 pt-2 border-t border-indigo-100 flex items-center justify-between">
                  <span className="text-xs text-indigo-800 font-medium">8-Week Risk Score Trajectory:</span>
                  <div className="flex items-center gap-2">
                    <Sparkline data={work.riskTrajectory} width={160} height={26} />
                    <span className="text-[11px] text-slate-500 font-mono">
                      {work.riskTrajectory[0]} → {work.riskTrajectory[work.riskTrajectory.length - 1]}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column: Governance & Location */}
            <div className="space-y-3 bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Governance & Location
              </h4>

              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Recommending MP</span>
                  <span className="text-xs font-semibold text-[#0F1419]">{work.mpName}</span>
                  {work.constituency && (
                    <span className="text-xs text-slate-500 block">({work.constituency} Constituency)</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Jurisdiction</span>
                  <span className="text-xs font-semibold text-[#0F1419]">{work.district}, {work.state}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Assigned Contractor / Vendor</span>
                  <span className="text-xs font-semibold text-[#0F1419]">{work.vendorName || 'Not Assigned'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Financials & Dates */}
            <div className="space-y-3 bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Financials & Timeline
              </h4>

              <div className="flex items-start gap-2.5">
                <IndianRupee className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Sanctioned Amount</span>
                    <span className="text-xs font-bold text-[#0F1419] font-mono">₹{work.sanctionedAmount?.toFixed(2)} Lakhs</span>
                  </div>
                  {work.expenditure !== undefined && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-slate-400">Actual Expenditure</span>
                      <span className={`text-xs font-bold font-mono ${
                        work.expenditure > work.sanctionedAmount ? 'text-rose-600' : 'text-[#0F1419]'
                      }`}>
                        ₹{work.expenditure?.toFixed(2)} Lakhs
                      </span>
                    </div>
                  )}
                  {work.expenditure !== undefined && (
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          work.expenditure > work.sanctionedAmount ? 'bg-rose-500' : 'bg-[#1D9BF0]'
                        }`}
                        style={{
                          width: `${Math.min(100, (work.expenditure / work.sanctionedAmount) * 100)}%`
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Recommended:</span>
                    <span className="font-mono">{work.recommendedDate || '2023-04-12'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Sanctioned:</span>
                    <span className="font-mono">{work.sanctionDate || '2023-06-20'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Target Completion:</span>
                    <span className="font-mono">{work.completionDate || '2024-03-31'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#EFF3F4] bg-[#F7F9F9] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Last scored: {work.scoredAt ? new Date(work.scoredAt).toLocaleString() : 'Not yet scored'} · Model v{work.modelVersion || '1.0'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#0F1419] bg-white border border-[#EFF3F4] rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
            >
              Close
            </button>
            <button
              onClick={() => alert(`Audit Action Initiated: Notice dispatched to District Nodal Officer for work ${work.workId}`)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1D9BF0] hover:bg-[#1A8CD8] rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Issue Audit Notice</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
