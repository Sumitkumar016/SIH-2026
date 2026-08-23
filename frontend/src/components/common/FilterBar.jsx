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
  showDistrict = true,
  showRiskLevel = true,
  showStatus = true,
  showDateRange = true,
}) {
  const defaultStates = [
    'All',
    'Assam',
    'Bihar',
    'Gujarat',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'Telangana',
    'Uttar Pradesh',
    'West Bengal',
  ];

  const defaultCategories = [
    'All',
    'Rural Roads & Bridges',
    'Drinking Water Supply',
    'Education & Smart Classrooms',
    'Healthcare Facilities',
    'Sanitation & Waste Mgmt',
    'Community Infrastructure',
    'Solar & Renewable Energy',
  ];

  const states = availableStates.length > 0 ? ['All', ...availableStates] : defaultStates;
  const categories = availableCategories.length > 0 ? ['All', ...availableCategories] : defaultCategories;

  const isFiltered = Object.entries(filters).some(([key, val]) => val && val !== 'All' && val !== '');

  return (
    <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-xl p-3.5 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-1">
        <Filter className="w-3.5 h-3.5 text-[#1D9BF0]" />
        <span>Filters:</span>
      </div>

      {/* State Filter */}
      <div className="flex flex-col">
        <select
          value={filters.state || 'All'}
          onChange={(e) => onFilterChange('state', e.target.value)}
          className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
        >
          <option value="All">All States (India)</option>
          {states.filter(s => s !== 'All').map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col">
        <select
          value={filters.category || 'All'}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
        >
          <option value="All">All Work Categories</option>
          {categories.filter(c => c !== 'All').map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Risk Level Filter */}
      {showRiskLevel && (
        <div className="flex flex-col">
          <select
            value={filters.riskLevel || 'All'}
            onChange={(e) => onFilterChange('riskLevel', e.target.value)}
            className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
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
        <div className="flex flex-col">
          <select
            value={filters.status || 'All'}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Delayed">Delayed / Overdue</option>
            <option value="Sanctioned">Sanctioned</option>
            <option value="Under Review">Under Review</option>
            <option value="Halted">Halted / Stalled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      )}

      {/* Financial Year / Date Range Filter */}
      {showDateRange && (
        <div className="flex flex-col">
          <select
            value={filters.financialYear || 'FY 2023-24'}
            onChange={(e) => onFilterChange('financialYear', e.target.value)}
            className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
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
        <button
          onClick={onReset}
          className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#1D9BF0] transition-colors px-2 py-1 bg-white border border-[#EFF3F4] rounded-lg hover:border-[#1D9BF0]"
          title="Reset all active filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}
