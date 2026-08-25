import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  User,
  MapPin,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Filter,
  X,
} from 'lucide-react';
import SearchBox from '../components/common/SearchBox';
import { ministryApi } from '../api/ministryApi';
import { mpladsService } from '../api/mpladsService';

/**
 * PAGE: MP Performance & Fund Utilization Register (Full View All Page)
 * Route: /ministry/mp-performance
 * 
 * Scoped strictly to MP recommendation & fund utilization performance:
 * - Primary ranking metric: Fund Utilization % (Expenditure / Sanctioned Amount)
 * - Secondary supporting metric: Completion Efficiency Rate %
 * - Neutral Twitter-blue styling with zero risk colors
 */
export default function MpPerformancePage() {
  const [mps, setMps] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: 'All',
    district: 'All',
    utilizationRange: 'All',
    completionRange: 'All',
  });

  // Sorting & Pagination State
  const [sortField, setSortField] = useState('fundUtilization');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Lightweight details expand / modal state
  const [expandedMpName, setExpandedMpName] = useState(null);
  const [selectedMpForModal, setSelectedMpForModal] = useState(null);

  useEffect(() => {
    async function loadMpData() {
      setLoading(true);
      const apiCaller = ministryApi?.getMpLeaderboard || mpladsService.getMpLeaderboard;
      const res = await apiCaller({
        search: searchQuery,
        ...filters,
        sortField,
        sortDirection,
      });

      setMps(res.data || []);
      if (res.availableStates && res.availableStates.length > 0) {
        setAvailableStates(res.availableStates);
      }
      if (res.availableDistricts && res.availableDistricts.length > 0) {
        setAvailableDistricts(res.availableDistricts);
      }
      setCurrentPage(1);
      setLoading(false);
    }
    loadMpData();
  }, [searchQuery, filters, sortField, sortDirection]);

  // Pagination Slice
  const totalPages = Math.ceil(mps.length / pageSize) || 1;
  const paginatedMps = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return mps.slice(start, start + pageSize);
  }, [mps, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      state: 'All',
      district: 'All',
      utilizationRange: 'All',
      completionRange: 'All',
    });
    setSortField('fundUtilization');
    setSortDirection('desc');
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    Object.entries(filters).some(([_, val]) => val && val !== 'All');

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = [
      'MP Name',
      'State',
      'Constituency / District',
      'Fund Utilization %',
      'Total Sanctioned (Lakhs)',
      'Total Expenditure (Lakhs)',
      'Total Works Recommended',
      'Total Works Completed',
      'Completion Rate %',
    ];
    const rows = mps.map((m) => [
      `"${m.mpName}"`,
      `"${m.state}"`,
      `"${m.constituency || m.district}"`,
      m.fundUtilization !== null ? `${m.fundUtilization}%` : 'N/A',
      m.totalSanctionedAmount,
      m.totalExpenditure,
      m.totalWorks,
      m.completedWorks,
      m.completionRate !== null ? `${m.completionRate}%` : 'N/A',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `MPLADS_MP_Performance_Leaderboard_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 ml-1 inline" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#1D9BF0] ml-1 inline" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#1D9BF0] ml-1 inline" />
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header & Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-lg border border-sky-100">
              <Award className="w-5 h-5 text-[#1D9BF0]" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F1419] tracking-tight">
              MP Performance & Fund Utilization Register
            </h1>
          </div>
          {/* Explanatory Caption */}
          <p className="text-xs text-slate-500 max-w-4xl leading-relaxed">
            Ranked by fund utilization; completion efficiency shown as a supporting metric — reflects MP recommendation activity, not execution or ground-level compliance, which is tracked separately under District and Auditor oversight.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#0F1419] bg-white border border-[#EFF3F4] rounded-xl hover:bg-[#F7F9F9] hover:border-slate-300 transition-all shadow-xs self-start sm:self-auto shrink-0"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Export Leaderboard (CSV)</span>
        </button>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by MP Name, Constituency, District, or State..."
            className="flex-1"
          />
        </div>

        {/* Custom Filter Bar for MP Leaderboard */}
        <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-xl p-3 flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#1D9BF0]" />
            <span>Filters:</span>
          </div>

          {/* State Filter */}
          <div className="flex flex-col">
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
            >
              <option value="All">All States (India)</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* District / Constituency Filter */}
          <div className="flex flex-col">
            <select
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer max-w-[200px]"
            >
              <option value="All">All Districts / Constituencies</option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Utilization Range Filter */}
          <div className="flex flex-col">
            <select
              value={filters.utilizationRange}
              onChange={(e) => handleFilterChange('utilizationRange', e.target.value)}
              className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
            >
              <option value="All">All Utilization %</option>
              <option value="75-100">75% - 100% (High)</option>
              <option value="50-75">50% - 75% (Moderate)</option>
              <option value="25-50">25% - 50% (Low)</option>
              <option value="0-25">0% - 25% (Critical Oversight)</option>
              <option value=">100">&gt; 100% (High Activity)</option>
            </select>
          </div>

          {/* Completion Rate Range Filter */}
          <div className="flex flex-col">
            <select
              value={filters.completionRange}
              onChange={(e) => handleFilterChange('completionRange', e.target.value)}
              className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
            >
              <option value="All">All Completion Rates</option>
              <option value="75-100">75% - 100% Completed</option>
              <option value="50-75">50% - 75% Completed</option>
              <option value="25-50">25% - 50% Completed</option>
              <option value="0-25">0% - 25% Completed</option>
            </select>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#1D9BF0] transition-colors px-2 py-1 bg-white border border-[#EFF3F4] rounded-lg hover:border-[#1D9BF0]"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main MP Data Table */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden">
        {/* Table Results Bar */}
        <div className="px-5 py-3 border-b border-[#EFF3F4] flex items-center justify-between text-xs text-slate-500 bg-[#F7F9F9]/50">
          <span>
            Showing <strong>{paginatedMps.length}</strong> of <strong>{mps.length}</strong> MPs
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Sorted by: {sortField} ({sortDirection.toUpperCase()})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EFF3F4] bg-[#F7F9F9] text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
                <th
                  onClick={() => handleSort('mpName')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <span>Member of Parliament</span>
                  {renderSortIcon('mpName')}
                </th>
                <th
                  onClick={() => handleSort('state')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <span>State</span>
                  {renderSortIcon('state')}
                </th>
                <th
                  onClick={() => handleSort('constituency')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <span>District / Constituency</span>
                  {renderSortIcon('constituency')}
                </th>
                <th
                  onClick={() => handleSort('fundUtilization')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors min-w-[220px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Fund Utilization %</span>
                    <span className="text-[10px] text-[#1D9BF0] font-normal lowercase">(primary)</span>
                    {renderSortIcon('fundUtilization')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('totalWorks')}
                  className="py-3 px-4 text-center cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <span>Works Rec.</span>
                  {renderSortIcon('totalWorks')}
                </th>
                <th
                  onClick={() => handleSort('completedWorks')}
                  className="py-3 px-4 text-center cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <span>Completed</span>
                  {renderSortIcon('completedWorks')}
                </th>
                <th
                  onClick={() => handleSort('completionRate')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Completion Rate</span>
                    <span className="text-[10px] text-slate-400 font-normal lowercase">(secondary)</span>
                    {renderSortIcon('completionRate')}
                  </div>
                </th>
                <th className="py-3 px-3 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFF3F4]">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D9BF0]" />
                    <p className="text-xs text-slate-500 mt-2">Loading MP Performance Records...</p>
                  </td>
                </tr>
              ) : paginatedMps.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-xs text-slate-500">
                    No MP performance records match the active search and filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedMps.map((mp) => {
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
                        onClick={() => setSelectedMpForModal(mp)}
                        className={`text-xs hover:bg-[#F7F9F9] transition-colors cursor-pointer group ${
                          isExpanded ? 'bg-[#F7F9F9]/80' : ''
                        }`}
                      >
                        {/* MP Name */}
                        <td className="py-3 px-4 font-semibold text-[#0F1419] group-hover:text-[#1D9BF0] transition-colors">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1D9BF0]" />
                            <span>{mp.mpName}</span>
                          </div>
                        </td>

                        {/* State */}
                        <td className="py-3 px-4 text-slate-700 font-medium">{mp.state}</td>

                        {/* District / Constituency */}
                        <td className="py-3 px-4 text-slate-600">
                          <span className="font-mono text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-[#EFF3F4]">
                            {mp.constituency || mp.district}
                          </span>
                        </td>

                        {/* Fund Utilization % (Primary Ranking Metric) */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-mono font-bold">
                              <span className="text-[#0F1419]">{utilizationDisplay}</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                ₹{mp.totalExpenditure}L / ₹{mp.totalSanctionedAmount}L
                              </span>
                            </div>
                            {/* Neutral Twitter-blue progress bar */}
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                              <div
                                className="h-2 rounded-full bg-[#1D9BF0] transition-all duration-300"
                                style={{ width: `${progressWidth}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Works Recommended */}
                        <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                          {mp.totalWorks}
                        </td>

                        {/* Completed Works */}
                        <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                          {mp.completedWorks}
                        </td>

                        {/* Completion Rate % (Secondary Metric) */}
                        <td className="py-3 px-4 text-right">
                          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {completionDisplay}
                          </span>
                        </td>

                        {/* Inline Expand Toggle */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedMpName(isExpanded ? null : mp.mpName);
                            }}
                            title="Toggle summary breakdown"
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
                                    {mp.mpName} — Aggregate Recommendation Rollup
                                  </span>
                                  <span className="text-[10px] bg-sky-50 text-[#1D9BF0] font-semibold px-2 py-0.5 rounded border border-sky-200">
                                    {mp.constituency || mp.district}, {mp.state}
                                  </span>
                                </div>
                                <button
                                  onClick={() => setSelectedMpForModal(mp)}
                                  className="text-xs text-[#1D9BF0] font-semibold hover:underline flex items-center gap-1"
                                >
                                  Open popover modal →
                                </button>
                              </div>

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

        {/* Pagination Bar */}
        <div className="px-5 py-3 border-t border-[#EFF3F4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-white">
          <span className="text-slate-500">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> (Total {mps.length} MPs)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#EFF3F4] text-slate-600 hover:bg-[#F7F9F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold font-mono transition-all ${
                  currentPage === pageNum
                    ? 'bg-[#1D9BF0] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-[#F7F9F9] border border-transparent hover:border-[#EFF3F4]'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-[#EFF3F4] text-slate-600 hover:bg-[#F7F9F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
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
                  <User className="w-5 h-5 text-[#1D9BF0]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F1419]">
                    {selectedMpForModal.mpName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {selectedMpForModal.constituency || selectedMpForModal.district},{' '}
                      {selectedMpForModal.state}
                    </span>
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
                  {selectedMpForModal.fundUtilization !== null
                    ? `${selectedMpForModal.fundUtilization}%`
                    : 'N/A'}
                </span>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div
                    className="h-1.5 rounded-full bg-[#1D9BF0]"
                    style={{
                      width: `${Math.min(100, selectedMpForModal.fundUtilization || 0)}%`,
                    }}
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
                  {selectedMpForModal.completionRate !== null
                    ? `${selectedMpForModal.completionRate}%`
                    : 'N/A'}
                </span>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div
                    className="h-1.5 rounded-full bg-slate-700"
                    style={{
                      width: `${Math.min(100, selectedMpForModal.completionRate || 0)}%`,
                    }}
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

            {/* Governance Note */}
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
