import React from 'react';

/**
 * Sparkline Component
 * SVG line chart for rendering 6-8 week risk score progression inline in tables.
 */
export default function Sparkline({
  data = [10, 15, 20, 30, 45, 60],
  width = 110,
  height = 28,
  strokeColor = '#EF4444',
  fillColor = 'rgba(239, 68, 68, 0.12)',
  showCurrentDot = true,
}) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data, 0);
  const max = Math.max(...data, 100);
  const range = max - min || 1;

  const padding = 3;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * usableWidth;
    const y = height - padding - ((val - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polylineStr = points.join(' ');
  const lastPoint = points[points.length - 1].split(',');
  const [lastX, lastY] = [parseFloat(lastPoint[0]), parseFloat(lastPoint[1])];

  const areaPoints = `${points[0].split(',')[0]},${height - padding} ${polylineStr} ${lastX},${height - padding}`;

  return (
    <div className="inline-flex items-center" title={`Trajectory: ${data.join(' → ')}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Fill under the curve */}
        <polygon points={areaPoints} fill={fillColor} />
        {/* Sparkline curve */}
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylineStr}
        />
        {/* Current / endpoint pulse dot */}
        {showCurrentDot && (
          <circle
            cx={lastX}
            cy={lastY}
            r="3"
            fill={strokeColor}
            className="animate-ping opacity-75"
          />
        )}
        {showCurrentDot && (
          <circle
            cx={lastX}
            cy={lastY}
            r="3"
            fill={strokeColor}
          />
        )}
      </svg>
    </div>
  );
}
