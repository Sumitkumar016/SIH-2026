import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, ChevronRight, Check } from 'lucide-react';
import RiskBadge from './RiskBadge';

/**
 * AlertBellIcon Component
 * Top-right notification bell showing live count of new flagged cases,
 * with an interactive dropdown drawer for quick review.
 */
export default function AlertBellIcon({ alerts = [], onSelectAlert }) {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState(new Set());
  const dropdownRef = useRef(null);

  const unreadCount = alerts.filter(a => !readIds.has(a.workId)).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAlertClick = (alertItem) => {
    setReadIds(prev => new Set(prev).add(alertItem.workId));
    setIsOpen(false);
    if (onSelectAlert) {
      onSelectAlert(alertItem);
    }
  };

  const handleMarkAllRead = () => {
    const all = new Set(alerts.map(a => a.workId));
    setReadIds(all);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-slate-600 hover:text-[#0F1419] hover:bg-[#F7F9F9] border border-transparent hover:border-[#EFF3F4] transition-all"
        title="High-Risk Anomaly Alerts"
      >
        <Bell className="w-5 h-5 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white border border-[#EFF3F4] rounded-2xl shadow-hover z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3.5 bg-[#F7F9F9] border-b border-[#EFF3F4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-rose-100 rounded-md text-rose-600">
                <AlertTriangle className="w-3.5 h-3.5" />
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1419]">
                National High-Risk Alerts
              </h4>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-medium text-[#1D9BF0] hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#EFF3F4]">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active high-risk alerts.
              </div>
            ) : (
              alerts.map((item) => {
                const isUnread = !readIds.has(item.workId);
                return (
                  <div
                    key={item.workId}
                    onClick={() => handleAlertClick(item)}
                    className={`p-3.5 hover:bg-[#F7F9F9] cursor-pointer transition-colors flex items-start gap-3 ${
                      isUnread ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 block" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-mono font-bold text-[#0F1419] truncate">
                          {item.workId}
                        </span>
                        <RiskBadge level={item.riskLevel || 'High'} size="sm" />
                      </div>
                      <p className="text-xs text-slate-700 font-medium line-clamp-2">
                        {item.flagReason || item.warningSignal}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                        <span>{item.state} • {item.district}</span>
                        <span className="text-[#1D9BF0] font-medium flex items-center hover:underline">
                          Inspect <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-2.5 bg-[#F7F9F9] border-t border-[#EFF3F4] text-center">
            <span className="text-[11px] text-slate-500 font-medium">
              Continuous 24/7 AI telemetry monitoring 38,000+ works
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
