import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ExternalLink,
  ArrowUpDown,
  FileSpreadsheet,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import RiskBadge from '../../components/common/RiskBadge';
import SearchBox from '../../components/common/SearchBox';
import FilterBar from '../../components/common/FilterBar';
import { ErrorState, EmptyState } from '../../components/common/loading';
import { mpApi } from '../../api/mpApi';

/**
 * PAGE 2: My Works (Full List)
 * Route: /mp/works
 * Full portfolio of all recommended, sanctioned, ongoing and completed works for the logged-in MP.
 */
export default function MpWorksListPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [works, setWorks] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [mpProfile, setMpProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    category: 'All',
    riskLevel: 'All',
  });

  // Sorting & Pagination State
  const [sortField, setSortField] = useState('recommendedDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  useEffect(() => {
    let active = true;
    const loadWorks = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await mpApi.getMyWorks({
          search: searchQuery,
          ...filters,
          page: currentPage,
          limit: pageSize,
          sortField,
          sortDirection,
        });
        if (!active) return;
        const incoming = res.data || [];
        setWorks(incoming);
        setTotalCount(res.pagination?.total ?? res.total ?? incoming.length);
        setTotalPages(res.pagination?.totalPages ?? Math.max(1, Math.ceil((res.total || incoming.length) / pageSize)));

        if (incoming.length > 0) {
          setAvailableCategories((prev) => {
            const set = new Set([...prev, ...incoming.map((w) => w.category).filter(Boolean)]);
            return Array.from(set).sort();
          });
        }
        setMpProfile(res.mp);
      } catch (err) {
        if (!active) return;
        console.error('Failed to load MP works list:', err);
        setError(err?.message || 'Failed to retrieve constituency works register.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadWorks();
    return () => {
      active = false;
    };
  }, [searchQuery, filters, currentPage, sortField, sortDirection]);

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
      status: 'All',
      category: 'All',
      riskLevel: 'All',
    });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F1419] tracking-tight">
            My Constituency Works Register
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete lifecycle register of all MPLADS development projects recommended in {mpProfile?.constituency || 'Patna Sahib'}.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-white border border-[#EFF3F4] px-3 py-1.5 rounded-xl shadow-xs self-start sm:self-auto">
          <span className="text-slate-400">Total Portfolio:</span>
          <span className="font-bold text-[#0F1419]">{totalCount} Works</span>
        </div>
      </div>

      {/* Search and Filter Bar (Scoped: No State/District filters) */}
      <div className="space-y-3">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search my works by Work ID, description, category, or contractor..."
        />
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          showState={false}
          showDistrict={false}
          showDateRange={false}
          availableCategories={availableCategories}
        />
      </div>

      {/* Full Works Data Table */}
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
                <th className="py-3 px-4 min-w-[240px]">
                  Description & Scope
                </th>
                <th
                  onClick={() => handleSort('category')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Category</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('recommendedDate')}
                  className="py-3 px-3 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Recommended</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('sanctionDate')}
                  className="py-3 px-3 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Sanctioned</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('sanctionedAmount')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-3 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('riskScore')}
                  className="py-3 px-4 text-center cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Risk Evaluation</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className={`divide-y divide-[#EFF3F4] text-xs ${loading && works.length > 0 ? 'opacity-70 transition-opacity' : ''}`}>
              {error ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <ErrorState
                      title="Failed to Load Works Portfolio"
                      message={error}
                      onRetry={loadWorks}
                    />
                  </td>
                </tr>
              ) : loading && works.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-44 mb-1" /><div className="h-3 bg-slate-100 rounded w-24" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-28" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-4 bg-slate-200 rounded w-16 ml-auto" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-4 bg-slate-200 rounded w-14 ml-auto" /></td>
                    <td className="py-4 px-4 text-center"><div className="h-5 bg-slate-200 rounded w-16 mx-auto" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="py-4 px-4 text-center"><div className="h-6 bg-slate-200 rounded-full w-14 mx-auto" /></td>
                  </tr>
                ))
              ) : works.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <EmptyState
                      icon={ShieldCheck}
                      title="No Works Match Criteria"
                      message="No works match the selected search or filter settings."
                      actionText="Reset Filters"
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
                    {/* Work ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                      <div className="flex items-center gap-1.5">
                        <span>{w.workId}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1D9BF0]" />
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-[#0F1419] line-clamp-2">
                        {w.description || w.flagReason}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Contractor: {w.vendorName || 'Not Appointed'}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {w.category}
                    </td>

                    {/* Recommended Date */}
                    <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                      {w.recommendedDate || '2023-04-12'}
                    </td>

                    {/* Sanction Date */}
                    <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                      {w.sanctionDate || '—'}
                    </td>

                    {/* Sanctioned Amount */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#0F1419]">
                      ₹{w.sanctionedAmount?.toFixed(2)}L
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
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

                    {/* Risk Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <RiskBadge level={w.riskLevel} score={w.riskScore} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with True Server-Side Pagination */}
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
            of <span className="font-bold text-[#0F1419]">{totalCount}</span> works
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
