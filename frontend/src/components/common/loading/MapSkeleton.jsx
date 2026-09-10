import React from 'react';
import Skeleton from './Skeleton';

/**
 * MapSkeleton
 * Renders a placeholder grid for the State-wise Risk Matrix.
 */
export default function MapSkeleton({ className = '' }) {
  return (
    <div className={`bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Skeleton className="h-4 w-48 mb-1.5" />
          <Skeleton className="h-3 w-72" />
        </div>
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="p-3 bg-[#F7F9F9] rounded-xl border border-[#EFF3F4] flex flex-col justify-between h-20"
          >
            <Skeleton className="h-3.5 w-16" />
            <div className="flex items-center justify-between mt-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
