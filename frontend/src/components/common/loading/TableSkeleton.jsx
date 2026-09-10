import React from 'react';
import Skeleton from './Skeleton';

/**
 * TableSkeleton
 * Renders a structured skeleton table matching data grid views.
 */
export default function TableSkeleton({
  rows = 6,
  columns = 6,
  showHeader = true,
  className = '',
}) {
  const rowList = Array.from({ length: rows });
  const colList = Array.from({ length: columns });

  return (
    <div className={`bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden ${className}`}>
      {showHeader && (
        <div className="bg-[#F7F9F9] border-b border-[#EFF3F4] px-4 py-3 flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F9F9] border-b border-[#EFF3F4]">
              {colList.map((_, i) => (
                <th key={i} className="py-3 px-4">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFF3F4]">
            {rowList.map((_, rIdx) => (
              <tr key={rIdx}>
                {colList.map((_, cIdx) => (
                  <td key={cIdx} className="py-3.5 px-4">
                    <Skeleton
                      className={`h-4 ${
                        cIdx === 0
                          ? 'w-24'
                          : cIdx === 1
                          ? 'w-36'
                          : cIdx === colList.length - 1
                          ? 'w-16'
                          : 'w-20'
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
