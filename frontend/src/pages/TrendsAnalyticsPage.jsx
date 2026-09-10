import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  LineChart as LineChartIcon,
  BarChart3,
  Building,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Calendar,
  Filter,
  RefreshCw,
  Info,
  CheckCircle2,
  ShieldAlert,
  Clock,
  DollarSign,
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
  ReferenceLine,
} from 'recharts';
import { mpladsService } from '../api/mpladsService';

/* ==========================================================================
   STATISTICAL & AGGREGATION HELPER FUNCTIONS
   (Pure functions decoupled from JSX rendering)
   ========================================================================== */

/**
 * Computes top-level KPI metrics from backend datasets.
 */
function computeKpiSummary(monthlyTrends = [], categoryAnomalies = [], topVendors = []) {
  const totalFlaggedWorks = monthlyTrends.reduce(
    (acc, curr) => acc + (Number(curr.totalFlagged) || 0),
    0
  );
  const totalCostOverruns = monthlyTrends.reduce(
    (acc, curr) => acc + (Number(curr.costOverrun) || 0),
    0
  );
  const totalDelaySignals = monthlyTrends.reduce(
    (acc, curr) => acc + (Number(curr.delayStall) || 0),
    0
  );

  const suspiciousVendorCount = topVendors.filter((v) => Boolean(v.isSuspicious)).length;

  const highestCategory =
    categoryAnomalies.length > 0
      ? [...categoryAnomalies].sort((a, b) => (b.count || 0) - (a.count || 0))[0]
      : null;

  return {
    totalFlaggedWorks,
    totalCostOverruns,
    totalDelaySignals,
    suspiciousVendorCount,
    highestCategoryName: highestCategory?.category || 'None',
    highestCategoryCount: highestCategory?.count || 0,
  };
}

/**
 * Computes peak month and Month-over-Month (MoM) direction for Flagged Work Trend.
 */
function computeTrendStats(monthlyTrends = []) {
  if (!monthlyTrends || monthlyTrends.length === 0) {
    return {
      peakMonth: null,
      peakValue: 0,
      momChange: 0,
      momDirection: 'unchanged',
      momPercent: 0,
    };
  }

  let peak = monthlyTrends[0];
  for (const item of monthlyTrends) {
    if ((item.totalFlagged || 0) > (peak.totalFlagged || 0)) {
      peak = item;
    }
  }

  let momChange = 0;
  let momDirection = 'unchanged';
  let momPercent = 0;

  if (monthlyTrends.length >= 2) {
    const latest = monthlyTrends[monthlyTrends.length - 1].totalFlagged || 0;
    const previous = monthlyTrends[monthlyTrends.length - 2].totalFlagged || 0;
    momChange = latest - previous;

    if (momChange > 0) {
      momDirection = 'increasing';
    } else if (momChange < 0) {
      momDirection = 'decreasing';
    } else {
      momDirection = 'unchanged';
    }

    if (previous > 0) {
      momPercent = Number(((momChange / previous) * 100).toFixed(1));
    } else if (latest > 0) {
      momPercent = 100;
    }
  }

  return {
    peakMonth: peak?.month || null,
    peakValue: peak?.totalFlagged || 0,
    momChange,
    momDirection,
    momPercent,
  };
}

/**
 * Computes Historical Baseline (arithmetic mean of totalFlagged) and monthly deviations.
 */
function computeBaselineData(monthlyTrends = []) {
  if (!monthlyTrends || monthlyTrends.length === 0) {
    return {
      baselineValue: 0,
      chartData: [],
      aboveBaselineCount: 0,
    };
  }

  const total = monthlyTrends.reduce(
    (sum, item) => sum + (Number(item.totalFlagged) || 0),
    0
  );
  const baselineValue = Math.round(total / monthlyTrends.length);

  let aboveBaselineCount = 0;

  const chartData = monthlyTrends.map((item) => {
    const actual = Number(item.totalFlagged) || 0;
    const deviation = actual - baselineValue;
    const deviationPct =
      baselineValue > 0
        ? Number(((deviation / baselineValue) * 100).toFixed(1))
        : 0;
    const isAboveBaseline = actual > baselineValue;

    if (isAboveBaseline) aboveBaselineCount += 1;

    return {
      month: item.month,
      actual,
      baseline: baselineValue,
      deviation,
      deviationPct,
      isAboveBaseline,
    };
  });

  return {
    baselineValue,
    chartData,
    aboveBaselineCount,
  };
}

