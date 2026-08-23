import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ExternalLink,
  ArrowUpDown,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import RiskBadge from '../../components/common/RiskBadge';
import SearchBox from '../../components/common/SearchBox';
import FilterBar from '../../components/common/FilterBar';
import { mpApi } from '../../api/mpApi';

/**
 * PAGE 2: My Works (Full List)
 * Route: /mp/works
 * Full portfolio of all recommended, sanctioned, ongoing and completed works for the logged-in MP.
 */
export default function MpWorksListPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [works, setWorks] = useState([]);
  const [mpProfile, setMpProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    category: 'All',
    riskLevel: 'All',
  });

  // Sorting
  const [sortField, setSortField] = useState('recommendedDate');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    async function loadWorks() {
      setLoading(true);
      const res = await mpApi.getMyWorks('MP-BR-0412', {
        search: searchQuery,
        ...filters,
      });
      setWorks(res.data || []);
      setMpProfile(res.mp);
      setLoading(false);
    }
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
      status: 'All',
      category: 'All',
      riskLevel: 'All',
    });
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
          <span className="font-bold text-[#0F1419]">{works.length} Works</span>
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
          showDistrict={false}
          showDateRange={false}
          availableStates={[]} // Hides state dropdown since it's single MP
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

            <tbody className="divide-y divide-[#EFF3F4] text-xs">
              {sortedWorks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShieldCheck className="w-8 h-8 text-slate-300" />
                      <span className="font-medium text-sm">No works match the selected criteria.</span>
                      <button
                        onClick={handleResetFilters}
                        className="text-xs text-[#1D9BF0] hover:underline"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedWorks.map((w) => (
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
                      {w.mpJustification && (
                        <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Justification Submitted
                        </div>
                      )}
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

        {/* Footer */}
        <div className="px-4 py-3 bg-[#F7F9F9] border-t border-[#EFF3F4] flex items-center justify-between text-xs text-slate-500">
          <span>
            Click on any row to view full project breakdown & submit official MP clarifications.
          </span>
          <span className="font-mono font-medium">
            Showing {sortedWorks.length} of {works.length} works
          </span>
        </div>
      </div>

    </div>
  );
}
