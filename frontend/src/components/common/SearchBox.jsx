import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBox Component
 * Text search input for Work ID, MP Name, Vendor, Constituency, etc.
 */
export default function SearchBox({
  value = '',
  onChange,
  placeholder = 'Search by Work ID, MP Name, Vendor, District...',
  className = '',
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 bg-white text-sm text-[#0F1419] placeholder-slate-400 border border-[#EFF3F4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all shadow-xs"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