/**
 * Computes category distribution with relative percentage shares.
 */
function computeCategoryData(categoryAnomalies = []) {
  if (!categoryAnomalies || categoryAnomalies.length === 0) return [];

  const totalCategoryFlags = categoryAnomalies.reduce(
    (sum, item) => sum + (Number(item.count) || 0),
    0
  );

  return [...categoryAnomalies]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .map((item) => {
      const count = Number(item.count) || 0;
      const pct =
        totalCategoryFlags > 0
          ? Number(((count / totalCategoryFlags) * 100).toFixed(1))
          : 0;
      return {
        category: item.category,
        count,
        pct,
      };
    });
}

/**
 * Sorts and filters state comparison records.
 */
function computeStateData(stateComparison = [], sortMode = 'highestRisk', stateFilter = 'ALL') {
  let list = [...stateComparison];

  if (stateFilter && stateFilter !== 'ALL') {
    list = list.filter((s) => s.state === stateFilter);
  }

  if (sortMode === 'highestRisk') {
    list.sort((a, b) => (b.flaggedPercent || 0) - (a.flaggedPercent || 0));
  } else if (sortMode === 'bestCompletion') {
    list.sort((a, b) => (b.completionRate || 0) - (a.completionRate || 0));
  }

  return list;
}

/**
 * Generates verified dynamic insights strictly from available data.
 */
