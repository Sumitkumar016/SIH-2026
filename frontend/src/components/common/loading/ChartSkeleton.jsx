import React from 'react';
import Skeleton from './Skeleton';

/**
 * ChartSkeleton
 * Renders a structured placeholder for charts and analytics graphs.
 */
export default function ChartSkeleton({
  height = 'h-72',
  title = 'Loading analytics...',
  type = 'bar', // 'bar' | 'area' | 'pie'
  className = '',
}) {
  return (
    <div className={`bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <Skeleton className="h-4 w-44 mb-1.5" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-6 w-20 rounded-lg" />
      </div>

      {/* Chart Visual Body */}
      <div className={`w-full ${height} flex items-end justify-between gap-2 pt-6 pb-2 px-4 bg-[#F7F9F9]/60 rounded-xl border border-dashed border-[#EFF3F4]`}>
        {type === 'pie' ? (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="w-36 h-36 rounded-full" />
          </div>
        ) : (
          [45, 75, 30, 90, 60, 40, 80, 55, 70, 85, 35, 65].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end gap-2">
              <Skeleton
                className="w-full max-w-[28px] rounded-t-md"
                style={{ height: `${val}%` }}
              />
              <Skeleton className="h-2 w-4" />
            </div>
          ))
        )}
      </div>

      {/* Legend / Footer */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-[#EFF3F4]">
        <div className="flex items-center gap-2">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
