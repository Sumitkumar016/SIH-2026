import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

/**
 * FilterBar Component
 * Dropdown filters for State, District, Category, Date Range / FY, Risk Level, Status
 */
export default function FilterBar({
  filters = {},
  onFilterChange,
  onReset,
  availableStates = [],
  availableDistricts = [],
  availableCategories = [],
  showState = true,
  showDistrict = true,
  showRiskLevel = true,
  showStatus = true,
  showDateRange = true,
}) {
  const states = ['All', ...(availableStates || []).filter((s) => s && s !== 'All')];
  const categories = ['All', ...(availableCategories || []).filter((c) => c && c !== 'All')];

  const isFiltered = Object.entries(filters).some(([key, val]) => val && val !== 'All' && val !== '');

  return (
    <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-xl p-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[auto_repeat(5,minmax(0,1fr))_auto] gap-2.5 items-center">
        {/* Filter Label */}
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5 text-[#1D9BF0]" />
          <span>Filters:</span>
        </div>

        {/* State Filter */}
        {showState && (
          <div className="w-full">
            <select
              value={filters.state || 'All'}
              onChange={(e) => onFilterChange('state', e.target.value)}
              className="w-full max-w-full lg:max-w-[200px] truncate bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
            >
              <option value="All">All States (India)</option>
              {states.filter(s => s !== 'All').map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {/* Category Filter */}
        <div className="w-full">
          <select
            value={filters.category || 'All'}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full max-w-full lg:max-w-[200px] truncate bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
          >
            <option value="All">All Work Categories</option>
            {categories.filter(c => c !== 'All').map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Risk Level Filter */}
        {showRiskLevel && (
          <div className="w-full">
            <select
              value={filters.riskLevel || 'All'}
              onChange={(e) => onFilterChange('riskLevel', e.target.value)}
              className="w-full max-w-full lg:max-w-[200px] truncate bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">🔴 High Risk Only</option>
              <option value="Medium">🟡 Medium Risk</option>
              <option value="Low">🟢 Low Risk</option>
            </select>
          </div>
        )}

        {/* Status Filter */}
        {showStatus && (
          <div className="w-full">
            <select
              value={filters.status || 'All'}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full max-w-full lg:max-w-[200px] truncate bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Delayed">Delayed / Overdue</option>
              <option value="Sanctioned">Sanctioned</option>
              <option value="Under Review">Under Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        )}

        {/* Financial Year / Date Range Filter */}
        {showDateRange && (
          <div className="w-full">
            <select
              value={filters.financialYear || 'FY 2023-24'}
              onChange={(e) => onFilterChange('financialYear', e.target.value)}
              className="w-full max-w-full lg:max-w-[200px] truncate bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
            >
              <option value="FY 2024-25">FY 2024-25 (Current)</option>
              <option value="FY 2023-24">FY 2023-24</option>
              <option value="FY 2022-23">FY 2022-23</option>
              <option value="All">All Fiscal Years</option>
            </select>
          </div>
        )}

        {/* Reset Button */}
        {isFiltered && (
          <div className="w-full sm:w-auto sm:col-span-2 md:col-span-1 lg:col-span-1 flex justify-end">
            <button
              onClick={onReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1 text-xs font-medium text-slate-500 hover:text-[#1D9BF0] transition-colors px-2.5 py-1.5 bg-white border border-[#EFF3F4] rounded-lg hover:border-[#1D9BF0] shadow-xs"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
