import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  LineChart as LineChartIcon,
  BarChart3,
  Building,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ComposedChart,
} from 'recharts';
import { mpladsService } from '../api/mpladsService';

/**
 * PAGE 3: Trends & Analytics
 * Route: /ministry/trends
 */
export default function TrendsAnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      const res = await mpladsService.getTrendsAnalytics();
      setData(res);
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

  const { monthlyTrends, categoryAnomalies, topVendors, stateComparison } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-[#0F1419] tracking-tight">
          National Trends & Anomaly Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Macro pattern discovery, temporal anomaly trajectories, sector vulnerability, and contractor concentration forensics.
        </p>
      </div>

      {/* TOP ROW: TIME SERIES & CATEGORY VULNERABILITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Monthly Flagged Cases Trajectory (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-lg">
                <LineChartIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0F1419]">
                  Monthly Flagged Anomalies Over Time (12-Month Trend)
                </h2>
                <span className="text-[11px] text-slate-500">
                  Tracking escalation curves across Cost, Timeline & Duplicate vectors
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
              Peak: March 2024
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyTrends}
                margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF3F4" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={{ stroke: '#EFF3F4' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={{ stroke: '#EFF3F4' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #EFF3F4',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
                <Line
                  type="monotone"
                  dataKey="totalFlagged"
                  name="Total Flagged"
                  stroke="#EF4444"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#EF4444' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="costOverrun"
                  name="Cost Overrun"
                  stroke="#F59E0B"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="delayStall"
                  name="Timeline Stall"
                  stroke="#1D9BF0"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Anomaly Count by Work Category (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0F1419]">
                  Anomaly Volume by Category
                </h2>
                <span className="text-[11px] text-slate-500">
                  Infrastructure sectors ranked by risk exposure
                </span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryAnomalies}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 110, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EFF3F4" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={{ stroke: '#EFF3F4' }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 11, fill: '#0F1419', fontWeight: 500 }}
                  axisLine={{ stroke: '#EFF3F4' }}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val) => [`${val} flagged works`, 'Anomalies']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #EFF3F4',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                  {categoryAnomalies.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#EF4444' : index === 1 ? '#F59E0B' : '#1D9BF0'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: VENDOR CONCENTRATION FORENSICS & STATE EFFICIENCY COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 3: Top Vendors by Number of Works & Suspicious Concentration (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0F1419]">
                  Vendor Concentration & Collusion Forensics
                </h2>
                <span className="text-[11px] text-slate-500">
                  Highlighting single-bidder dominance & repeat anomaly clusters
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 flex-1">
            {topVendors.slice(0, 5).map((v) => (
              <div
                key={v.vendor}
                className={`p-3 rounded-xl border transition-all ${
                  v.isSuspicious
                    ? 'bg-rose-50/30 border-rose-200'
                    : 'bg-[#F7F9F9] border-[#EFF3F4]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-xs font-bold text-[#0F1419]">
                      {v.vendor}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Active In: {v.stateConcentration}
                    </span>
                  </div>

                  {v.isSuspicious ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      Suspicious Concentration ({v.riskRatio})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Standard ({v.riskRatio})
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200/60 font-mono">
                  <span>{v.worksAwarded} Works Awarded (₹{v.totalAmountCr} Cr)</span>
                  <span className={v.isSuspicious ? 'text-rose-600 font-bold' : 'text-slate-700 font-medium'}>
                    {v.flaggedCount} Flagged Anomalies
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: State Efficiency Comparison: Sanction vs Completion Rate (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0F1419]">
                  State Efficiency: Completion Rate vs Flagged Risk %
                </h2>
                <span className="text-[11px] text-slate-500">
                  Cross-state comparative analysis for top 10 populated states
                </span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stateComparison}
                margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF3F4" />
                <XAxis
                  dataKey="state"
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  axisLine={{ stroke: '#EFF3F4' }}
                />
                <YAxis
                  unit="%"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={{ stroke: '#EFF3F4' }}
                />
                <Tooltip
                  formatter={(val, name) => [
                    `${val}%`,
                    name === 'completionRate' ? 'Completion Rate' : 'Flagged Anomaly Rate'
                  ]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #EFF3F4',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
                <Bar dataKey="completionRate" name="Completion Rate (%)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="flaggedPercent" name="Flagged Anomaly Rate (%)" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
