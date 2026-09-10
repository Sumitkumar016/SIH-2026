import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Landmark,
  FileSpreadsheet,
  CheckCircle2,
  IndianRupee,
  AlertTriangle,
  ArrowUpDown,
  BarChart3,
  MapPin,
  Layers,
  ChevronRight,
  Info,
  ExternalLink,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import RiskBadge from '../../components/common/RiskBadge';
import DistrictSummaryModal from '../../components/common/DistrictSummaryModal';
import {
  CardSkeleton,
  TableSkeleton,
  ChartSkeleton,
  ErrorState,
} from '../../components/common/loading';
import { stateApi } from '../../api/stateApi';

/**
 * PAGE 1: State Overview (State Nodal Authority View)
 * Route: /state/overview
 * Purpose: State-level rollup of all districts in Bihar with comparative risk ranking
 * and drill-down DistrictSummaryModal popup.
 */
export default function StateOverviewPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Drill-down District Summary Modal State
  const [activeDistrictSummary, setActiveDistrictSummary] = useState(null);
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState('flaggedCount');
  const [sortDirection, setSortDirection] = useState('desc');

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await stateApi.getStateOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to load state overview:', err);
      setError(err?.message || 'Failed to retrieve state rollup telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const sortedDistricts = useMemo(() => {
    if (!data?.districts) return [];
    return [...data.districts].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const handleOpenDistrictDrilldown = async (districtName) => {
    const summary = await stateApi.getDistrictSummary(districtName);
    setActiveDistrictSummary(summary);
    setIsDistrictModalOpen(true);
  };

  const handleSelectProjectFromDrilldown = (project) => {
    setIsDistrictModalOpen(false);
    if (onOpenWorkDetail) {
      onOpenWorkDetail(project);
    }
  };

  const state = data?.state || {
    stateName: 'Bihar',
    nodalDepartment: 'Department of Planning & Development',
    headquarters: 'Patna',
    totalDistricts: 38,
  };
  const kpis = data?.kpis;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* STATE HEADER PROFILE CARD */}
      <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#EFF3F4] flex items-center justify-center text-[#1D9BF0] shadow-xs shrink-0">
            <Landmark className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F1419] tracking-tight">
                {state.stateName} State Nodal Authority
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-sky-50 text-[#1D9BF0] border border-sky-200">
                State Rollup • 38 Districts
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[#0F1419] font-bold">{state.headquarters}</span>
              </span>
              <span>•</span>
              <span className="text-slate-700">{state.nodalDepartment}</span>
            </div>
          </div>
        </div>

        <div className="text-xs font-mono bg-white border border-[#EFF3F4] px-3.5 py-2 rounded-xl shadow-xs self-start md:self-auto">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">State Risk Index</span>
          <span className="text-base font-extrabold text-rose-600">9.6 / 10 (High Oversight)</span>
        </div>
      </div>

      {error && !data ? (
        <ErrorState
          title="State Rollup Telemetry Offline"
          message={error}
          onRetry={loadOverview}
        />
      ) : !data ? (
        <>
          <CardSkeleton count={4} />
          <ChartSkeleton title="High-Risk Works Across Monitored Districts" type="bar" height="h-64" />
          <TableSkeleton columns={6} rows={8} />
        </>
      ) : (
        <>
          {/* SUMMARY KPI CARDS (SCOPED TO THIS STATE) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Works */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">State Works Total</span>
            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 border border-[#EFF3F4]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            {kpis.totalWorks.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Across {kpis.totalDistrictsCovered} monitored districts
          </div>
        </div>

        {/* Card 2: Total Sanctioned */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sanctioned Allocation</span>
            <div className="p-1.5 bg-sky-50 rounded-lg text-[#1D9BF0] border border-sky-100">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            ₹{kpis.totalSanctionedCr.toLocaleString()} <span className="text-sm font-normal text-slate-500">Cr</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            State cumulative sanction
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
            {kpis.totalCompleted.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium font-mono">
            {kpis.completionRate}% state completion rate
          </div>
        </div>

        {/* Card 4: Total Flagged Cases */}
        <div className="bg-white border border-rose-200/80 rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all bg-rose-50/20">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">State Flagged Cases</span>
            <div className="p-1.5 bg-rose-100 rounded-lg text-rose-600 border border-rose-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            {kpis.totalFlaggedCount}
          </div>
          <div className="mt-2 text-[11px] text-rose-700 font-medium">
            Avg District Risk: <strong className="font-mono">{kpis.avgRiskScore}/100</strong>
          </div>
        </div>

      </div>

      {/* SIMPLE BAR CHART: DISTRICTS RANKED BY FLAGGED ANOMALIES (CLICKABLE BARS) */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F1419]">
                Districts Ranked by Flagged Anomaly Density (Highest Risk First)
              </h2>
              <span className="text-[11px] text-slate-500">
                Click on any bar or table row to open the District Drill-down popup
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Top 10 Districts
          </span>
        </div>

        <div className="h-64 w-full cursor-pointer">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.districts}
              margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
              onClick={(state) => {
                if (state && state.activePayload && state.activePayload.length > 0) {
                  const districtName = state.activePayload[0].payload.district;
                  handleOpenDistrictDrilldown(districtName);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF3F4" />
              <XAxis
                dataKey="district"
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
                  `${val} flagged cases (Click to inspect ${item.payload.district})`,
                  'Flagged Anomalies'
                ]}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #EFF3F4',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="flaggedCount" name="Flagged Cases" radius={[4, 4, 0, 0]} barSize={28}>
                {data.districts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.avgRiskScore >= 60 ? '#EF4444' : entry.avgRiskScore >= 50 ? '#F59E0B' : '#1D9BF0'}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DISTRICT-WISE COMPARISON TABLE (CLICK ROW OPENS DRILL-DOWN POPUP) */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden">
        <div className="p-4 bg-[#F7F9F9] border-b border-[#EFF3F4] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F1419]">
              District-Wise Comparative Register ({state.stateName})
            </h3>
            <p className="text-[11px] text-slate-500">
              Click any district row to view the district summary drill-down popup
            </p>
          </div>
          <span className="text-xs text-[#1D9BF0] font-semibold">
            {data.districts.length} Districts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F9F9]/50 border-b border-[#EFF3F4] text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th
                  onClick={() => handleSort('district')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>District Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('totalWorks')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Total Works</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('sanctionedCr')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Sanctioned (₹ Cr)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('completionRate')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Completion Rate</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('flaggedCount')}
                  className="py-3 px-4 text-center cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Flagged Count</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('avgRiskScore')}
                  className="py-3 px-4 text-center cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Avg Risk Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EFF3F4] text-xs">
              {sortedDistricts.map((d) => (
                <tr
                  key={d.district}
                  onClick={() => handleOpenDistrictDrilldown(d.district)}
                  className="hover:bg-[#F7F9F9] cursor-pointer transition-colors group"
                >
                  {/* District Name */}
                  <td className="py-3.5 px-4 font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                    <div className="flex items-center gap-1.5">
                      <span>{d.district}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1D9BF0]" />
                    </div>
                  </td>

                  {/* Total Works */}
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                    {d.totalWorks}
                  </td>

                  {/* Sanctioned Cr */}
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#0F1419]">
                    ₹{d.sanctionedCr.toFixed(1)} Cr
                  </td>

                  {/* Completion Rate */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 font-mono">
                      <span className="text-emerald-700 font-semibold">{d.completionRate}%</span>
                      <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${d.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Flagged Count */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-rose-50 text-rose-700 border border-rose-200">
                      {d.flaggedCount}
                    </span>
                  </td>

                  {/* Avg Risk Score */}
                  <td className="py-3.5 px-4 text-center">
                    <RiskBadge
                      level={d.avgRiskScore >= 60 ? 'High' : d.avgRiskScore >= 45 ? 'Medium' : 'Low'}
                      score={d.avgRiskScore}
                      size="sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F7F9F9] border-t border-[#EFF3F4] flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#1D9BF0]" />
            <span>
              Click any district row or bar to inspect its top 3 highest-risk projects.
            </span>
          </div>
          <span className="font-mono text-[11px]">
            {data.districts.length} Districts Monitored
          </span>
        </div>
      </div>
        </>
      )}

      {/* DISTRICT DRILL-DOWN POPUP MODAL */}
      <DistrictSummaryModal
        districtSummary={activeDistrictSummary}
        isOpen={isDistrictModalOpen}
        onClose={() => setIsDistrictModalOpen(false)}
        onSelectProject={handleSelectProjectFromDrilldown}
      />

    </div>
  );
}
