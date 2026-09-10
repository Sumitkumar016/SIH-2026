import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Info,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  FileText,
  CheckCircle,
  Clock,
  IndianRupee,
  Layers,
  Sparkles,
  Award,
  AlertCircle,
  X,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

/**
 * MP Performance Leaderboard Widget
 * 
 * Scoped strictly to MP recommendation & fund utilization performance:
 * - Primary ranking metric: Fund Utilization % (Expenditure / Sanctioned Amount)
 * - Secondary supporting metric: Completion Efficiency Rate %
 * - Excludes risk scores and anomaly counts to maintain fairness to MPs
 * - Uses neutral Twitter-blue branding (NO red/amber/green risk colors)
 */
import { TableSkeleton } from './loading';

export default function MpLeaderboardWidget({ leaderboardData }) {
  const [activeTab, setActiveTab] = useState('top5'); // 'top5' or 'bottom5'
  const [expandedMpName, setExpandedMpName] = useState(null);
  const [selectedMpForModal, setSelectedMpForModal] = useState(null);

  if (!leaderboardData) {
    return (
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <TableSkeleton rows={5} columns={4} />
      </div>
    );
  }

  const { top5 = [], bottom5 = [] } = leaderboardData;
  const currentList = activeTab === 'top5' ? top5 : bottom5;

  const toggleExpand = (mpName, e) => {
    e.stopPropagation();
    setExpandedMpName(expandedMpName === mpName ? null : mpName);
  };

  const handleRowClick = (mp) => {
    setSelectedMpForModal(mp);
  };

  return (
    <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
      {/* Header with Title, Explanatory Caption, and View Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#EFF3F4]">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-lg border border-sky-100">
              <Award className="w-4 h-4 text-[#1D9BF0]" />
            </span>
            <h2 className="text-base font-bold text-[#0F1419] tracking-tight">
              MP Performance Leaderboard
            </h2>
            <span className="text-[11px] font-semibold font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
              Fund Utilization Metric
            </span>
          </div>
          {/* Explanatory Caption */}
          <p className="text-xs text-slate-500 leading-relaxed">
            Ranked by fund utilization; completion efficiency shown as a supporting metric — reflects MP recommendation activity, not execution or ground-level compliance, which is tracked separately under District and Auditor oversight.
          </p>
        </div>

        {/* Actions: Top 5 / Bottom 5 Tabs & View All Button */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="flex items-center gap-1 bg-[#F7F9F9] p-1 rounded-xl border border-[#EFF3F4]">
            <button
              onClick={() => {
                setActiveTab('top5');
                setExpandedMpName(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'top5'
                  ? 'bg-white text-[#1D9BF0] shadow-xs border border-sky-100'
                  : 'text-slate-500 hover:text-[#0F1419]'
              }`}
            >
              <TrendingUp className={`w-3.5 h-3.5 ${activeTab === 'top5' ? 'text-[#1D9BF0]' : 'text-slate-400'}`} />
              <span>Top 5</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('bottom5');
                setExpandedMpName(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'bottom5'
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-[#0F1419]'
              }`}
            >
              <TrendingDown className={`w-3.5 h-3.5 ${activeTab === 'bottom5' ? 'text-slate-700' : 'text-slate-400'}`} />
              <span>Bottom 5</span>
            </button>
          </div>

          <Link
            to="/ministry/mp-performance"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1D9BF0] text-white hover:bg-[#1A8CD8] transition-colors shadow-xs"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Oversight Guidance Hint for Bottom 5 */}
      {activeTab === 'bottom5' && (
        <div className="mt-3.5 p-2.5 bg-sky-50/50 border border-sky-100 rounded-xl flex items-center gap-2 text-xs text-sky-800">
          <Info className="w-4 h-4 text-[#1D9BF0] shrink-0" />
          <span>
            <strong>Oversight Notice:</strong> MPs with low fund utilization may require administrative reminders to accelerate recommendation of developmental works for their constituency.
          </span>
        </div>
      )}

      {/* Ranked Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#EFF3F4] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3 w-14">Rank</th>
              <th className="py-2.5 px-3">Member of Parliament</th>
              <th className="py-2.5 px-3">State & Constituency</th>
              <th className="py-2.5 px-3 min-w-[200px]">
                <div className="flex items-center gap-1">
                  <span>Fund Utilization %</span>
                  <span className="text-[10px] text-[#1D9BF0] font-normal lowercase">(primary rank)</span>
                </div>
              </th>
              <th className="py-2.5 px-3 text-center">Works Rec.</th>
              <th className="py-2.5 px-3 text-center">Completed</th>
              <th className="py-2.5 px-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <span>Completion Rate</span>
                  <span className="text-[10px] text-slate-400 font-normal lowercase">(secondary)</span>
                </div>
              </th>
              <th className="py-2.5 px-2 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFF3F4]">
            {currentList.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-xs text-slate-500">
                  No MP performance data available.
                </td>
              </tr>
            ) : (
              currentList.map((mp, index) => {
                const isExpanded = expandedMpName === mp.mpName;
                const utilizationDisplay =
                  mp.fundUtilization !== null && !isNaN(mp.fundUtilization)
                    ? `${mp.fundUtilization}%`
                    : 'N/A';
                const completionDisplay =
                  mp.completionRate !== null && !isNaN(mp.completionRate)
                    ? `${mp.completionRate}%`
                    : 'N/A';

                const progressWidth =
                  mp.fundUtilization !== null && !isNaN(mp.fundUtilization)
                    ? Math.min(100, Math.max(0, mp.fundUtilization))
                    : 0;

                return (
                  <React.Fragment key={mp.mpName}>
                    <tr
                      onClick={() => handleRowClick(mp)}
                      className={`text-xs hover:bg-[#F7F9F9] transition-colors cursor-pointer group ${
                        isExpanded ? 'bg-[#F7F9F9]/80' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3 px-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                            activeTab === 'top5' && index === 0
                              ? 'bg-sky-100 text-[#1D9BF0] border border-sky-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          #{index + 1}
                        </span>
                      </td>

                      {/* MP Name */}
                      <td className="py-3 px-3 font-semibold text-[#0F1419] group-hover:text-[#1D9BF0] transition-colors">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1D9BF0]" />
                          <span>{mp.mpName}</span>
                        </div>
                      </td>

                      {/* State & Constituency */}
                      <td className="py-3 px-3 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-[#0F1419]">{mp.state}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 font-mono text-[11px] bg-slate-50 px-1.5 py-0.5 rounded border border-[#EFF3F4]">
                            {mp.constituency}
                          </span>
                        </div>
                      </td>

                      {/* Fund Utilization % (Primary Ranking Metric) */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono font-bold">
                            <span className="text-[#0F1419]">{utilizationDisplay}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ₹{mp.totalExpenditure}L / ₹{mp.totalSanctionedAmount}L
                            </span>
                          </div>
                          {/* Twitter-blue neutral progress bar (NO risk colors) */}
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                            <div
                              className="h-2 rounded-full bg-[#1D9BF0] transition-all duration-500"
                              style={{ width: `${progressWidth}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Total Works Recommended */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                        {mp.totalWorks}
                      </td>

                      {/* Total Works Completed */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                        {mp.completedWorks}
                      </td>

                      {/* Completion Rate % (Secondary Supporting Metric) */}
                      <td className="py-3 px-3 text-right">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {completionDisplay}
                        </span>
                      </td>

                      {/* Expand / Collapse Button */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={(e) => toggleExpand(mp.mpName, e)}
                          title="Toggle Quick Summary"
                          className="p-1 rounded-lg text-slate-400 hover:text-[#1D9BF0] hover:bg-sky-50 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Inline Expandable Summary Drawer */}
                    {isExpanded && (
                      <tr className="bg-[#F7F9F9] border-b border-[#EFF3F4]">
                        <td colSpan="8" className="p-4">
                          <div className="bg-white rounded-xl p-4 border border-[#EFF3F4] shadow-xs space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#EFF3F4]">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-[#0F1419]">
                                  {mp.mpName} — Aggregate Recommendation Profile
                                </span>
                                <span className="text-[10px] bg-sky-50 text-[#1D9BF0] font-semibold px-2 py-0.5 rounded border border-sky-200">
                                  {mp.constituency}, {mp.state}
                                </span>
                              </div>
                              <button
                                onClick={() => setSelectedMpForModal(mp)}
                                className="text-xs text-[#1D9BF0] font-semibold hover:underline flex items-center gap-1"
                              >
                                View full aggregate overview →
                              </button>
                            </div>

                            {/* Micro KPI Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="p-2.5 bg-[#F7F9F9] rounded-lg border border-[#EFF3F4]">
                                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                                  Fund Utilization
                                </span>
                                <span className="text-base font-extrabold font-mono text-[#1D9BF0]">
                                  {utilizationDisplay}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  ₹{mp.totalExpenditure}L spent of ₹{mp.totalSanctionedAmount}L
                                </span>
                              </div>

                              <div className="p-2.5 bg-[#F7F9F9] rounded-lg border border-[#EFF3F4]">
                                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                                  Completion Efficiency
                                </span>
                                <span className="text-base font-extrabold font-mono text-slate-800">
                                  {completionDisplay}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  {mp.completedWorks} of {mp.totalWorks} completed
                                </span>
                              </div>

                              <div className="p-2.5 bg-[#F7F9F9] rounded-lg border border-[#EFF3F4]">
                                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                                  Active Pipeline
                                </span>
                                <span className="text-base font-extrabold font-mono text-slate-800">
                                  {mp.ongoingWorks + mp.underReviewWorks} works
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  {mp.ongoingWorks} ongoing, {mp.underReviewWorks} review
                                </span>
                              </div>

                              <div className="p-2.5 bg-[#F7F9F9] rounded-lg border border-[#EFF3F4]">
                                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                                  Sector Focus
                                </span>
                                <span className="text-xs font-bold text-slate-700 block truncate">
                                  {Object.keys(mp.categories).length} Categories
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                                  {Object.keys(mp.categories).slice(0, 2).join(', ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Widget Footer Bar: View All Link */}
      <div className="mt-3.5 pt-3 border-t border-[#EFF3F4] flex items-center justify-between text-xs">
        <span className="text-slate-500 text-[11px]">
          Showing {activeTab === 'top5' ? 'Top 5 Highest' : 'Bottom 5 Lowest'} Fund Utilization MPs
        </span>
        <Link
          to="/ministry/mp-performance"
          className="inline-flex items-center gap-1 font-semibold text-[#1D9BF0] hover:underline"
        >
          <span>View All MPs (Full Leaderboard Register)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Lightweight Summary Popover / Modal on MP Row Click */}
      {selectedMpForModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedMpForModal(null)}
        >
          <div
            className="bg-white rounded-2xl border border-[#EFF3F4] shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#EFF3F4]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-50 text-[#1D9BF0] border border-sky-100 flex items-center justify-center font-bold font-mono">
                  #{selectedMpForModal.rank || '•'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F1419]">
                    {selectedMpForModal.mpName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedMpForModal.constituency}, {selectedMpForModal.state}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMpForModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Performance Summary Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#F7F9F9] rounded-xl border border-[#EFF3F4]">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                  Fund Utilization %
                </span>
                <span className="text-xl font-extrabold font-mono text-[#1D9BF0]">
                  {selectedMpForModal.fundUtilization !== null ? `${selectedMpForModal.fundUtilization}%` : 'N/A'}
                </span>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div
                    className="h-1.5 rounded-full bg-[#1D9BF0]"
                    style={{ width: `${Math.min(100, selectedMpForModal.fundUtilization || 0)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>₹{selectedMpForModal.totalExpenditure}L spent</span>
                  <span>₹{selectedMpForModal.totalSanctionedAmount}L sanctioned</span>
                </div>
              </div>

              <div className="p-3 bg-[#F7F9F9] rounded-xl border border-[#EFF3F4]">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                  Completion Efficiency
                </span>
                <span className="text-xl font-extrabold font-mono text-slate-800">
                  {selectedMpForModal.completionRate !== null ? `${selectedMpForModal.completionRate}%` : 'N/A'}
                </span>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div
                    className="h-1.5 rounded-full bg-slate-700"
                    style={{ width: `${Math.min(100, selectedMpForModal.completionRate || 0)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>{selectedMpForModal.completedWorks} completed</span>
                  <span>{selectedMpForModal.totalWorks} recommended</span>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-[#0F1419] mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#1D9BF0]" />
                <span>Recommended Work Sectors</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(selectedMpForModal.categories).map(([cat, count]) => (
                  <span
                    key={cat}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-[#EFF3F4] font-medium"
                  >
                    {cat} <span className="font-mono text-slate-400 font-bold">({count})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Scope / Governance Clarification Note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-[#EFF3F4] text-[11px] text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 block">Governance Note:</span>
              <p>
                This scorecard aggregates MP recommendation velocity and fund utilization. Individual project execution, contractor adherence, and anomaly resolution are monitored separately under District Authority and Auditor portals.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMpForModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