function generateRiskInsights({
  trendStats,
  baselineData,
  categoryData,
  stateComparison,
  topVendors,
  timePeriodMonths,
}) {
  const insights = [];

  // 1. Month-over-Month Trend Insight
  if (trendStats.momDirection === 'increasing') {
    insights.push({
      type: 'warning',
      title: 'Flagged Activity Increased',
      text: `Flagged activity increased by ${trendStats.momChange} works (${trendStats.momPercent > 0 ? `+${trendStats.momPercent}%` : ''}) compared to the previous month.`,
    });
  } else if (trendStats.momDirection === 'decreasing') {
    insights.push({
      type: 'positive',
      title: 'Flagged Activity Decreased',
      text: `Flagged activity decreased by ${Math.abs(trendStats.momChange)} works (${trendStats.momPercent}% MoM) compared to the previous month.`,
    });
  } else {
    insights.push({
      type: 'neutral',
      title: 'Flagged Activity Steady',
      text: 'Flagged work activity remained unchanged compared to the previous month.',
    });
  }

  // 2. Baseline Deviation Insight
  if (baselineData.aboveBaselineCount > 0) {
    insights.push({
      type: 'info',
      title: 'Activity Above Historical Baseline',
      text: `${baselineData.aboveBaselineCount} of ${timePeriodMonths} tracked months had flagged works exceeding the period baseline (${baselineData.baselineValue} works/month).`,
    });
  }

  // 3. Category Concentration Insight
  if (categoryData.length > 0) {
    const topCat = categoryData[0];
    insights.push({
      type: 'warning',
      title: 'Sector Risk Concentration',
      text: `${topCat.category} represents the highest volume of flagged projects with ${topCat.count} works (${topCat.pct}% of all flagged category records).`,
    });
  }

  // 4. State Risk Insight
  if (stateComparison.length > 0) {
    const highestRiskState = [...stateComparison].sort(
      (a, b) => (b.flaggedPercent || 0) - (a.flaggedPercent || 0)
    )[0];
    if (highestRiskState) {
      insights.push({
        type: 'warning',
        title: 'State With Highest Flagged Ratio',
        text: `${highestRiskState.state} has the highest share of flagged works at ${highestRiskState.flaggedPercent}% (Completion: ${highestRiskState.completionRate}%).`,
      });
    }
  }

  // 5. Vendor Concentration Insight
  const suspiciousVendors = topVendors.filter((v) => Boolean(v.isSuspicious));
  if (suspiciousVendors.length > 0) {
    insights.push({
      type: 'alert',
      title: 'Vendor Concentration Signals',
      text: `${suspiciousVendors.length} of ${topVendors.length} tracked top vendors meet concentration-risk criteria (>40% flagged ratio or single-state lock with ≥5 works).`,
    });
  } else {
    insights.push({
      type: 'positive',
      title: 'No Vendor Concentration Flags',
      text: 'None of the top vendors currently exceed the concentration-risk threshold.',
    });
  }

  return insights;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function TrendsAnalyticsPage() {
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Client-side Filter States
  const [timePeriod, setTimePeriod] = useState('12'); // '6' or '12'
  const [selectedState, setSelectedState] = useState('ALL');
  const [stateSortMode, setStateSortMode] = useState('highestRisk'); // 'highestRisk' | 'bestCompletion'

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await mpladsService.getTrendsAnalytics();
      if (!res || !Array.isArray(res.monthlyTrends)) {
        throw new Error('Invalid or empty response received from analytics service.');
      }
      setRawData(res);
    } catch (err) {
      setError(err?.message || 'Unable to load trend analytics. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derive filtered Monthly Trends based on selected Time Period (6 vs 12 months)
  const filteredMonthlyTrends = useMemo(() => {
    if (!rawData?.monthlyTrends) return [];
    if (timePeriod === '6') {
      return rawData.monthlyTrends.slice(-6);
    }
    return rawData.monthlyTrends.slice(-12);
  }, [rawData, timePeriod]);

  // Computations
  const kpiData = useMemo(() => {
    if (!rawData) return null;
    // KPI totals calculated from the full 12 months dataset as specified
    return computeKpiSummary(
      rawData.monthlyTrends,
      rawData.categoryAnomalies,
      rawData.topVendors
    );
  }, [rawData]);

  const trendStats = useMemo(() => {
    return computeTrendStats(filteredMonthlyTrends);
  }, [filteredMonthlyTrends]);

  const baselineData = useMemo(() => {
    return computeBaselineData(filteredMonthlyTrends);
  }, [filteredMonthlyTrends]);

  const categoryData = useMemo(() => {
    return computeCategoryData(rawData?.categoryAnomalies || []);
  }, [rawData]);

  const stateData = useMemo(() => {
    return computeStateData(
      rawData?.stateComparison || [],
      stateSortMode,
      selectedState
    );
  }, [rawData, stateSortMode, selectedState]);

  const riskInsights = useMemo(() => {
    if (!rawData) return [];
    return generateRiskInsights({
      trendStats,
      baselineData,
      categoryData,
      stateComparison: rawData.stateComparison || [],
      topVendors: rawData.topVendors || [],
      timePeriodMonths: filteredMonthlyTrends.length,
    });
  }, [rawData, trendStats, baselineData, categoryData, filteredMonthlyTrends.length]);

  // Unique list of states for the filter dropdown
  const availableStates = useMemo(() => {
    if (!rawData?.stateComparison) return [];
    return Array.from(new Set(rawData.stateComparison.map((s) => s.state))).sort();
  }, [rawData]);

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1D9BF0]" />
        <p className="text-sm font-medium text-slate-500">Loading National Trends & Risk Analytics...</p>
      </div>
    );
  }

  // Error State
  if (error || !rawData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-6 text-center shadow-subtle space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F1419]">Unable to Load Trend Analytics</h3>
            <p className="text-xs text-slate-500 mt-1">
              {error || 'The system could not retrieve trends analytics from the server.'}
            </p>
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#1D9BF0] text-white hover:bg-sky-600 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Request
          </button>
        </div>
      </div>
    );
  }

  const { topVendors = [] } = rawData;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* ====================================================================
          1. HEADER & CONTROLS
          ==================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EFF3F4] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F1419] tracking-tight">
            National Trends & Risk Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor flagged-work trends, identify risk patterns, compare state performance, and investigate concentration signals.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Period Filter */}
          <div className="flex items-center bg-white border border-[#EFF3F4] rounded-lg p-0.5 shadow-sm text-xs">
            <button
              onClick={() => setTimePeriod('6')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                timePeriod === '6'
                  ? 'bg-[#1D9BF0] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 6 Months
            </button>
            <button
              onClick={() => setTimePeriod('12')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                timePeriod === '12'
                  ? 'bg-[#1D9BF0] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 12 Months
            </button>
          </div>

          {/* State Filter (Applies to State Section) */}
          <div className="flex items-center gap-1.5 bg-white border border-[#EFF3F4] rounded-lg px-2.5 py-1 text-xs shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-500 font-medium">State View:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#0F1419] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All States (10)</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Action */}
          <button
            onClick={fetchData}
            title="Refresh analytics data"
            className="p-1.5 bg-white border border-[#EFF3F4] text-slate-500 hover:text-[#0F1419] rounded-lg shadow-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Scope Notice */}
      {selectedState !== 'ALL' && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 text-xs border border-sky-100">
          <Info className="w-3.5 h-3.5 text-[#1D9BF0] flex-shrink-0" />
          <span>
            Filtering state views to <strong>{selectedState}</strong>. National trend series remain nationwide.
          </span>
        </div>
      )}

      {/* ====================================================================
          2. KPI SUMMARY (5 Compact Cards based on actual backend data)
          ==================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Flagged Works */}
        <div className="bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Flagged Works
            </span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-md">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#0F1419]">
              {kpiData?.totalFlaggedWorks.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">12-Month Medium & High Risk</p>
        </div>

        {/* Card 2: Cost Overrun Signals */}
        <div className="bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Cost Overrun Signals
            </span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-600">
              {kpiData?.totalCostOverruns.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Flagged works with overrun &gt; 0%</p>
        </div>

        {/* Card 3: Delayed Work Signals */}
        <div className="bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Timeline Stall Signals
            </span>
            <div className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-md">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#1D9BF0]">
              {kpiData?.totalDelaySignals.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Flagged works in Delayed status</p>
        </div>

        {/* Card 4: Suspicious Vendors */}
        <div className="bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Concentration Risk
            </span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-md">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-600">
              {kpiData?.suspiciousVendorCount}
            </span>
            <span className="text-[11px] text-slate-400">/ {topVendors.length} top vendors</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">&gt;40% risk ratio or single state</p>
        </div>

        {/* Card 5: Highest Flagged Category */}
        <div className="bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Top Risk Category
            </span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-base font-bold text-[#0F1419] truncate block" title={kpiData?.highestCategoryName}>
              {kpiData?.highestCategoryName}
            </span>
            <span className="text-xs font-mono font-semibold text-slate-500">
              {kpiData?.highestCategoryCount} flagged projects
            </span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          SECTION 1: TREND ANALYSIS
          - Chart 1: Flagged Work Trend (Dynamic peak & MoM status)
          - Chart 2: Risk Distribution by Category (sorted horizontal bars)
          ==================================================================== */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0F1419] tracking-tight uppercase">
              Trend Analysis
            </h2>
            <p className="text-[11px] text-slate-500">
              Temporal progression of risk vectors and structural breakdown by public work sector
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Flagged Work Trend */}
          <div className="lg:col-span-7 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#EFF3F4]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-lg">
                  <LineChartIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F1419]">
                    Flagged Work Trend
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Monthly Medium- and High-Risk Activity ({timePeriod === '6' ? '6 Months' : '12 Months'})
                  </p>
                </div>
              </div>

              {/* Dynamic Badges: Peak & MoM change */}
              <div className="flex items-center gap-2 flex-wrap">
                {trendStats.peakMonth && (
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    Peak: <strong>{trendStats.peakMonth}</strong> ({trendStats.peakValue})
                  </span>
                )}
                {trendStats.momDirection === 'increasing' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    <ArrowUpRight className="w-3 h-3 text-rose-600" />
                    Increased MoM (+{trendStats.momChange})
                  </span>
                )}
                {trendStats.momDirection === 'decreasing' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ArrowDownRight className="w-3 h-3 text-emerald-600" />
                    Decreased MoM ({trendStats.momChange})
                  </span>
                )}
                {trendStats.momDirection === 'unchanged' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    <Minus className="w-3 h-3" />
                    Unchanged MoM
                  </span>
                )}
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredMonthlyTrends}
                  margin={{ top: 10, right: 15, left: -10, bottom: 5 }}
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
                    allowDecimals={false}
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
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="delayStall"
                    name="Timeline Stall"
                    stroke="#1D9BF0"
                    strokeWidth={1.5}
                    strokeDasharray="2 2"
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Risk Distribution by Category */}
          <div className="lg:col-span-5 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F1419]">
                    Risk Distribution by Category
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Categories with the highest number of Medium- and High-Risk works
                  </p>
                </div>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 110, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EFF3F4" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={{ stroke: '#EFF3F4' }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    tick={{ fontSize: 11, fill: '#0F1419', fontWeight: 500 }}
                    axisLine={{ stroke: '#EFF3F4' }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(val, name, entry) => [
                      `${val} flagged (${entry.payload.pct}% of category flags)`,
                      'Flagged Works',
                    ]}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #EFF3F4',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cat-cell-${index}`}
                        fill={index === 0 ? '#EF4444' : index === 1 ? '#F59E0B' : '#1D9BF0'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          SECTION 2: BASELINE & ANOMALY ANALYSIS
          - Historical Baseline vs Actual Flagged Activity
          - Clearly documented mathematical mean (no fake ML claims)
          ==================================================================== */}
      <div>
        <div className="mb-3">
          <h2 className="text-sm font-bold text-[#0F1419] tracking-tight uppercase">
            Baseline & Anomaly Analysis
          </h2>
          <p className="text-[11px] text-slate-500">
            Evaluating temporal fluctuations against the mathematical period baseline
          </p>
        </div>

        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#EFF3F4]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F1419]">
                  Historical Baseline vs Actual Activity
                </h3>
                <p className="text-[11px] text-slate-500">
                  Compare monthly flagged activity with the {timePeriod}-month historical average ({baselineData.baselineValue} works/month)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200">
                Threshold: <strong>&gt; {baselineData.baselineValue} (Above Baseline)</strong>
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={baselineData.chartData}
                margin={{ top: 15, right: 25, left: -10, bottom: 5 }}
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
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border border-[#EFF3F4] rounded-lg p-3 shadow-lg text-xs space-y-1">
                          <p className="font-bold text-[#0F1419] border-b border-slate-100 pb-1 mb-1">
                            {label}
                          </p>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Actual Flagged:</span>
                            <span className="font-mono font-bold text-rose-600">{d.actual}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Historical Baseline:</span>
                            <span className="font-mono font-medium text-slate-700">{d.baseline}</span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 border-t border-slate-100">
                            <span className="text-slate-500">Deviation:</span>
                            <span
                              className={`font-mono font-bold ${
                                d.deviation > 0 ? 'text-rose-600' : 'text-emerald-600'
                              }`}
                            >
                              {d.deviation > 0 ? `+${d.deviation}` : d.deviation} ({d.deviationPct > 0 ? `+${d.deviationPct}%` : `${d.deviationPct}%`})
                            </span>
                          </div>
                          {d.isAboveBaseline && (
                            <p className="text-[10px] text-rose-600 font-semibold pt-1">
                              ⚠ Substantially above historical norm
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
                <ReferenceLine
                  y={baselineData.baselineValue}
                  stroke="#64748B"
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                  label={{
                    value: `Baseline: ${baselineData.baselineValue}`,
                    fill: '#64748B',
                    fontSize: 10,
                    position: 'top',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual Flagged Works"
                  stroke="#0F1419"
                  strokeWidth={2.5}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    const isAbove = payload.isAboveBaseline;
                    return (
                      <circle
                        key={`dot-${payload.month}`}
                        cx={cx}
                        cy={cy}
                        r={isAbove ? 5 : 3.5}
                        fill={isAbove ? '#EF4444' : '#0F1419'}
                        stroke="#FFFFFF"
                        strokeWidth={1.5}
                      />
                    );
                  }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  name="Historical Baseline (Average)"
                  stroke="#64748B"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ====================================================================
          SECTION 3: STATE PERFORMANCE & DYNAMIC RISK INSIGHTS
          - Left: State Performance vs Risk (Grouped Bar Chart with sort)
          - Right: Risk Insights Card (calculated dynamically from real data)
          ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* State Performance Chart */}
        <div className="lg:col-span-7 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#EFF3F4]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F1419]">
                  State Performance vs Risk
                </h3>
                <p className="text-[11px] text-slate-500">
                  Compare completion rate with the share of flagged works
                </p>
              </div>
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[11px]">
              <button
                onClick={() => setStateSortMode('highestRisk')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  stateSortMode === 'highestRisk'
                    ? 'bg-white text-rose-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Highest Risk
              </button>
              <button
                onClick={() => setStateSortMode('bestCompletion')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  stateSortMode === 'bestCompletion'
                    ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Best Completion
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stateData}
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
                    name === 'completionRate' ? 'Completion Rate' : 'Flagged Work Rate',
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
                <Bar
                  dataKey="completionRate"
                  name="Completion Rate (%)"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  barSize={14}
                />
                <Bar
                  dataKey="flaggedPercent"
                  name="Flagged Work Rate (%)"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Risk Insights */}
        <div className="lg:col-span-5 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F1419]">
                  Risk Insights
                </h3>
                <p className="text-[11px] text-slate-500">
                  Dynamic operational signals derived strictly from current records
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Live Signals
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {riskInsights.map((insight, idx) => (
              <div
                key={`insight-${idx}`}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  insight.type === 'alert'
                    ? 'bg-rose-50/40 border-rose-200 text-rose-950'
                    : insight.type === 'warning'
                    ? 'bg-amber-50/40 border-amber-200 text-amber-950'
                    : insight.type === 'positive'
                    ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    {insight.type === 'alert' && (
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    {insight.type === 'warning' && (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {insight.type === 'positive' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    {insight.type === 'info' && (
                      <Info className="w-3.5 h-3.5 text-[#1D9BF0]" />
                    )}
                    {insight.type === 'neutral' && (
                      <Minus className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold block text-[11px]">
                      {insight.title}
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      {insight.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ====================================================================
          SECTION 4: VENDOR CONCENTRATION & RISK
          - High Concentration Risk indicator (no false claims of collusion)
          - Transparent criteria: flaggedCount / worksAwarded > 0.4 OR single state with >= 5 works
          ==================================================================== */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#EFF3F4]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F1419]">
                Vendor Concentration & Risk
              </h3>
              <p className="text-[11px] text-slate-500">
                Vendors with high flagged-work concentration or concentrated activity
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            Criteria: Flagged ratio &gt; 40% OR 1 state with ≥ 5 works. (Requires review; does not imply proven collusion)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topVendors.map((v) => (
            <div
              key={v.vendor}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                v.isSuspicious
                  ? 'bg-rose-50/20 border-rose-200 shadow-xs'
                  : 'bg-[#F7F9F9] border-[#EFF3F4]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-[#0F1419] line-clamp-1" title={v.vendor}>
                      {v.vendor}
                    </h4>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Active: {v.stateConcentration}
                    </span>
                  </div>

                  {v.isSuspicious ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      High Concentration Risk
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      Standard Profile
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Awarded Works</span>
                    <span className="font-mono font-bold text-slate-800">{v.worksAwarded}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Total Amount</span>
                    <span className="font-mono font-bold text-slate-800">₹{v.totalAmountCr} Cr</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Flagged Works</span>
                    <span
                      className={`font-mono font-bold ${
                        v.isSuspicious ? 'text-rose-600' : 'text-slate-700'
                      }`}
                    >
                      {v.flaggedCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Risk Ratio</span>
                    <span className="font-mono font-semibold text-slate-600">{v.riskRatio}</span>
                  </div>
                </div>
              </div>

              {v.isSuspicious && (
                <div className="mt-3 pt-2 border-t border-rose-100 text-[11px] text-rose-700 flex items-center gap-1 font-medium">
                  <Info className="w-3 h-3 text-rose-500 shrink-0" />
                  Concentration risk indicator — requires review
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
