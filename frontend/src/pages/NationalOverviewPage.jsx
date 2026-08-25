import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Activity,
  AlertOctagon,
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  IndianRupee,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  ChevronRight,
  Filter,
  Eye,
  Sparkles,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import RiskBadge from '../components/common/RiskBadge';
import MpLeaderboardWidget from '../components/common/MpLeaderboardWidget';
import { mpladsService } from '../api/mpladsService';
import { ministryApi } from '../api/ministryApi';

/**
 * PAGE 1: National Overview (Home / Command Center)
 * Route: /ministry/overview
 */
export default function NationalOverviewPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [data, setData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [selectedStateFilter, setSelectedStateFilter] = useState(null);
  const [viewMode, setViewMode] = useState('density'); // 'density' or 'bar'

  useEffect(() => {
    async function loadData() {
      const [overviewRes, lbRes] = await Promise.all([
        mpladsService.getNationalOverviewMetrics(),
        (ministryApi?.getMpLeaderboard || mpladsService.getMpLeaderboard)(),
      ]);
      setData(overviewRes);
      setLeaderboardData(lbRes);
    }
    loadData();
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D9BF0]" />
      </div>
    );
  }

  const { kpis, statesData, recentAlerts, topAttentionStates } = data;

  // Pie chart data for National Risk Distribution
  const pieData = [
    { name: 'Low Risk', value: kpis.riskDistribution.low, color: '#10B981' },
    { name: 'Medium Risk', value: kpis.riskDistribution.medium, color: '#F59E0B' },
    { name: 'High Risk', value: kpis.riskDistribution.high, color: '#EF4444' },
  ];

  // States formatted for Centerpiece Chart
  const sortedStates = [...statesData].sort((a, b) => b.flaggedCount - a.flaggedCount);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner: National Command Center Status */}
      <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-[#0F1419] tracking-tight">
              India National MPLADS Command Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time multi-state telemetry, anomaly detection, and predictive audit surveillance across 28 States & 8 UTs.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            to="/ministry/predictions"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Early Warning Forecast</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/ministry/flagged"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1D9BF0] text-white hover:bg-[#1A8CD8] transition-colors shadow-xs"
          >
            <span>Review Flagged Cases</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* TOP ROW: SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Works Recommended */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Works Recommended</span>
            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 border border-[#EFF3F4]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            {kpis.totalWorksRecommended.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span className="text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 100%
            </span>
            <span>recommended by MPs</span>
          </div>
        </div>

        {/* Card 2: Total Sanctioned */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sanctioned Works</span>
            <div className="p-1.5 bg-sky-50 rounded-lg text-[#1D9BF0] border border-sky-100">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            {kpis.totalSanctionedWorks.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span className="text-slate-700 font-semibold font-mono">₹{kpis.totalSanctionedCr.toLocaleString()} Cr</span>
            <span>allocated</span>
          </div>
        </div>

        {/* Card 3: Total Completed */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Completed</span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">
            {kpis.totalCompletedWorks.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span className="text-emerald-700 font-semibold font-mono">{kpis.completionRate}%</span>
            <span>national completion rate</span>
          </div>
        </div>

        {/* Card 4: Total Expenditure */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Expenditure</span>
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            ₹{kpis.totalExpenditureCr.toLocaleString()} <span className="text-sm font-normal text-slate-500">Cr</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span className="text-indigo-600 font-semibold font-mono">{kpis.expenditureRatio}%</span>
            <span>fund utilization ratio</span>
          </div>
        </div>

        {/* Card 5: Flagged Cases */}
        <div className="bg-white border border-rose-200/80 rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all bg-rose-50/20">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Flagged Anomalies</span>
            <div className="p-1.5 bg-rose-100 rounded-lg text-rose-600 border border-rose-200">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            {kpis.totalFlaggedCases.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-rose-700 font-medium">
            <span className="font-bold">{kpis.riskDistribution.high} High Risk</span>
            <span>({kpis.flaggedRatePercent}% rate)</span>
          </div>
        </div>
      </div>

      {/* CENTERPIECE: PROMINENT INDIA STATE-WISE ANOMALY DENSITY & SURVEILLANCE */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#EFF3F4]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-lg">
                <MapPin className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-[#0F1419]">
                National Anomaly Surveillance & State Density Heat Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live density breakdown across all States & UTs. States with higher risk density require targeted audit interventions.
            </p>
          </div>

          {/* Toggle View Mode */}
          <div className="flex items-center gap-1 bg-[#F7F9F9] p-1 rounded-xl border border-[#EFF3F4] self-start sm:self-auto">
            <button
              onClick={() => setViewMode('density')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'density'
                  ? 'bg-white text-[#0F1419] shadow-xs'
                  : 'text-slate-500 hover:text-[#0F1419]'
              }`}
            >
              State Risk Matrix
            </button>
            <button
              onClick={() => setViewMode('bar')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'bar'
                  ? 'bg-white text-[#0F1419] shadow-xs'
                  : 'text-slate-500 hover:text-[#0F1419]'
              }`}
            >
              Flagged Volume Chart
            </button>
          </div>
        </div>

        {/* View Mode 1: State Density Grid */}
        {viewMode === 'density' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
            {sortedStates.map((st) => {
              const isHigh = st.riskIndex >= 8.0;
              const isMed = st.riskIndex >= 5.0 && st.riskIndex < 8.0;
              const cardBg = isHigh
                ? 'border-rose-200 bg-rose-50/20 hover:bg-rose-50/40'
                : isMed
                ? 'border-amber-200 bg-amber-50/20 hover:bg-amber-50/40'
                : 'border-[#EFF3F4] bg-[#F7F9F9] hover:bg-slate-100/70';

              return (
                <div
                  key={st.code}
                  onClick={() => setSelectedStateFilter(st.state)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${cardBg} group`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-[#0F1419] group-hover:text-[#1D9BF0] transition-colors truncate">
                      {st.state}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-white border border-[#EFF3F4]">
                      {st.code}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-lg font-black font-mono text-[#0F1419]">
                        {st.flaggedCount}
                      </div>
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        Flagged cases
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-bold font-mono ${
                        isHigh ? 'text-rose-600' : isMed ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        Index {st.riskIndex}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {st.highRisk} High / {st.medRisk} Med
                      </span>
                    </div>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full bg-slate-200/70 rounded-full h-1 mt-2.5 overflow-hidden">
                    <div
                      className={`h-1 rounded-full ${
                        isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (st.flaggedCount / 350) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* View Mode 2: Large Recharts Bar Chart */
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedStates}
                margin={{ top: 10, right: 20, left: 0, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF3F4" />
                <XAxis
                  dataKey="code"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  interval={0}
                  axisLine={{ stroke: '#EFF3F4' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={{ stroke: '#EFF3F4' }}
                />
                <Tooltip
                  formatter={(val, name, item) => [
                    `${val} works (${item.payload.state})`,
                    name === 'highRisk' ? 'High Risk' : name === 'medRisk' ? 'Medium Risk' : 'Low Risk'
                  ]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #EFF3F4',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="highRisk" name="highRisk" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medRisk" name="medRisk" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                <Bar dataKey="lowRisk" name="lowRisk" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* MP PERFORMANCE LEADERBOARD (RANKED BY FUND UTILIZATION) */}
      <MpLeaderboardWidget leaderboardData={leaderboardData} />

      {/* LOWER GRID: RISK DISTRIBUTION PIE + STATES REQUIRING ATTENTION + RECENT HIGH-RISK ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Risk Distribution & States Requiring Attention */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Risk Distribution Card */}
          <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#0F1419]">
                National Risk Severity Breakdown
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {kpis.totalFlaggedCases} total flags
              </span>
            </div>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [`${val} works`, name]}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #EFF3F4',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-[#EFF3F4] text-center">
              <div className="p-2 rounded-xl bg-rose-50/60 border border-rose-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">High Risk</span>
                <span className="text-base font-extrabold text-rose-600 font-mono">{kpis.riskDistribution.high}</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Medium</span>
                <span className="text-base font-extrabold text-amber-600 font-mono">{kpis.riskDistribution.medium}</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Low</span>
                <span className="text-base font-extrabold text-emerald-600 font-mono">{kpis.riskDistribution.low}</span>
              </div>
            </div>
          </div>

          {/* States Requiring Attention Ranked Mini-List */}
          <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-[#0F1419]">
                  States Requiring Urgent Central Review
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                Top Risk Indices
              </span>
            </div>

            <div className="space-y-2.5">
              {topAttentionStates.map((st, idx) => (
                <div
                  key={st.state}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F9F9] border border-[#EFF3F4] hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[#0F1419]">{st.state}</div>
                      <div className="text-[10px] text-slate-500">
                        {st.flaggedCount} flagged ({st.highRisk} High) • ₹{st.sanctionedCr} Cr
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-600 font-mono">
                      Index {st.riskIndex}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {Math.round((st.completed / st.totalWorks) * 100)}% done
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Recent High-Risk Alerts Feed */}
        <div className="lg:col-span-7 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-[#0F1419]">
                Live High-Risk Anomaly Alerts (Nationwide Feed)
              </h3>
            </div>
            <Link
              to="/ministry/flagged"
              className="text-xs font-semibold text-[#1D9BF0] hover:underline flex items-center gap-1"
            >
              <span>View all cases</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* List of Clickable Alert Works */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[480px] pr-1">
            {recentAlerts.map((work) => (
              <div
                key={work.workId}
                onClick={() => onOpenWorkDetail(work)}
                className="p-3.5 rounded-xl border border-[#EFF3F4] bg-[#F7F9F9] hover:bg-white hover:border-[#1D9BF0] hover:shadow-card transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                      {work.workId}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-600 font-medium">
                      {work.state} ({work.district})
                    </span>
                  </div>
                  <RiskBadge level={work.riskLevel} score={work.riskScore} size="sm" />
                </div>

                <p className="text-xs font-semibold text-slate-800 line-clamp-2 mb-2">
                  {work.flagReason}
                </p>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                  <span>MP: {work.mpName}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium">₹{work.sanctionedAmount?.toFixed(1)}L</span>
                    <span className="text-[#1D9BF0] font-semibold flex items-center group-hover:translate-x-0.5 transition-transform">
                      Inspect Work <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
