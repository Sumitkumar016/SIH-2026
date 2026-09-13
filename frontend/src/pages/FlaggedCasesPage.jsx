import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Loader2,
} from 'lucide-react';
import RiskBadge from '../components/common/RiskBadge';
import SearchBox from '../components/common/SearchBox';
import FilterBar from '../components/common/FilterBar';
import { ErrorState, EmptyState } from '../components/common/loading';
import { mpladsService } from '../api/mpladsService';

const EXPORT_BATCH_SIZE = 50;

/**
 * PAGE 2: All Flagged Cases
 * Route: /ministry/flagged
 */
export default function FlaggedCasesPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [searchParams] = useSearchParams();
  const [works, setWorks] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
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
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // CSV Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  // Mounted ref to guard against state updates after unmount during CSV exports
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // AbortController ref to safely manage in-flight requests and prevent out-of-order race conditions
  const abortControllerRef = useRef(null);

  // Reset to page 1 whenever filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Hoisted data loader with AbortController protection and retry capability
  const loadWorks = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const res = await mpladsService.getFlaggedWorks(
        {
          search: searchQuery,
          ...filters,
          page: currentPage,
          limit: pageSize,
          sortField,
          sortDirection,
        },
        { signal: controller.signal }
      );

      // Discard state updates if another request was triggered
      if (abortControllerRef.current !== controller) return;

      const incoming = res.data || [];
      setWorks(incoming);
      setTotalCount(res.pagination?.total ?? res.total ?? incoming.length);
      setTotalPages(
        res.pagination?.totalPages ??
          Math.max(1, Math.ceil((res.total || incoming.length) / pageSize))
      );

      // Directly consume complete uncached live metadata from server
      if (Array.isArray(res.availableStates)) {
        setAvailableStates(res.availableStates);
      }
      if (Array.isArray(res.availableCategories)) {
        setAvailableCategories(res.availableCategories);
      }
    } catch (err) {
      if (err?.name === 'AbortError' || err?.isAborted) {
        // Request was aborted in favor of a newer query - do not update state
        return;
      }
      console.error('Failed to load flagged works:', err);
      setError(err?.message || 'Failed to retrieve flagged cases.');
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, [searchQuery, filters, currentPage, sortField, sortDirection]);

  useEffect(() => {
    loadWorks();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadWorks]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  // Batched CSV Export handler (fetches all filtered rows sequentially using safe batch size)
  const handleExportCSV = async () => {
    if (totalCount === 0) {
      alert('No flagged works to export with the current filter criteria.');
      return;
    }

    try {
      if (isMountedRef.current) {
        setIsExporting(true);
        setExportStatus('Starting export...');
      }

      const totalBatches = Math.ceil(totalCount / EXPORT_BATCH_SIZE);
      let allRows = [];

      for (let batchNum = 1; batchNum <= totalBatches; batchNum++) {
        if (!isMountedRef.current) break;
        if (isMountedRef.current) {
          setExportStatus(`Preparing export... (${allRows.length} of ${totalCount})`);
        }

        const res = await mpladsService.getFlaggedWorks({
          search: searchQuery,
          ...filters,
          sortField,
          sortDirection,
          page: batchNum,
          limit: EXPORT_BATCH_SIZE,
        });

        if (!isMountedRef.current) break;

        const batchData = res.data || [];
        allRows = allRows.concat(batchData);

        if (batchData.length < EXPORT_BATCH_SIZE) {
          break;
        }
      }

      if (!isMountedRef.current) return;
      if (isMountedRef.current) {
        setExportStatus(`Generating CSV (${allRows.length} records)...`);
      }

      const headers = [
        'Work ID',
        'MP Name',
        'Category',
        'State',
        'District',
        'Risk Score',
        'Risk Level',
        'Sanctioned Amount (Lakhs)',
        'Expenditure (Lakhs)',
        'Status',
        'Flag Reason',
      ];

      const rows = allRows.map((w) => [
        `"${w.workId}"`,
        `"${w.mpName}"`,
        `"${w.category}"`,
        `"${w.state}"`,
        `"${w.district}"`,
        w.riskScore,
        `"${w.riskLevel}"`,
        w.sanctionedAmount ?? 0,
        w.expenditure || 0,
        `"${w.status}"`,
        `"${(w.flagReason || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `MPLADS_Flagged_For_Review_Export_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export CSV:', err);
      alert(`Export failed: ${err.message || 'Network error'}`);
    } finally {
      if (isMountedRef.current) {
        setIsExporting(false);
        setExportStatus('');
      }
    }
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
          disabled={isExporting || totalCount === 0 || loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#0F1419] bg-white border border-[#EFF3F4] rounded-xl hover:bg-[#F7F9F9] hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs self-start sm:self-auto"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 text-[#1D9BF0] animate-spin" />
              <span>{exportStatus || 'Preparing export...'}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export Flagged List (CSV)</span>
            </>
          )}
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
          availableStates={availableStates}
          availableCategories={availableCategories}
        />
      </div>

      {/* Flagged Cases Data Table */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F9F9] border-b border-[#EFF3F4] text-[11px] font-bold uppercase tracking-wider text-slate-600">
                {/* 1. Work ID */}
                <th
                  onClick={() => handleSort('workId')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Work ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                {/* 2. Recommending MP */}
                <th
                  onClick={() => handleSort('mpName')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Recommending MP</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                {/* 3. Category (Dedicated Column) */}
                <th
                  onClick={() => handleSort('category')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Category</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                {/* 4. State / District */}
                <th
                  onClick={() => handleSort('state')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>State / District</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                {/* 5. Risk Level & Score */}
                <th
                  onClick={() => handleSort('riskScore')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Risk Level & Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                {/* 6. Flag Reason / Diagnostic Signal */}
                <th className="py-3 px-4 min-w-[220px]">
                  Flag Reason / Diagnostic Signal
                </th>

                {/* 7. Sanctioned */}
                <th
                  onClick={() => handleSort('sanctionedAmount')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Sanctioned</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                {/* 8. Status */}
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

            <tbody
              className={`divide-y divide-[#EFF3F4] text-xs ${
                loading && works.length > 0 ? 'opacity-70 transition-opacity' : ''
              }`}
            >
              {error ? (
                <tr>
                  <td colSpan={8} className="py-8">
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
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-20" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-28" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-24" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-24 mb-1" />
                      <div className="h-3 bg-slate-100 rounded w-16" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="h-6 bg-slate-200 rounded-full w-24 mx-auto" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-48 mb-1" />
                      <div className="h-3 bg-slate-100 rounded w-32" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="h-4 bg-slate-200 rounded w-14 ml-auto" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-5 bg-slate-200 rounded w-16" />
                    </td>
                  </tr>
                ))
              ) : works.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8">
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
                works.map((w) => (
                  <tr
                    key={w.workId}
                    onClick={() => onOpenWorkDetail(w)}
                    className="hover:bg-[#F7F9F9] cursor-pointer transition-colors group"
                  >
                    {/* 1. Work ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                      <div className="flex items-center gap-1.5">
                        <span>{w.workId}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1D9BF0]" />
                      </div>
                    </td>

                    {/* 2. Recommending MP */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0F1419]">{w.mpName}</div>
                    </td>

                    {/* 3. Category (Dedicated Column) */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {w.category}
                    </td>

                    {/* 4. State / District */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0F1419]">{w.state}</div>
                      <div className="text-[10px] text-slate-500">{w.district}</div>
                    </td>

                    {/* 5. Risk Level & Score (Single Badge: 🔴 High Risk (100)) */}
                    <td className="py-3.5 px-4 text-center">
                      <RiskBadge
                        level={w.fraudRiskTier || w.riskLevel || 'Medium'}
                        score={w.fraudRiskScore || w.riskScore}
                        size="sm"
                      />
                    </td>

                    {/* 6. Flag Reason */}
                    <td className="py-3.5 px-4 font-medium text-slate-700 max-w-xs">
                      <p className="line-clamp-2" title={w.flagReason}>
                        {w.flagReason}
                      </p>
                    </td>

                    {/* 7. Sanctioned Amount */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#0F1419]">
                      ₹{(w.sanctionedAmount ?? 0).toFixed(2)}L
                    </td>

                    {/* 8. Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          w.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : w.status === 'Delayed'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : w.status === 'Under Review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
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
              {totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-bold text-[#0F1419]">
              {Math.min(currentPage * pageSize, totalCount)}
            </span>{' '}
            of <span className="font-bold text-[#0F1419]">{totalCount}</span> flagged cases
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-[#EFF3F4] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
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
