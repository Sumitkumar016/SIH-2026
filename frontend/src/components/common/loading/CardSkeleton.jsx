import React from 'react';
import Skeleton from './Skeleton';

/**
 * CardSkeleton
 * Placeholder for KPI metric cards, stats blocks, or summary tiles.
 */
export default function CardSkeleton({ count = 1, cols, className = '' }) {
  const cards = Array.from({ length: count });

  if (count === 1) {
    return (
      <div className={`bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle ${className}`}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-28 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-32 mt-2.5 rounded-lg" />
        <Skeleton className="h-3 w-40 mt-2.5 rounded-md" />
      </div>
    );
  }

  const effectiveCols = cols || (count <= 5 ? count : 4);
  const gridColsClass =
    effectiveCols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : effectiveCols === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : effectiveCols === 5
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} gap-4 ${className}`}>
      {cards.map((_, i) => (
        <div key={i} className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-24 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-28 mt-2.5 rounded-lg" />
          <Skeleton className="h-3 w-36 mt-2.5 rounded-md" />
        </div>
      ))}
    </div>
  );
}
