import React from 'react';
import { Inbox, RotateCcw } from 'lucide-react';

/**
 * EmptyState Component
 *
 * Pixel-accurate empty state matching MPLADS Sentinel design language:
 * - Supports both standalone card mode and embedded/table mode (no double borders)
 * - Flexible prop aliases: message/description, actionText/actionLabel
 * - Refined squircle icon container with subtle brand accents
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No Records Found',
  description,
  message,
  actionLabel,
  actionText,
  actionIcon: ActionIcon = RotateCcw,
  onAction,
  variant = 'auto', // 'auto' | 'card' | 'embedded'
  className = '',
  children,
}) {
  const resolvedDesc = message || description || 'No records match the selected filters or query.';
  const resolvedAction = actionLabel || actionText;

  const isCard = variant === 'card';
  const containerClasses = isCard
    ? 'bg-white border border-[#EFF3F4] rounded-2xl p-8 sm:p-10 shadow-subtle'
    : 'py-8 sm:py-12 px-4';

  return (
    <div
      className={`text-center flex flex-col items-center justify-center space-y-3 group select-none ${containerClasses} ${className}`}
    >
      {/* Icon Squircle */}
      <div className="w-12 h-12 rounded-2xl bg-[#F7F9F9] border border-[#EFF3F4] flex items-center justify-center text-slate-400 shadow-2xs group-hover:scale-105 group-hover:text-slate-500 group-hover:border-slate-300 transition-all duration-200">
        <Icon className="w-5.5 h-5.5" />
      </div>

      {/* Text Hierarchy */}
      <div className="max-w-sm space-y-1">
        <h3 className="text-sm font-bold text-[#0F1419] tracking-tight">{title}</h3>
        {resolvedDesc && (
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            {resolvedDesc}
          </p>
        )}
      </div>

      {/* Action Button */}
      {resolvedAction && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#1D9BF0] bg-sky-50/80 hover:bg-sky-100 hover:text-[#1A8CD8] border border-sky-200/60 rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-[0.98] mt-1 cursor-pointer"
        >
          <ActionIcon className="w-3.5 h-3.5 text-[#1D9BF0]" />
          <span>{resolvedAction}</span>
        </button>
      )}

      {children}
    </div>
  );
}
