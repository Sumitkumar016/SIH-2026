import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ChevronRight,
  ArrowUpDown,
  Search,
  Filter,
  RotateCcw,
  ShieldAlert,
  Bot,
  MapPin,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import RiskBadge from '../../components/common/RiskBadge';
import SearchBox from '../../components/common/SearchBox';
import { ErrorState, EmptyState } from '../../components/common/loading';
import { auditorApi } from '../../api/auditorApi';

/**
 * PAGE 1: High-Risk Case Queue (Auditor Role)
 * Route: /auditor/queue
 * Purpose: Surfaces ONLY Medium and High risk cases requiring deep-dive forensic investigation.
 */
export default function AuditorCaseQueuePage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    riskLevel: 'All',
    caseStatus: 'All',
    source: 'All',
  });
  const navigate = useNavigate();

  const loadQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await auditorApi.getCaseQueue({
        search: searchQuery,
        ...filters,
      });
      setCases(res.data || []);
    } catch (err) {
      console.error('Failed to load auditor case queue:', err);
      setError(err?.message || 'Failed to retrieve investigation cases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [searchQuery, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({ riskLevel: 'All', caseStatus: 'All', source: 'All' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-100 rounded-lg text-rose-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F1419] tracking-tight">
              High-Risk Investigation Case Queue
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Active audit queue prioritizing <span className="font-bold text-rose-700">High and Medium risk cases</span> across India. Low risk works are filtered out automatically.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white border border-[#EFF3F4] px-3.5 py-2 rounded-xl text-xs font-mono shadow-xs self-start md:self-auto">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Investigation Backlog</span>
            <span className="text-base font-extrabold text-rose-600">{cases.length} Open Cases</span>
          </div>
        </div>
      </div>

      {/* Search & Custom Filter Bar */}
      <div className="space-y-3">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search investigation cases by Work ID, MP Name, vendor, district, state..."
        />

        {/* Custom Filter Bar for Auditor Queue */}
        <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-xl p-3.5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#1D9BF0]" />
            <span>Filters:</span>
          </div>

          {/* Risk Level Filter (Medium / High only) */}
          <select
            value={filters.riskLevel}
            onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
            className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
          >
            <option value="All">All Priority Risks (Med + High)</option>
            <option value="High">🔴 High Risk Only (&ge;70)</option>
            <option value="Medium">🟡 Medium Risk Only (40-69)</option>
          </select>

          {/* Case Status Filter */}
          <select
            value={filters.caseStatus}
            onChange={(e) => handleFilterChange('caseStatus', e.target.value)}
            className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
          >
            <option value="All">All Case Statuses</option>
            <option value="New">New / Unassigned</option>
            <option value="Under Review">Under Review</option>
            <option value="Escalated">Escalated by District</option>
            <option value="Resolved">Resolved / Report Filed</option>
          </select>

          {/* Source Tag Filter */}
          <select
            value={filters.source}
            onChange={(e) => handleFilterChange('source', e.target.value)}
            className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
          >
            <option value="All">All Flag Sources</option>
            <option value="ai">🤖 AI Flagged</option>
            <option value="district">📍 District Escalated</option>
          </select>

          {(filters.riskLevel !== 'All' || filters.caseStatus !== 'All' || filters.source !== 'All' || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#1D9BF0] transition-colors px-2 py-1 bg-white border border-[#EFF3F4] rounded-lg"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Case Queue Table */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F9F9] border-b border-[#EFF3F4] text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4">Work ID</th>
                <th className="py-3 px-4">Recommending MP</th>
                <th className="py-3 px-4">State & District</th>
                <th className="py-3 px-3 text-center">Risk Score</th>
                <th className="py-3 px-4 min-w-[220px]">Flag Reason / Trigger</th>
                <th className="py-3 px-3 text-center">Case Status</th>
                <th className="py-3 px-4 text-center">Source</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className={`divide-y divide-[#EFF3F4] text-xs ${loading && cases.length > 0 ? 'opacity-70 transition-opacity' : ''}`}>
              {error ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <ErrorState
                      title="Failed to Load Investigation Cases"
                      message={error}
                      onRetry={loadQueue}
                    />
                  </td>
                </tr>
              ) : loading && cases.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-28" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                    <td className="py-3 px-3 text-center"><div className="h-6 bg-slate-200 rounded-full w-14 mx-auto" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-44" /></td>
                    <td className="py-3 px-3 text-center"><div className="h-5 bg-slate-200 rounded w-16 mx-auto" /></td>
                    <td className="py-4 px-4 text-center"><div className="h-5 bg-slate-200 rounded w-20 mx-auto" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-4 bg-slate-200 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <EmptyState
                      icon={CheckCircle2}
                      title="No High-Risk Cases Found"
                      message="No high-risk investigation cases match the selected filters."
                      actionText="Reset Filters"
                      onAction={handleResetFilters}
                    />
                  </td>
                </tr>
              ) : (
                cases.map((c) => {
                  const isDistrictSource = c.escalationSource === 'district';

                  return (
                    <tr
                      key={c.workId}
                      onClick={() => navigate(`/auditor/case/${c.workId}`)}
                      className="hover:bg-[#F7F9F9] cursor-pointer transition-colors group"
                    >
                      {/* Work ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                        <div className="flex items-center gap-1.5">
                          <span>{c.workId}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1D9BF0]" />
                        </div>
                      </td>

                      {/* MP Name */}
                      <td className="py-3.5 px-4 font-medium text-[#0F1419]">
                        <div>{c.mpName}</div>
                        <div className="text-[10px] text-slate-400">{c.category}</div>
                      </td>

                      {/* State & District */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        <div>{c.state}</div>
                        <div className="text-[10px] text-slate-400">{c.district}</div>
                      </td>

                      {/* Risk Score */}
                      <td className="py-3.5 px-3 text-center">
                        <RiskBadge level={c.riskLevel} score={c.riskScore} size="sm" />
                      </td>

                      {/* Flag Reason */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 max-w-xs">
                        <p className="line-clamp-2" title={c.flagReason}>
                          {c.flagReason}
                        </p>
                      </td>

                      {/* Case Status */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          c.caseStatus === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : c.caseStatus === 'Escalated'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : c.caseStatus === 'Under Review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {c.caseStatus}
                        </span>
                      </td>

                      {/* Source Tag Column */}
                      <td className="py-3.5 px-4 text-center">
                        {isDistrictSource ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] bg-purple-50 text-purple-800 border border-purple-200" title={c.escalationNote || 'Escalated by District Collectorate'}>
                            <MapPin className="w-3 h-3 text-purple-600" />
                            <span>📍 District Escalated</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] bg-sky-50 text-sky-800 border border-sky-200">
                            <Bot className="w-3 h-3 text-[#1D9BF0]" />
                            <span>🤖 AI Flagged</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-xs font-semibold text-[#1D9BF0] group-hover:underline flex items-center justify-end">
                          <span>Investigate</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#F7F9F9] border-t border-[#EFF3F4] flex items-center justify-between text-xs text-slate-500">
          <span>
            Click any row to open the full AI Investigation & Action Center.
          </span>
          <span className="font-mono font-semibold text-slate-700">
            Showing {cases.length} priority investigation cases
          </span>
        </div>
      </div>

    </div>
  );
}
