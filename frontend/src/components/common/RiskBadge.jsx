import React from 'react';

/**
 * RiskBadge Component
 * Displays a clean, high-contrast risk indicator (High = Red, Medium = Amber, Low = Green)
 * Follows the requirement: Risk colors are the only "loud" colors in the light UI.
 */
export default function RiskBadge({ level = 'Low', score = null, confidence = null, type = null, size = 'md', showDot = true }) {
  const normalizedLevel = (level || 'low').toLowerCase();

  let styles = {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    label: type ? `${type}: Low` : 'Low Risk',
  };

  if (normalizedLevel === 'high' || (score !== null && score >= 70)) {
    styles = {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-500 animate-pulse',
      label: type ? `${type}: High` : 'High Risk',
    };
  } else if (normalizedLevel === 'medium' || (score !== null && score >= 40)) {
    styles = {
      bg: 'bg-amber-50 text-amber-900 border-amber-200',
      dot: 'bg-amber-500',
      label: type ? `${type}: Medium` : 'Medium Risk',
    };
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  }[size] || 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styles.bg} ${sizeClasses} whitespace-nowrap shadow-xs`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />}
      <span>{styles.label}</span>
      {score !== null && (
        <span className="ml-1 opacity-75 font-mono text-[11px]">
          ({score})
        </span>
      )}
      {confidence !== null && (
        <span
          className="ml-1 text-[10px] opacity-60"
          title="Data confidence: how much corroborating evidence backs this score"
        >
          · {confidence}% confidence
        </span>
      )}
    </span>
  );
}
