import React from 'react';
import Skeleton from './Skeleton';

/**
 * WorkDetailSkeleton
 * Comprehensive skeleton layout for project dossier and case detail views.
 */
export default function WorkDetailSkeleton({ className = '' }) {
  return (
    <div className={`space-y-6 ${className} animate-in fade-in duration-200`}>
      {/* Breadcrumb Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EFF3F4]">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-md" />
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
      </div>

      {/* Header Banner Skeleton */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 sm:p-6 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="h-6 w-96 max-w-full rounded-md" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle">
            <Skeleton className="h-3.5 w-24 mb-2 rounded-md" />
            <Skeleton className="h-7 w-28 mb-1 rounded-lg" />
            <Skeleton className="h-3 w-36 rounded-md" />
          </div>
        ))}
      </div>

      {/* Two Column Layout (Left: Timeline/Financials, Right: Risk/Auditor) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EFF3F4]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle space-y-3">
            <Skeleton className="h-5 w-40 mb-3" />
            <Skeleton className="h-44 w-full rounded-xl" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle space-y-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>

          <div className="bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle space-y-3">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
