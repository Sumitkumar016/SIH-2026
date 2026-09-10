import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import {
  Download,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import RiskBadge from '../components/common/RiskBadge';
import SearchBox from '../components/common/SearchBox';
import FilterBar from '../components/common/FilterBar';
import { ErrorState, EmptyState } from '../components/common/loading';
import { mpladsService } from '../api/mpladsService';

/**
 * PAGE 2: All Flagged Cases
 * Route: /ministry/flagged
 */
export default function FlaggedCasesPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [searchParams] = useSearchParams();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  // Initialise state filter from ?state= query param if present (e.g. navigated from state risk matrix)
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: searchParams.get('state') || 'All',
    category: 'All',
    riskLevel: 'All',
    status: 'All',
    financialYear: 'All',
  });

  // Sorting & Pagination State
  const [sortField, setSortField] = useState('riskScore');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const loadWorks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await mpladsService.getFlaggedWorks({
        search: searchQuery,
        ...filters,
      });
      setWorks(res.data || []);
      setCurrentPage(1); // reset to page 1 on filter change
    } catch (err) {
      console.error('Failed to load flagged works:', err);
      setError(err?.message || 'Failed to retrieve flagged cases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorks();
  }, [searchQuery, filters]);

  // Client-side Sorting
  const sortedWorks = useMemo(() => {
    return [...works].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [works, sortField, sortDirection]);

  // Pagination Slice
  const totalPages = Math.ceil(sortedWorks.length / pageSize) || 1;
  const paginatedWorks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedWorks.slice(start, start + pageSize);
  }, [sortedWorks, currentPage, pageSize]);

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
      category: 'All',
      riskLevel: 'All',
      status: 'All',
      financialYear: 'All',
    });
  };

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = ['Work ID', 'MP Name', 'State', 'District', 'Category', 'Risk Score', 'Risk Level', 'Sanctioned Amount (Lakhs)', 'Expenditure (Lakhs)', 'Status', 'Flag Reason'];
    const rows = sortedWorks.map(w => [
      `"${w.workId}"`,
      `"${w.mpName}"`,
      `"${w.state}"`,
      `"${w.district}"`,
      `"${w.category}"`,
      w.riskScore,
      `"${w.riskLevel}"`,
      w.sanctionedAmount,
      w.expenditure || 0,
      `"${w.status}"`,
      `"${(w.flagReason || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MPLADS_Flagged_For_Review_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header & Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F1419] tracking-tight">
            Works Flagged for Review
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central repository of works flagged by AI audit algorithms across India.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#0F1419] bg-white border border-[#EFF3F4] rounded-xl hover:bg-[#F7F9F9] hover:border-slate-300 transition-all shadow-xs self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Export Flagged List (CSV)</span>
        </button>
      </div>

      {/* Search & Filter Section */}
      <div className="space-y-3">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by Work ID, MP Name, Vendor Name, District..."
        />
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </div>

      {/* Flagged Cases Data Table */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F9F9] border-b border-[#EFF3F4] text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th
                  onClick={() => handleSort('workId')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Work ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('mpName')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Recommending MP</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('state')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>State / District</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('riskScore')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Risk Level & Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[220px]">
                  Flag Reason / Diagnostic Signal
                </th>
                <th
                  onClick={() => handleSort('sanctionedAmount')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Sanctioned</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className={`divide-y divide-[#EFF3F4] text-xs ${loading && works.length > 0 ? 'opacity-70 transition-opacity' : ''}`}>
              {error ? (
                <tr>
                  <td colSpan={7} className="py-8">
                    <ErrorState
                      title="Failed to Load Flagged Cases"
                      message={error}
                      onRetry={loadWorks}
                    />
                  </td>
                </tr>
              ) : loading && works.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-28 mb-1" /><div className="h-3 bg-slate-100 rounded w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-24 mb-1" /><div className="h-3 bg-slate-100 rounded w-14" /></td>
                    <td className="py-4 px-4 text-center"><div className="h-6 bg-slate-200 rounded-full w-16 mx-auto" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-48 mb-1" /><div className="h-3 bg-slate-100 rounded w-32" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-4 bg-slate-200 rounded w-14 ml-auto" /></td>
                    <td className="py-4 px-4"><div className="h-5 bg-slate-200 rounded w-16" /></td>
                  </tr>
                ))
              ) : paginatedWorks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8">
                    <EmptyState
                      icon={ShieldCheck}
                      title="No Flagged Works Found"
                      message="No works match the selected search and filter criteria."
                      actionText="Reset All Filters"
                      onAction={handleResetFilters}
                    />
                  </td>
                </tr>
              ) : (
                paginatedWorks.map((w) => (
                  <tr
                    key={w.workId}
                    onClick={() => onOpenWorkDetail(w)}
                    className="hover:bg-[#F7F9F9] cursor-pointer transition-colors group"
                  >
                    {/* Work ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                      <div className="flex items-center gap-1.5">
                        <span>{w.workId}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1D9BF0]" />
                      </div>
                    </td>

                    {/* MP Name */}
                    <td className="py-3.5 px-4 font-medium text-[#0F1419]">
                      <div>{w.mpName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{w.category}</div>
                    </td>

                    {/* State & District */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <div>{w.state}</div>
                      <div className="text-[10px] text-slate-400">{w.district}</div>
                    </td>

                    {/* Risk Badge & Score */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5">
                        <RiskBadge
                          level={w.fraudRiskTier || w.riskLevel}
                          score={w.fraudRiskScore ?? w.riskScore}
                          confidence={w.dataConfidence}
                          type={w.inefficiencyScore !== undefined ? "Fraud" : null}
                          size="sm"
                        />
                        {w.inefficiencyScore !== undefined && (
                          <RiskBadge
                            level={w.inefficiencyTier || 'Low'}
                            score={w.inefficiencyScore}
                            type="Delay"
                            size="sm"
                          />
                        )}
                      </div>
                    </td>

                    {/* Flag Reason */}
                    <td className="py-3.5 px-4 font-medium text-slate-700 max-w-xs">
                      <p className="line-clamp-2" title={w.flagReason}>
                        {w.flagReason}
                      </p>
                    </td>

                    {/* Sanctioned Amount */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#0F1419]">
                      ₹{w.sanctionedAmount?.toFixed(2)}L
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        w.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : w.status === 'Delayed'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : w.status === 'Under Review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-[#F7F9F9] border-t border-[#EFF3F4] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Showing{' '}
            <span className="font-bold text-[#0F1419]">
              {sortedWorks.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-bold text-[#0F1419]">
              {Math.min(currentPage * pageSize, sortedWorks.length)}
            </span>{' '}
            of <span className="font-bold text-[#0F1419]">{sortedWorks.length}</span> flagged cases
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#EFF3F4] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#EFF3F4] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
