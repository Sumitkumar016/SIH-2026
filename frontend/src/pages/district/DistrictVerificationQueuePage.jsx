import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  ShieldAlert,
  Search,
  ExternalLink,
  MessageSquare,
  X,
  Sparkles,
  Info,
} from 'lucide-react';
import RiskBadge from '../../components/common/RiskBadge';
import SearchBox from '../../components/common/SearchBox';
import { ErrorState, EmptyState } from '../../components/common/loading';
import { districtApi } from '../../api/districtApi';

/**
 * PAGE 2: Work Verification Queue (District Authority View)
 * Route: /district/verification
 * Purpose: Surfaces ONLY completed works where mandatory geotagged photo evidence is missing.
 */
export default function DistrictVerificationQueuePage() {
  const { onOpenWorkDetail, refreshData } = useOutletContext();
  const [queueWorks, setQueueWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');

  // Modal / Action states
  const [escalatingWork, setEscalatingWork] = useState(null);
  const [escalationNote, setEscalationNote] = useState('');
  const [isEscalating, setIsEscalating] = useState(false);

  // Toast / notification state
  const [toastMessage, setToastMessage] = useState(null);

  const loadQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await districtApi.getVerificationQueue();
      setQueueWorks(res.data || []);
    } catch (err) {
      console.error('Failed to load verification queue:', err);
      setError(err?.message || 'Failed to retrieve district verification queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Action 1: Mark as Verified
  const handleMarkVerified = async (e, work) => {
    e.stopPropagation();
    await districtApi.markWorkVerified(work.workId);
    showToast(`Work ${work.workId} marked as verified & removed from pending queue.`);
    await loadQueue();
    if (refreshData) refreshData();
  };

  // Action 2: Request Evidence
  const handleRequestEvidence = async (e, work) => {
    e.stopPropagation();
    await districtApi.requestEvidence(work.workId, 'Urgent reminder dispatched to block engineer & contractor.');
    showToast(`Evidence submission notice dispatched for ${work.workId}.`);
    await loadQueue();
    if (refreshData) refreshData();
  };

  // Action 3: Open Escalation Modal
  const handleOpenEscalation = (e, work) => {
    e.stopPropagation();
    setEscalatingWork(work);
    setEscalationNote('Mandatory completion photo evidence not provided after multiple statutory reminder periods.');
  };

  // Submit Escalation to Investigation (Updates shared mock data for Auditor)
  const handleSubmitEscalation = async (e) => {
    e.preventDefault();
    if (!escalatingWork || !escalationNote.trim()) return;

    setIsEscalating(true);
    await districtApi.escalateWorkToInvestigation(escalatingWork.workId, escalationNote.trim());
    setIsEscalating(false);
    setEscalatingWork(null);

    showToast(`Work ${escalatingWork.workId} escalated to Independent Auditor for investigation.`);
    await loadQueue();
    if (refreshData) refreshData();
  };

  const filteredQueue = queueWorks.filter((w) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      w.workId.toLowerCase().includes(q) ||
      w.mpName.toLowerCase().includes(q) ||
      (w.description && w.description.toLowerCase().includes(q)) ||
      w.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Verification Guidance Banner */}
      <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-800">
              <FileCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F1419] tracking-tight">
              Work Ground Verification Queue
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Surfacing <span className="font-bold text-[#0F1419]">completed works with missing photo evidence</span>. Confirm ground reality, request proof, or escalate to Independent Auditor.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white border border-[#EFF3F4] px-3.5 py-2 rounded-xl text-xs font-mono shadow-xs self-start md:self-auto">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Pending Queue</span>
            <span className="text-base font-extrabold text-amber-700">{queueWorks.length} Works</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <SearchBox
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search verification queue by Work ID, MP Name, description, or contractor..."
      />

      {/* Verification Queue Table */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F9F9] border-b border-[#EFF3F4] text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4">Work ID</th>
                <th className="py-3 px-4">Recommending MP</th>
                <th className="py-3 px-4 min-w-[200px]">Description</th>
                <th className="py-3 px-3">Completion Date</th>
                <th className="py-3 px-3 text-center">Overdue Days</th>
                <th className="py-3 px-3 text-center">Risk Level</th>
                <th className="py-3 px-3 text-center">Asset Status</th>
                <th className="py-3 px-4 text-right min-w-[260px]">Verification Actions</th>
              </tr>
            </thead>

            <tbody className={`divide-y divide-[#EFF3F4] text-xs ${loading && queueWorks.length > 0 ? 'opacity-70 transition-opacity' : ''}`}>
              {error ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <ErrorState
                      title="Failed to Load Verification Queue"
                      message={error}
                      onRetry={loadQueue}
                    />
                  </td>
                </tr>
              ) : loading && queueWorks.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-28 mb-1" /><div className="h-3 bg-slate-100 rounded w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-44 mb-1" /><div className="h-3 bg-slate-100 rounded w-24" /></td>
                    <td className="py-4 px-3 font-mono"><div className="h-4 bg-slate-200 rounded w-16" /></td>
                    <td className="py-4 px-3 text-center"><div className="h-5 bg-slate-200 rounded w-12 mx-auto" /></td>
                    <td className="py-4 px-3 text-center"><div className="h-5 bg-slate-200 rounded w-14 mx-auto" /></td>
                    <td className="py-4 px-3 text-center"><div className="h-5 bg-slate-200 rounded w-16 mx-auto" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-7 bg-slate-200 rounded w-36 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <EmptyState
                      icon={CheckCircle2}
                      title="All Completed Works Verified"
                      message="No pending verification flags in the ground queue for Patna district."
                    />
                  </td>
                </tr>
              ) : (
                filteredQueue.map((work) => {
                  const isHighOrMed = work.riskLevel === 'High' || work.riskLevel === 'Medium' || (work.riskScore && work.riskScore >= 40);
                  const isEscalated = work.escalationSource === 'district';

                  return (
                    <tr
                      key={work.workId}
                      onClick={() => onOpenWorkDetail(work)}
                      className="hover:bg-[#F7F9F9] cursor-pointer transition-colors group"
                    >
                      {/* Work ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                        <div className="flex items-center gap-1.5">
                          <span>{work.workId}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1D9BF0]" />
                        </div>
                      </td>

                      {/* MP Name */}
                      <td className="py-3.5 px-4 font-medium text-[#0F1419]">
                        <div>{work.mpName}</div>
                        <div className="text-[10px] text-slate-400">{work.category}</div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 max-w-xs font-medium text-slate-700">
                        <div className="line-clamp-2">{work.description || work.flagReason}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Contractor: {work.vendorName}</div>
                      </td>

                      {/* Completion Date */}
                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">
                        {work.completionDate?.split(' ')[0] || '2024-03-10'}
                      </td>

                      {/* Days Since Completion */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 text-xs">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>{work.daysSinceCompletion || 90}d</span>
                        </div>
                      </td>

                      {/* Risk Level */}
                      <td className="py-3.5 px-3 text-center">
                        <RiskBadge level={work.riskLevel} score={work.riskScore} size="sm" />
                      </td>

                      {/* Asset Verification Status */}
                      <td className="py-3.5 px-3 text-center">
                        {(() => {
                          const status = (work.assetVerificationStatus || 'none').toLowerCase();
                          if (status === 'verified') {
                            return (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Verified
                              </span>
                            );
                          }
                          if (status === 'disputed') {
                            return (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                Disputed
                              </span>
                            );
                          }
                          if (status === 'unverified') {
                            return (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Unverified
                              </span>
                            );
                          }
                          return (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                              None
                            </span>
                          );
                        })()}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Button 1: Mark Verified */}
                          <button
                            onClick={(e) => handleMarkVerified(e, work)}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors shadow-xs"
                            title="Confirm photo evidence verified on ground"
                          >
                            Mark Verified
                          </button>

                          {/* Button 2: Request Evidence */}
                          <button
                            onClick={(e) => handleRequestEvidence(e, work)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors border shadow-xs ${
                              work.evidenceReminderSent
                                ? 'bg-sky-50 text-[#1D9BF0] border-sky-200'
                                : 'bg-white text-slate-700 border-[#EFF3F4] hover:bg-slate-50'
                            }`}
                            title="Send notice to contractor and block engineer"
                          >
                            {work.evidenceReminderSent ? 'Notice Sent ✓' : 'Request Evidence'}
                          </button>

                          {/* Button 3: Escalate to Investigation (Only Medium or High Risk) */}
                          {isHighOrMed && (
                            isEscalated ? (
                              <span className="px-2 py-1 text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-lg flex items-center gap-1">
                                <ShieldAlert className="w-3 h-3" />
                                Escalated to Auditor
                              </span>
                            ) : (
                              <button
                                onClick={(e) => handleOpenEscalation(e, work)}
                                className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors shadow-xs flex items-center gap-1"
                                title="Escalate to Independent Auditor for forensic investigation"
                              >
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                <span>Escalate</span>
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Informational Callout Bar */}
        <div className="p-3.5 bg-[#F7F9F9] border-t border-[#EFF3F4] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#1D9BF0]" />
            <span>
              Under MPLADS guidelines, physical verification photos must be uploaded within 30 days of completion before final account settlement.
            </span>
          </div>
          <span className="font-mono text-[11px] font-semibold text-slate-700">
            District Queue: {filteredQueue.length} Cases
          </span>
        </div>
      </div>

      {/* ESCALATION TO INVESTIGATION MODAL */}
      {escalatingWork && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-modal border border-[#EFF3F4] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-100 rounded-lg text-rose-700">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-rose-900">
                  Escalate Work to Independent Auditor
                </h3>
              </div>
              <button onClick={() => setEscalatingWork(null)} className="text-slate-400 hover:text-[#0F1419]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitEscalation} className="p-5 space-y-4">
              <div className="p-3 rounded-xl bg-[#F7F9F9] border border-[#EFF3F4] text-xs space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="font-bold text-[#0F1419]">{escalatingWork.workId}</span>
                  <RiskBadge level={escalatingWork.riskLevel} score={escalatingWork.riskScore} size="sm" />
                </div>
                <div className="text-slate-700">{escalatingWork.description}</div>
                <div className="text-[11px] text-slate-500">MP: {escalatingWork.mpName} • Completed {escalatingWork.daysSinceCompletion || 90} days ago</div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  District Authority Escalation Reason:
                </label>
                <textarea
                  rows={3}
                  value={escalationNote}
                  onChange={(e) => setEscalationNote(e.target.value)}
                  placeholder="Provide reason for escalating to Auditor (e.g. Photo evidence not provided after multiple reminder notices)..."
                  className="w-full text-xs p-3 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-[#0F1419]"
                  required
                />
              </div>

              <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-100 text-[11px] text-purple-800">
                ⚡ <strong>Auditor Integration:</strong> This case will be tagged as <span className="font-mono font-bold">escalationSource: "district"</span> and will immediately appear in the Auditor's Priority Investigation queue.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EFF3F4]">
                <button
                  type="button"
                  onClick={() => setEscalatingWork(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#0F1419] bg-white border border-[#EFF3F4] rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEscalating || !escalationNote.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isEscalating ? 'Escalating...' : 'Confirm Escalation to Auditor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
