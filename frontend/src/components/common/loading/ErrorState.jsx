import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * ErrorState Component
 *
 * Pixel-accurate error card / inline state matching MPLADS Sentinel design language:
 * - Supports standalone card mode and embedded mode (inside table or panel)
 * - Uses soft rose indicator badge, high-contrast title, and Twitter-clean retry button
 */
export default function ErrorState({
  title = 'Unable to Load Data',
  message,
  description,
  onRetry,
  variant = 'auto', // 'auto' | 'card' | 'embedded'
  className = '',
  children,
}) {
  const resolvedMsg = message || description || 'A network or server error occurred while retrieving this information.';
  const isCard = variant === 'card';
  const containerClasses = isCard
    ? 'bg-white border border-rose-200/80 rounded-2xl p-8 sm:p-10 shadow-subtle'
    : 'py-8 sm:py-10 px-4';

  return (
    <div
      role="alert"
      className={`text-center flex flex-col items-center justify-center space-y-3.5 select-none ${containerClasses} ${className}`}
    >
      {/* Rose Alert Squircle */}
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shadow-2xs">
        <AlertTriangle className="w-5.5 h-5.5" />
      </div>

      {/* Text Hierarchy */}
      <div className="max-w-md space-y-1">
        <h3 className="text-sm font-bold text-[#0F1419] tracking-tight">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
          {resolvedMsg}
        </p>
      </div>

      {/* Retry Action Button */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#0F1419] bg-white border border-[#EFF3F4] hover:border-slate-300 hover:bg-[#F7F9F9] rounded-xl transition-all shadow-xs active:scale-[0.98] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
          <span>Retry Request</span>
        </button>
      )}

      {children}
    </div>
  );
}
