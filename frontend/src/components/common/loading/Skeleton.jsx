import React from 'react';

/**
 * Skeleton Primitive
 * Provides a standardized shimmering skeleton placeholder block.
 */
export default function Skeleton({ className = '', style = {} }) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={`animate-shimmer rounded-xl ${className}`}
    />
  );
}
