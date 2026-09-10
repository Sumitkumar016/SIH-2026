import React, { useState, useEffect, useRef } from 'react';
import { onApiActivityChange } from '../../../api/apiClient';

/**
 * GlobalLoadingBar
 * A silky-smooth, GPU-accelerated top progress bar (YouTube / GitHub / Vercel style).
 * - Hardware-accelerated with CSS `transform: scaleX(...)` (zero layout reflow, no frame drops).
 * - Single continuous cubic-bezier easing curve (eliminates choppy setTimeout stepping/lag).
 * - Snappy 120ms rush to 100% upon completion followed by a graceful 160ms fade-out.
 * - 1.2s safety timeout ensures perfectly timed, predictable completion.
 */
export default function GlobalLoadingBar() {
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [fading, setFading] = useState(false);

  const completeTimerRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const safetyTimeoutRef = useRef(null);
  const rafRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cancelAnimationFrame(rafRef.current);
      clearTimeout(completeTimerRef.current);
      clearTimeout(fadeTimerRef.current);
      clearTimeout(safetyTimeoutRef.current);
    };
  }, []);

  const finishLoading = () => {
    clearTimeout(safetyTimeoutRef.current);
    clearTimeout(completeTimerRef.current);
    clearTimeout(fadeTimerRef.current);
    cancelAnimationFrame(rafRef.current);

    setIsComplete(true);
    setScale(1);

    // Fast finish: hold at 100% for 120ms then fade out smoothly
    completeTimerRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      setFading(true);

      // Once fade-out finishes (160ms), reset and unmount cleanly
      fadeTimerRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        setVisible(false);
        setScale(0);
        setIsComplete(false);
        setFading(false);
      }, 160);
    }, 120);
  };

  const startLoading = () => {
    clearTimeout(completeTimerRef.current);
    clearTimeout(fadeTimerRef.current);
    clearTimeout(safetyTimeoutRef.current);
    cancelAnimationFrame(rafRef.current);

    setFading(false);
    setIsComplete(false);
    setVisible(true);
    setScale(0);

    // Use requestAnimationFrame to trigger continuous, buttery-smooth CSS GPU interpolation
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        if (!isMountedRef.current) return;
        // Glide smoothly to ~86% over 1.1s using a natural deceleration bezier
        setScale(0.86);
      });
    });

    // Exact 1.2s safety threshold: finishes cleanly without lagging or lingering
    safetyTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        finishLoading();
      }
    }, 1200);
  };

  useEffect(() => {
    return onApiActivityChange((isBusy) => {
      if (isBusy) {
        startLoading();
      } else {
        finishLoading();
      }
    });
  }, []);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading data"
      className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] pointer-events-none overflow-hidden bg-transparent"
      style={{
        opacity: fading ? 0 : 1,
        transition: 'opacity 160ms ease-out',
      }}
    >
      <div
        className="h-full w-full origin-left bg-gradient-to-r from-[#1D9BF0] via-[#38BDF8] to-[#0284C7] shadow-[0_0_10px_rgba(29,155,240,0.9),0_0_4px_rgba(56,189,248,0.8)]"
        style={{
          transform: `scaleX(${scale})`,
          willChange: 'transform',
          transition: isComplete
            ? 'transform 120ms ease-out'
            : 'transform 1100ms cubic-bezier(0.12, 0.78, 0.22, 1)',
        }}
      />
    </div>
  );
}
