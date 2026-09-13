import React, { useState, useMemo, useCallback } from 'react';
import {
  TrendingUp,
  LineChart as LineChartIcon,
  BarChart3,
  Building,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Filter,
  RefreshCw,
  Info,
  CheckCircle2,
  ShieldAlert,
  Clock,
  DollarSign,
  MapPin,
  XCircle,
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
import {
  CardSkeleton,
  ChartSkeleton,
  ErrorState,
  EmptyState,
  Skeleton,
} from '../components/common/loading';
import { useApiQuery } from '../hooks/useApiQuery';

/* ==========================================================================
   STATISTICAL & AGGREGATION HELPER FUNCTIONS
   ========================================================================== */

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
 * Sorts state comparison records.
 */
function computeStateData(stateComparison = [], sortMode = 'highestRisk') {
  const list = [...stateComparison];

  if (sortMode === 'highestRisk') {
    list.sort((a, b) => (b.flaggedPercent || 0) - (a.flaggedPercent || 0));
  } else if (sortMode === 'bestCompletion') {
    list.sort((a, b) => (b.completionRate || 0) - (a.completionRate || 0));
  }

  return list;
}

/**
 * Helper: Truncates axis category label with ellipsis if length > maxLen.
 */
function truncateCategoryLabel(label, maxLen = 20) {
  if (!label) return '';
  return label.length > maxLen ? `${label.slice(0, maxLen)}…` : label;
}

/* ==========================================================================
   RISK INSIGHT ROW COMPONENT (DECOUPLED & INDEPENDENTLY GATED)
   ========================================================================== */

function InsightCard({ type = 'neutral', title, text, loading, error, icon: CustomIcon }) {
  if (loading) {
    return (
      <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-slate-200 rounded" />
          <div className="h-3 w-36 bg-slate-200 rounded" />
        </div>
        <div className="h-2.5 w-4/5 bg-slate-200 rounded ml-5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 text-slate-400">
            <Minus className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold block text-[11px] text-slate-700">{title}</span>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              {text || 'Insight unavailable due to telemetry error.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-3 rounded-xl border text-xs transition-all ${
        type === 'alert'
          ? 'bg-rose-50/40 border-rose-200 text-rose-950'
          : type === 'warning'
          ? 'bg-amber-50/40 border-amber-200 text-amber-950'
          : type === 'positive'
          ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
          : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex-shrink-0">
          {CustomIcon ? (
            <CustomIcon className="w-3.5 h-3.5" />
          ) : type === 'alert' ? (
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          ) : type === 'warning' ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          ) : type === 'positive' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : type === 'info' ? (
            <Info className="w-3.5 h-3.5 text-[#1D9BF0]" />
          ) : (
            <Minus className="w-3.5 h-3.5 text-slate-500" />
          )}
        </div>
        <div>
          <span className="font-bold block text-[11px]">{title}</span>
          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function TrendsAnalyticsPage() {
  // Scoped Filter States (Local to this page only)
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [timePeriod, setTimePeriod] = useState('12'); // '3' | '6' | '12'
  const [stateSortMode, setStateSortMode] = useState('highestRisk'); // 'highestRisk' | 'bestCompletion'

  // 1. Locations Query (Hierarchy of States & Districts for Header Dropdowns)
  const locationsQuery = useApiQuery(
    () => mpladsService.getTrendsLocations(),
    []
  );

  // 2. Section 1 Query: Monthly Trends (drives Flagged Work Trend + Historical Baseline)
  const monthlyQuery = useApiQuery(
    () => mpladsService.getTrendsMonthly({ state: selectedState, district: selectedDistrict }),
    [selectedState, selectedDistrict]
  );

  // 3. Section 2 Query: Category Anomalies
  const categoriesQuery = useApiQuery(
    () => mpladsService.getTrendsCategories({ state: selectedState, district: selectedDistrict }),
    [selectedState, selectedDistrict]
  );

  // 4. Section 3 Query: Vendor Concentration & Risk
  const vendorsQuery = useApiQuery(
    () => mpladsService.getTrendsVendors({ state: selectedState, district: selectedDistrict }),
    [selectedState, selectedDistrict]
  );

  // 5. Section 4 Query: State Performance vs Risk
  const statesQuery = useApiQuery(
    () => mpladsService.getTrendsStates({ state: selectedState, district: selectedDistrict }),
    [selectedState, selectedDistrict]
  );

  // Derive dynamic State & District dropdown lists
  const availableStates = useMemo(() => {
    return locationsQuery.data || [];
  }, [locationsQuery.data]);

  const selectedStateObj = useMemo(() => {
    if (selectedState === 'ALL') return null;
    return availableStates.find((s) => s.state_name === selectedState) || null;
  }, [availableStates, selectedState]);

  const availableDistricts = useMemo(() => {
    return selectedStateObj?.districts || [];
  }, [selectedStateObj]);

  // Handle State Selection Change (Resets District to ALL)
  const handleStateChange = useCallback((newState) => {
    setSelectedState(newState);
    setSelectedDistrict('ALL');
  }, []);

  // Handle Clear District Filter
  const handleClearDistrict = useCallback(() => {
    setSelectedDistrict('ALL');
  }, []);

  // Derive Trailing Monthly Trends based on selected Time Period (3, 6, 12 months)
  const filteredMonthlyTrends = useMemo(() => {
    if (!monthlyQuery.data || !Array.isArray(monthlyQuery.data)) return [];
    const full = monthlyQuery.data;
    if (timePeriod === '3') {
      return full.slice(-3);
    }
    if (timePeriod === '6') {
      return full.slice(-6);
    }
    return full.slice(-12);
  }, [monthlyQuery.data, timePeriod]);

  // Derived Trend Statistics
  const trendStats = useMemo(() => {
    return computeTrendStats(filteredMonthlyTrends);
  }, [filteredMonthlyTrends]);

  // Derived Historical Baseline Data
  const baselineData = useMemo(() => {
    return computeBaselineData(filteredMonthlyTrends);
  }, [filteredMonthlyTrends]);

  // Derived Category Data
  const categoryData = useMemo(() => {
    return computeCategoryData(categoriesQuery.data || []);
  }, [categoriesQuery.data]);

  // Derived State Comparison Data
  const stateData = useMemo(() => {
    return computeStateData(statesQuery.data || [], stateSortMode);
  }, [statesQuery.data, stateSortMode]);

  // Vendor Data
  const topVendors = vendorsQuery.data || [];

  // KPI Calculations (Computed strictly from loaded datasets without defaulting unloaded to 0)
  const monthlyLoaded = Boolean(monthlyQuery.data && Array.isArray(monthlyQuery.data));
  const categoriesLoaded = Boolean(categoriesQuery.data && Array.isArray(categoriesQuery.data));
  const vendorsLoaded = Boolean(vendorsQuery.data && Array.isArray(vendorsQuery.data));

  const totalFlaggedCount = useMemo(() => {
    if (!monthlyLoaded) return null;
    return monthlyQuery.data.reduce((acc, curr) => acc + (Number(curr.totalFlagged) || 0), 0);
  }, [monthlyLoaded, monthlyQuery.data]);

  const totalCostOverruns = useMemo(() => {
    if (!monthlyLoaded) return null;
    return monthlyQuery.data.reduce((acc, curr) => acc + (Number(curr.costOverrun) || 0), 0);
  }, [monthlyLoaded, monthlyQuery.data]);

  const totalDelaySignals = useMemo(() => {
    if (!monthlyLoaded) return null;
    return monthlyQuery.data.reduce((acc, curr) => acc + (Number(curr.delayStall) || 0), 0);
  }, [monthlyLoaded, monthlyQuery.data]);

  const suspiciousVendorStats = useMemo(() => {
    if (!vendorsLoaded) return null;
    const suspicious = topVendors.filter((v) => Boolean(v.isSuspicious)).length;
    return { suspicious, total: topVendors.length };
  }, [vendorsLoaded, topVendors]);

  const topCategoryStats = useMemo(() => {
    if (!categoriesLoaded) return null;
    if (categoriesQuery.data.length === 0) return { name: 'None', count: 0 };
    const sorted = [...categoriesQuery.data].sort((a, b) => (b.count || 0) - (a.count || 0));
    return { name: sorted[0].category, count: sorted[0].count };
  }, [categoriesLoaded, categoriesQuery.data]);

  // Dynamic Height for Category Chart to prevent label overlap
  const dynamicCategoryChartHeight = useMemo(() => {
    return Math.max(280, (categoryData.length || 1) * 46);
  }, [categoryData.length]);

  // Refresh All handler
  const isAnyRefetching =
    monthlyQuery.isRefetching ||
    categoriesQuery.isRefetching ||
    vendorsQuery.isRefetching ||
    statesQuery.isRefetching;

  const handleRefreshAll = useCallback(() => {
    monthlyQuery.refetch();
    categoriesQuery.refetch();
    vendorsQuery.refetch();
    statesQuery.refetch();
  }, [monthlyQuery, categoriesQuery, vendorsQuery, statesQuery]);

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
            Monitor flagged-work trends, identify sector vulnerabilities, investigate contractor concentration, and evaluate state performance.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Time Period Filter (3M, 6M, 12M) */}
          <div className="flex items-center bg-white border border-[#EFF3F4] rounded-lg p-0.5 shadow-sm text-xs">
            <button
              onClick={() => setTimePeriod('3')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                timePeriod === '3'
                  ? 'bg-[#1D9BF0] text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 3 Months
            </button>
            <button
              onClick={() => setTimePeriod('6')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                timePeriod === '6'
                  ? 'bg-[#1D9BF0] text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 6 Months
            </button>
            <button
              onClick={() => setTimePeriod('12')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                timePeriod === '12'
                  ? 'bg-[#1D9BF0] text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 12 Months
            </button>
          </div>

          {/* State Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-[#EFF3F4] rounded-lg px-2.5 py-1 text-xs shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-500 font-medium">State:</span>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#0F1419] focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              <option value="ALL">All States</option>
              {availableStates.map((st) => (
                <option key={st.state_id} value={st.state_name}>
                  {st.state_name}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter Dropdown (Enabled only when a State is selected) */}
          {selectedState !== 'ALL' && (
            <div className="flex items-center gap-1.5 bg-white border border-[#EFF3F4] rounded-lg px-2.5 py-1 text-xs shadow-sm animate-in fade-in duration-200">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] text-slate-500 font-medium">District:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#0F1419] focus:outline-none cursor-pointer max-w-[150px] truncate"
              >
                <option value="ALL">All Districts ({availableDistricts.length})</option>
                {availableDistricts.map((d) => (
                  <option key={d.district_id} value={d.district_name}>
                    {d.district_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Refresh Action */}
          <button
            onClick={handleRefreshAll}
            title="Refresh all analytics data"
            className="p-1.5 bg-white border border-[#EFF3F4] text-slate-500 hover:text-[#0F1419] rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isAnyRefetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Scope Notice */}
      {(selectedState !== 'ALL' || selectedDistrict !== 'ALL') && (
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 text-xs border border-sky-100 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#1D9BF0] flex-shrink-0" />
            <span>
              Scope filtered to <strong>{selectedState}</strong>
              {selectedDistrict !== 'ALL' ? (
                <> &rsaquo; <strong>{selectedDistrict}</strong></>
              ) : null}
              . Real-time trend vectors, category distribution, and contractor analysis scoped to this geographic domain.
            </span>
          </div>
          <button
            onClick={() => handleStateChange('ALL')}
            className="text-xs font-semibold text-[#1D9BF0] hover:underline cursor-pointer flex-shrink-0 ml-2"
          >
            Reset to National View
          </button>
        </div>
      )}

      {/* ====================================================================
          2. KPI SUMMARY (5 Cards with fine-grained Loading / Unavailable / Value states)
          ==================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Flagged Works (feeds from monthlyQuery) */}
        <div className="bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Flagged Works
            </span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-md">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2 min-h-[32px]">
            {monthlyQuery.loading && !monthlyQuery.data ? (
              <Skeleton className="h-7 w-20 rounded" />
            ) : monthlyQuery.error && !monthlyQuery.data ? (
              <span className="text-2xl font-bold font-mono text-slate-400" title="Data unavailable">—</span>
            ) : (
              <span className="text-2xl font-bold font-mono text-[#0F1419]">
                {totalFlaggedCount?.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">12-Month Medium & High Risk</p>
        </div>

        {/* Card 2: Cost Overrun Signals (feeds from monthlyQuery) */}
        <div className="bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Cost Overrun Signals
            </span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2 min-h-[32px]">
            {monthlyQuery.loading && !monthlyQuery.data ? (
              <Skeleton className="h-7 w-20 rounded" />
            ) : monthlyQuery.error && !monthlyQuery.data ? (
              <span className="text-2xl font-bold font-mono text-slate-400" title="Data unavailable">—</span>
            ) : (
              <span className="text-2xl font-bold font-mono text-amber-600">
                {totalCostOverruns?.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Flagged works with overrun &gt; 0%</p>
        </div>

        {/* Card 3: Timeline Stall Signals (feeds from monthlyQuery) */}
        <div className="bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Timeline Stall Signals
            </span>
            <div className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-md">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2 min-h-[32px]">
            {monthlyQuery.loading && !monthlyQuery.data ? (
              <Skeleton className="h-7 w-20 rounded" />
            ) : monthlyQuery.error && !monthlyQuery.data ? (
              <span className="text-2xl font-bold font-mono text-slate-400" title="Data unavailable">—</span>
            ) : (
              <span className="text-2xl font-bold font-mono text-[#1D9BF0]">
                {totalDelaySignals?.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Flagged works in Delayed status</p>
        </div>

        {/* Card 4: Suspicious Vendors (feeds from vendorsQuery) */}
        <div className="bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Concentration Risk
            </span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-md">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2 min-h-[32px]">
            {vendorsQuery.loading && !vendorsQuery.data ? (
              <Skeleton className="h-7 w-20 rounded" />
            ) : vendorsQuery.error && !vendorsQuery.data ? (
              <span className="text-2xl font-bold font-mono text-slate-400" title="Data unavailable">—</span>
            ) : (
              <>
                <span className="text-2xl font-bold font-mono text-rose-600">
                  {suspiciousVendorStats?.suspicious}
                </span>
                <span className="text-[11px] text-slate-400">
                  / {suspiciousVendorStats?.total} top vendors
                </span>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">&gt;40% risk ratio or single state</p>
        </div>

        {/* Card 5: Highest Flagged Category (feeds from categoriesQuery) */}
        <div className="bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle col-span-2 sm:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Top Risk Category
            </span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 min-h-[32px]">
            {categoriesQuery.loading && !categoriesQuery.data ? (
              <div className="space-y-1">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            ) : categoriesQuery.error && !categoriesQuery.data ? (
              <span className="text-2xl font-bold font-mono text-slate-400" title="Data unavailable">—</span>
            ) : (
              <>
                <span
                  className="text-sm font-bold text-[#0F1419] truncate block"
                  title={topCategoryStats?.name}
                >
                  {topCategoryStats?.name}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500 block">
                  {topCategoryStats?.count} flagged projects
                </span>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Highest frequency risk sector</p>
        </div>
      </div>

      {/* ====================================================================
          SECTION 1: TREND ANALYSIS
          - Chart 1: Flagged Work Trend (Dynamic peak & MoM status)
          - Chart 2: Risk Distribution by Category (sorted horizontal bars, dynamic height, truncated labels)
          ==================================================================== */}
      <div>
        <div className="mb-3">
          <h2 className="text-sm font-bold text-[#0F1419] tracking-tight uppercase">
            Trend Analysis
          </h2>
          <p className="text-[11px] text-slate-500">
            Temporal progression of risk vectors and structural breakdown by public work sector
          </p>
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
                    Monthly Medium- and High-Risk Activity ({timePeriod} Months)
                  </p>
                </div>
              </div>

              {/* Dynamic Badges: Peak & MoM change (Rendered only when data is loaded) */}
              {monthlyQuery.data && (
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
              )}
            </div>

            {monthlyQuery.error && !monthlyQuery.data ? (
              <ErrorState
                title="Flagged Work Trend Unavailable"
                message={monthlyQuery.error?.message}
                onRetry={monthlyQuery.refetch}
                className="py-12"
              />
            ) : monthlyQuery.loading && !monthlyQuery.data ? (
              <ChartSkeleton title="Flagged Work Trend" height="h-72" />
            ) : (
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
            )}
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
                    Sectors with the highest count of Medium- and High-Risk works
                  </p>
                </div>
              </div>
            </div>

            {categoriesQuery.error && !categoriesQuery.data ? (
              <ErrorState
                title="Category Distribution Unavailable"
                message={categoriesQuery.error?.message}
                onRetry={categoriesQuery.refetch}
                className="py-12"
              />
            ) : categoriesQuery.loading && !categoriesQuery.data ? (
              <ChartSkeleton title="Risk Category Distribution" height="h-72" />
            ) : categoryData.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="No Category Flags"
                message="No flagged category records in this scope."
              />
            ) : (
              /* Dynamically sized container to provide vertical breathing room for all categories */
              <div style={{ height: `${dynamicCategoryChartHeight}px` }} className="w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
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
                      tickFormatter={(label) => truncateCategoryLabel(label, 20)}
                      width={100}
                      axisLine={{ stroke: '#EFF3F4' }}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(val, name, entry) => [
                        `${val} flagged (${entry.payload.pct}% of category flags)`,
                        'Flagged Works',
                      ]}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.category || label}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid #EFF3F4',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                        fontSize: '12px',
                        maxWidth: '320px',
                        whiteSpace: 'normal',
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
            )}
          </div>
        </div>
      </div>

      {/* ====================================================================
          SECTION 2: BASELINE & ANOMALY ANALYSIS
          - Historical Baseline vs Actual Flagged Activity
          - Shared with Flagged Work Trend data source
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

          {monthlyQuery.error && !monthlyQuery.data ? (
            <ErrorState
              title="Historical Baseline Unavailable"
              message={monthlyQuery.error?.message}
              onRetry={monthlyQuery.refetch}
              className="py-12"
            />
          ) : monthlyQuery.loading && !monthlyQuery.data ? (
            <ChartSkeleton title="Historical Baseline vs Actual Activity" height="h-80" />
          ) : (
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
          )}
        </div>
      </div>

      {/* ====================================================================
          SECTION 3: STATE PERFORMANCE & DYNAMIC RISK INSIGHTS
          - Left: State Performance vs Risk (with district filter explanatory card)
          - Right: Risk Insights Panel (5 independent, unblocked insight rows)
          ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* State Performance Chart */}
        <div className="lg:col-span-7 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
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
                    {selectedState !== 'ALL' && selectedDistrict === 'ALL'
                      ? `Performance metrics for ${selectedState}`
                      : 'Compare completion rate with the share of flagged works across states'}
                  </p>
                </div>
              </div>

              {/* Sort Toggle (Visible only in multi-state national view) */}
              {selectedState === 'ALL' && selectedDistrict === 'ALL' && (
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[11px]">
                  <button
                    onClick={() => setStateSortMode('highestRisk')}
                    className={`px-2 py-1 rounded-md font-medium transition-all cursor-pointer ${
                      stateSortMode === 'highestRisk'
                        ? 'bg-white text-rose-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Highest Risk
                  </button>
                  <button
                    onClick={() => setStateSortMode('bestCompletion')}
                    className={`px-2 py-1 rounded-md font-medium transition-all cursor-pointer ${
                      stateSortMode === 'bestCompletion'
                        ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Best Completion
                  </button>
                </div>
              )}
            </div>

            {/* If District Filter is Active: Render Explanatory Message */}
            {selectedDistrict !== 'ALL' ? (
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#1D9BF0]">
                  <MapPin className="w-5.5 h-5.5" />
                </div>
                <div className="max-w-sm space-y-1">
                  <h4 className="text-sm font-bold text-[#0F1419]">State Comparison Inactive</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    State Performance vs Risk compares metrics across state administrative units. When filtering down to a specific district (<strong>{selectedDistrict}</strong>), state-level comparison is not applicable.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearDistrict}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#1D9BF0] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-all shadow-2xs mt-2 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Clear District Filter</span>
                </button>
              </div>
            ) : statesQuery.error && !statesQuery.data ? (
              <ErrorState
                title="State Performance Unavailable"
                message={statesQuery.error?.message}
                onRetry={statesQuery.refetch}
                className="py-12"
              />
            ) : statesQuery.loading && !statesQuery.data ? (
              <ChartSkeleton title="State Performance vs Risk" height="h-72" />
            ) : stateData.length === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="No State Records"
                message="No state performance records available."
              />
            ) : (
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
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
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
            )}
          </div>
        </div>

        {/* Dynamic Risk Insights (5 Independently Gated Insight Lines) */}
        <div className="lg:col-span-5 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
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
                    Continuous operational signals evaluated across distinct risk vectors
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Live Signals
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {/* Insight 1: Month-over-Month Trend (gated by monthlyQuery) */}
              <InsightCard
                loading={monthlyQuery.loading && !monthlyQuery.data}
                error={monthlyQuery.error && !monthlyQuery.data}
                title={
                  trendStats.momDirection === 'increasing'
                    ? 'Flagged Activity Increased'
                    : trendStats.momDirection === 'decreasing'
                    ? 'Flagged Activity Decreased'
                    : 'Flagged Activity Steady'
                }
                text={
                  monthlyQuery.error && !monthlyQuery.data
                    ? 'Month-over-month trend telemetry could not be loaded.'
                    : trendStats.momDirection === 'increasing'
                    ? `Flagged activity increased by ${trendStats.momChange} works (${trendStats.momPercent > 0 ? `+${trendStats.momPercent}%` : ''}) compared to the previous month.`
                    : trendStats.momDirection === 'decreasing'
                    ? `Flagged activity decreased by ${Math.abs(trendStats.momChange)} works (${trendStats.momPercent}% MoM) compared to the previous month.`
                    : 'Flagged work activity remained unchanged compared to the previous month.'
                }
                type={
                  trendStats.momDirection === 'increasing'
                    ? 'warning'
                    : trendStats.momDirection === 'decreasing'
                    ? 'positive'
                    : 'neutral'
                }
              />

              {/* Insight 2: Baseline Deviation (gated by monthlyQuery) */}
              <InsightCard
                loading={monthlyQuery.loading && !monthlyQuery.data}
                error={monthlyQuery.error && !monthlyQuery.data}
                title={
                  baselineData.aboveBaselineCount > 0
                    ? 'Activity Above Historical Baseline'
                    : 'Activity Within Historical Baseline'
                }
                text={
                  monthlyQuery.error && !monthlyQuery.data
                    ? 'Historical baseline telemetry could not be loaded.'
                    : baselineData.aboveBaselineCount > 0
                    ? `${baselineData.aboveBaselineCount} of ${filteredMonthlyTrends.length} tracked months had flagged works exceeding the period baseline (${baselineData.baselineValue} works/month).`
                    : `All ${filteredMonthlyTrends.length} tracked months remained at or below the historical baseline (${baselineData.baselineValue} works/month).`
                }
                type={baselineData.aboveBaselineCount > 0 ? 'info' : 'positive'}
              />

              {/* Insight 3: Category Concentration (gated by categoriesQuery) */}
              <InsightCard
                loading={categoriesQuery.loading && !categoriesQuery.data}
                error={categoriesQuery.error && !categoriesQuery.data}
                title={categoryData.length > 0 ? 'Sector Risk Concentration' : 'No Category Anomalies'}
                text={
                  categoriesQuery.error && !categoriesQuery.data
                    ? 'Category vulnerability telemetry could not be loaded.'
                    : categoryData.length > 0
                    ? `${categoryData[0].category} represents the highest volume of flagged projects with ${categoryData[0].count} works (${categoryData[0].pct}% of flagged category records).`
                    : 'No sector risk concentrations detected in the active scope.'
                }
                type={categoryData.length > 0 ? 'warning' : 'neutral'}
              />

              {/* Insight 4: State Risk Insight (gated by statesQuery & district filter) */}
              {selectedDistrict !== 'ALL' ? (
                <InsightCard
                  loading={false}
                  error={false}
                  title="State Comparison Inactive"
                  text={`State risk telemetry comparison is disabled while the district filter (${selectedDistrict}) is applied.`}
                  type="neutral"
                  icon={MapPin}
                />
              ) : (
                <InsightCard
                  loading={statesQuery.loading && !statesQuery.data}
                  error={statesQuery.error && !statesQuery.data}
                  title={
                    selectedState !== 'ALL'
                      ? `${selectedState} State Profile`
                      : 'State With Highest Flagged Ratio'
                  }
                  text={
                    statesQuery.error && !statesQuery.data
                      ? 'State comparison telemetry could not be loaded.'
                      : selectedState !== 'ALL'
                      ? stateData[0]
                        ? `${stateData[0].state} records a completion rate of ${stateData[0].completionRate}% with a flagged work share of ${stateData[0].flaggedPercent}%.`
                        : 'No records available for the selected state.'
                      : stateData[0]
                      ? `${stateData[0].state} has the highest share of flagged works at ${stateData[0].flaggedPercent}% (Completion: ${stateData[0].completionRate}%).`
                      : 'No state comparison records found.'
                  }
                  type={
                    selectedState !== 'ALL'
                      ? 'info'
                      : stateData[0]?.flaggedPercent > 30
                      ? 'warning'
                      : 'neutral'
                  }
                />
              )}

              {/* Insight 5: Vendor Concentration (gated by vendorsQuery) */}
              <InsightCard
                loading={vendorsQuery.loading && !vendorsQuery.data}
                error={vendorsQuery.error && !vendorsQuery.data}
                title={
                  (topVendors.filter((v) => Boolean(v.isSuspicious)).length > 0)
                    ? 'Vendor Concentration Signals'
                    : 'No Vendor Concentration Flags'
                }
                text={
                  vendorsQuery.error && !vendorsQuery.data
                    ? 'Vendor concentration telemetry could not be loaded.'
                    : (topVendors.filter((v) => Boolean(v.isSuspicious)).length > 0)
                    ? `${topVendors.filter((v) => Boolean(v.isSuspicious)).length} of ${topVendors.length} tracked top vendors meet concentration-risk criteria (>40% flagged ratio or single-state lock with ≥5 works).`
                    : 'None of the top vendors currently exceed the concentration-risk threshold in this scope.'
                }
                type={
                  (topVendors.filter((v) => Boolean(v.isSuspicious)).length > 0)
                    ? 'alert'
                    : 'positive'
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          SECTION 4: VENDOR CONCENTRATION & RISK
          - High Concentration Risk indicator
          - Evaluates only qualifying in-scope expenditures
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
                Vendors with high flagged-work concentration or concentrated regional activity
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            Criteria: Flagged ratio &gt; 40% OR 1 state with ≥ 5 works. (Requires review; does not imply proven collusion)
          </div>
        </div>

        {vendorsQuery.error && !vendorsQuery.data ? (
          <ErrorState
            title="Vendor Concentration Unavailable"
            message={vendorsQuery.error?.message}
            onRetry={vendorsQuery.refetch}
            className="py-12"
          />
        ) : vendorsQuery.loading && !vendorsQuery.data ? (
          <CardSkeleton count={3} />
        ) : topVendors.length === 0 ? (
          <EmptyState
            icon={Building}
            title="No Vendor Records"
            message="No qualifying vendor expenditures found for the selected geographic filter."
          />
        ) : (
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
        )}
      </div>
    </div>
  );
}
