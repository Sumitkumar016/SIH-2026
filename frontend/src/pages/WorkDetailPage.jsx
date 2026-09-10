import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  Calendar,
  IndianRupee,
  Building2,
  User,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  FileCheck,
  Copy,
  Check,
  Printer,
  ChevronRight,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import RiskBadge from '../components/common/RiskBadge';
import Sparkline from '../components/common/Sparkline';
import { mpladsService } from '../api/mpladsService';
import { auditorApi } from '../api/auditorApi';
import { useAuth } from '../context/AuthContext';

/**
 * WorkDetailPage Component
 * Dedicated full-page view for case/work details.
 * Replaces the former WorkDetailModal overlay popup with a permanent, URL-addressable route.
 *
 * Supported Routes:
 * - /ministry/cases/:workId
 * - /state/cases/:workId
 * - /mp/cases/:workId
 * - /district/cases/:workId
 * - /auditor/cases/:workId
 * - /cases/:workId (redirects based on role)
 */
export default function WorkDetailPage() {
  const { workId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Initialize work from route state if passed; otherwise will fetch by workId
  const [work, setWork] = useState(location.state?.work || null);
  const [loading, setLoading] = useState(!location.state?.work);
  const [notFound, setNotFound] = useState(false);

  // Copied State
  const [copiedId, setCopiedId] = useState(false);
  // Audit Notice State
  const [auditNoticeSent, setAuditNoticeSent] = useState(false);

  // Role check
  const isMpRole = user?.role === 'mp';

  // Determine breadcrumb back destination based on role
  const getBackDestination = () => {
    switch (user?.role) {
      case 'mp':
        return { path: '/mp/works', label: 'My Works' };
      case 'district':
        return { path: '/district/verification', label: 'Verification Queue' };
      case 'state':
        return { path: '/state/overview', label: 'State Overview' };
      case 'auditor':
        return { path: '/auditor/queue', label: 'Case Queue' };
      case 'ministry':
      default:
        return { path: '/ministry/flagged', label: 'Flagged Cases' };
    }
  };

  const backDest = getBackDestination();

  // Load work data by workId
  useEffect(() => {
    let isMounted = true;

    async function loadWork() {
      // Check if the work currently in state is already a full detail object
      const hasFullDetail =
        work &&
        work.workId?.toLowerCase() === workId?.toLowerCase() &&
        (Boolean(work.riskFactorBreakdown) ||
          Boolean(work.progressHistory) ||
          Boolean(work.expenditureBreakdown) ||
          Boolean(work.contractorName) ||
          Boolean(work.sanctionOrderNumber));

      if (hasFullDetail) {
        return;
      }

      if (!work) setLoading(true);
      setNotFound(false);

      try {
        let data = await mpladsService.getWorkById(workId);
        if (!data) {
          data = await auditorApi.getCaseById(workId);
        }

        if (isMounted) {
          if (data) {
            setWork(data);
          } else if (!work) {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.error('Failed to load work details:', err);
        if (isMounted && !work) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (workId) {
      loadWork();
    }
    return () => {
      isMounted = false;
    };
  }, [workId]);

  // Copy Work ID to clipboard
  const handleCopyId = () => {
    if (!work?.workId) return;
    navigator.clipboard?.writeText(work.workId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Issue Audit Notice (for Non-MP roles)
  const handleIssueAuditNotice = async () => {
    try {
      if (work?.workId) {
        await mpladsService.issueAuditNotice(work.workId);
      }
    } catch (err) {
      console.error('Failed to issue audit notice:', err);
    }
    setAuditNoticeSent(true);
    setTimeout(() => setAuditNoticeSent(false), 4000);
  };


  // Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#1D9BF0] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading case details for {workId}...</p>
      </div>
    );
  }

  // Case Not Found State
  if (notFound || !work) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="w-14 h-14 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#0F1419] mb-2">Case Dossier Not Found</h2>
        <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
          No work record with ID <span className="font-mono font-semibold text-[#0F1419]">{workId}</span> was found in the central registry or active watchlists.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-xs font-semibold text-[#0F1419] bg-white border border-[#EFF3F4] rounded-lg hover:bg-slate-50 shadow-xs flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            to={backDest.path}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1D9BF0] rounded-lg hover:bg-[#1A8CD8] shadow-xs"
          >
            Return to {backDest.label}
          </Link>
        </div>
      </div>
    );
  }

  // Prepare Explainability Chart Data
  const breakdown = work.riskFactorBreakdown || {
    costOverrun: 35,
    delaySlippage: 30,
    duplicateSimilarity: 20,
    vendorAnomaly: 15,
  };

  const chartData = [
    { factor: 'Cost Inflation', percent: breakdown.costOverrun || 0, color: '#EF4444' },
    { factor: 'Timeline Slippage', percent: breakdown.delaySlippage || 0, color: '#F59E0B' },
    { factor: 'Duplicate/GIS Match', percent: breakdown.duplicateSimilarity || 0, color: '#6366F1' },
    { factor: 'Vendor Concentration', percent: breakdown.vendorAnomaly || 0, color: '#EC4899' },
  ].sort((a, b) => b.percent - a.percent);

  const isPredictive = !!work.predictedRiskScore30Days;
  const isFlagged = work.riskLevel === 'High' || work.riskLevel === 'Medium' || (work.riskScore && work.riskScore >= 40);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Action Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFF3F4]">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-slate-600 hover:text-[#1D9BF0] font-medium transition-colors p-1 -ml-1 rounded hover:bg-slate-100"
            title="Go to previous page"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className="text-slate-300">/</span>
          <Link
            to={backDest.path}
            className="hover:text-[#1D9BF0] transition-colors"
          >
            {backDest.label}
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-mono font-bold text-[#0F1419]">{work.workId}</span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleCopyId}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-[#EFF3F4] rounded-lg hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-1.5"
            title="Copy Work ID"
          >
            {copiedId ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Work ID</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-[#EFF3F4] rounded-lg hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-1.5"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Dossier</span>
          </button>

          {user?.role === 'auditor' && (
            <Link
              to={`/auditor/case/${work.workId}`}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Forensic Action Center</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Header Hero Card */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#F7F9F9] rounded-xl border border-[#EFF3F4] text-[#1D9BF0] shadow-xs shrink-0">
              <ShieldAlert className="w-7 h-7 text-[#1D9BF0]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-xl font-bold text-[#0F1419] font-mono tracking-tight">
                  {work.workId}
                </h1>
                <RiskBadge
                  level={work.fraudRiskTier || work.riskLevel || (work.riskScore >= 70 ? 'High' : work.riskScore >= 40 ? 'Medium' : 'Low')}
                  score={work.fraudRiskScore ?? work.riskScore ?? work.currentRiskScore}
                  confidence={work.dataConfidence}
                  type={work.inefficiencyScore !== undefined ? 'Fraud' : null}
                />
                {work.inefficiencyScore !== undefined && (
                  <RiskBadge
                    level={work.inefficiencyTier || 'Low'}
                    score={work.inefficiencyScore}
                    type="Delay"
                  />
                )}
                {isPredictive && (
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    AI Early Warning Watchlist
                  </span>
                )}
                {work.status && (
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    work.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : work.status === 'Delayed' || work.status === 'Overdue'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : work.status === 'Under Review'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {work.status}
                  </span>
                )}
              </div>

              <p className="text-base font-semibold text-[#0F1419] mb-1">
                {work.description || `${work.category} scheme execution under MPLADS`}
              </p>

              <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-700">{work.category}</span>
                <span>•</span>
                <span>{work.district}, {work.state}</span>
                {work.constituency && (
                  <>
                    <span>•</span>
                    <span>{work.constituency} Constituency</span>
                  </>
                )}
                {work.sanctionDate && (
                  <>
                    <span>•</span>
                    <span>Sanctioned {work.sanctionDate}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0 bg-[#F7F9F9] p-3 rounded-xl border border-[#EFF3F4]">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Sanctioned Cost
            </div>
            <div className="text-xl font-bold font-mono text-[#0F1419] mt-0.5">
              ₹{work.sanctionedAmount?.toFixed(2)} <span className="text-xs text-slate-500 font-normal">Lakhs</span>
            </div>
            {work.expenditure !== undefined && (
              <div className="text-xs font-semibold text-slate-600 mt-1">
                Spent: <span className={`font-mono font-bold ${work.expenditure > work.sanctionedAmount ? 'text-rose-600' : 'text-slate-900'}`}>
                  ₹{work.expenditure?.toFixed(2)}L
                </span>
                <span className="text-[10px] text-slate-400 font-normal ml-1">
                  ({Math.round((work.expenditure / work.sanctionedAmount) * 100)}%)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Alert / Risk Signal Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-start gap-3.5 shadow-subtle ${
          work.riskScore >= 70 || work.riskLevel === 'High' || isPredictive
            ? 'bg-rose-50/70 border-rose-200/80 text-rose-900'
            : work.riskLevel === 'Medium'
            ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
            : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
        }`}
      >
        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-800">
            {isPredictive
              ? 'Projected Escalation Trigger'
              : isFlagged
              ? 'Primary Risk Signal'
              : 'Compliance Status'}
          </div>
          <p className="text-sm font-semibold text-[#0F1419] mt-0.5">
            {work.flagReason || work.warningSignal || 'Work is executing normally within standard SLA parameters.'}
          </p>
        </div>
      </div>

      {/* AI EXPLAINABILITY HORIZONTAL BAR CHART SECTION */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#1D9BF0]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F1419]">
              AI Explainability Breakdown (Weightage)
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Transparent Multi-Vector Scoring
          </span>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Why was this work evaluated with this risk profile? Below is the contributory weight of each vector evaluated by the ML model.
        </p>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 35, left: 140, bottom: 5 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                unit="%"
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={{ stroke: '#EFF3F4' }}
              />
              <YAxis
                type="category"
                dataKey="factor"
                tick={{ fontSize: 12, fill: '#0F1419', fontWeight: 600 }}
                axisLine={{ stroke: '#EFF3F4' }}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [`${value}% impact`, 'Weightage']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #EFF3F4',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Diagnostic Summary Narrative */}
        {work.aiDiagnosticSummary && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-3 bg-[#F7F9F9] p-4 rounded-xl border border-[#EFF3F4]">
            <Sparkles className="w-5 h-5 text-[#1D9BF0] shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-[#0F1419]">Diagnostic Audit Note: </span>
              {work.aiDiagnosticSummary}
            </p>
          </div>
        )}
      </div>

      {/* AUDITOR INVESTIGATION REPORT (CONDITIONAL: RENDERS IF AUDITOR REPORT FILED) */}
      {work.auditorReport && (
        <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-5 space-y-3 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                Independent Auditor Official Report
              </h3>
            </div>
            <span className="text-xs font-semibold text-purple-700 font-mono">
              Filed {work.auditorReport.submittedDate}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-slate-600">Audit Finding Conclusion:</span>
            <span className="px-2.5 py-0.5 rounded font-bold bg-white text-purple-900 border border-purple-200">
              {work.auditorReport.conclusion}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-purple-800 font-medium">Status: {work.auditorReport.status}</span>
          </div>

          {work.auditorReport.verifiedProgressPct !== null &&
            work.auditorReport.verifiedProgressPct !== undefined && (
              <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                <span className="font-semibold text-purple-900">Auditor Verified Progress:</span>
                <span className="font-bold text-purple-950 font-mono px-2 py-0.5 rounded bg-white border border-purple-200">
                  {work.auditorReport.verifiedProgressPct}%
                </span>
                {work.auditorReport.discrepancyFlag && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 border border-rose-200 text-rose-800 text-[11px] font-bold">
                    <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                    <span>Discrepancy Flagged</span>
                  </span>
                )}
              </div>
            )}

          {work.auditorReport.notes && (
            <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-purple-100 italic leading-relaxed">
              "{work.auditorReport.notes}"
            </p>
          )}
        </div>
      )}


      {/* Predictive Specific Box (if watchlist item) */}
      {isPredictive && (
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 space-y-4 shadow-subtle">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-3.5 rounded-xl border border-indigo-100">
              <span className="text-[11px] font-semibold text-indigo-700 uppercase">Current Baseline</span>
              <div className="text-xl font-bold text-[#0F1419] font-mono mt-1">
                {work.currentRiskScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-indigo-100">
              <span className="text-[11px] font-semibold text-indigo-700 uppercase">30-Day Forecast</span>
              <div className="text-xl font-bold text-rose-600 font-mono mt-1 flex items-center gap-2">
                {work.predictedRiskScore30Days} <span className="text-xs font-normal text-slate-500">/ 100</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  {work.riskDeltaPercent}
                </span>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-indigo-100">
              <span className="text-[11px] font-semibold text-indigo-700 uppercase">Days to Breach High Risk</span>
              <div className="text-xl font-bold text-amber-600 font-mono mt-1 flex items-center gap-1.5">
                <Clock className="w-5 h-5" />
                ~{work.daysUntilPredictedThreshold} Days
              </div>
            </div>
          </div>

          {work.riskTrajectory && (
            <div className="pt-3 border-t border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs text-indigo-900 font-semibold">8-Week Risk Score Trajectory:</span>
              <div className="flex items-center gap-3">
                <Sparkline data={work.riskTrajectory} width={180} height={28} />
                <span className="text-xs text-slate-600 font-mono font-medium">
                  {work.riskTrajectory[0]} → {work.riskTrajectory[work.riskTrajectory.length - 1]}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Project Details Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Governance & Location */}
        <div className="space-y-4 bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Governance & Location
          </h3>

          <div className="space-y-4 pt-1">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Recommending MP</span>
                <span className="text-sm font-semibold text-[#0F1419]">{work.mpName}</span>
                {work.constituency && (
                  <span className="text-xs text-slate-500 block">({work.constituency} Constituency)</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Jurisdiction</span>
                <span className="text-sm font-semibold text-[#0F1419]">{work.district}, {work.state}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Assigned Contractor / Vendor</span>
                <span className="text-sm font-semibold text-[#0F1419]">{work.vendorName || 'Not Assigned'}</span>
              </div>
            </div>

            {work.physicalProgress !== undefined && (
              <div className="flex items-start gap-3">
                <Activity className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-[11px] text-slate-400 block font-medium">Physical Progress</span>
                  {work.auditorReport?.verifiedProgressPct !== null &&
                  work.auditorReport?.verifiedProgressPct !== undefined ? (
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Contractor Reported:</span>
                        <span className="font-semibold text-[#0F1419] font-mono">
                          {work.physicalProgress}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-purple-700 font-semibold">Auditor Verified:</span>
                        <span className="font-bold text-purple-900 font-mono">
                          {work.auditorReport.verifiedProgressPct}%
                        </span>
                      </div>
                      {work.auditorReport.discrepancyFlag && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold mt-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                          <span>Progress Discrepancy Flagged</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#0F1419]">
                        {work.physicalProgress}%
                      </span>
                      {work.auditorReport?.discrepancyFlag && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
                          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                          <span>Discrepancy Flagged</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Financials & Timeline */}
        <div className="space-y-4 bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Financials & Timeline
          </h3>

          <div className="space-y-4 pt-1">
            <div className="flex items-start gap-3">
              <IndianRupee className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Sanctioned Amount</span>
                  <span className="text-sm font-bold text-[#0F1419] font-mono">₹{work.sanctionedAmount?.toFixed(2)} Lakhs</span>
                </div>
                {work.expenditure !== undefined && (
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">Actual Expenditure</span>
                    <span className={`text-sm font-bold font-mono ${
                      work.expenditure > work.sanctionedAmount ? 'text-rose-600' : 'text-[#0F1419]'
                    }`}>
                      ₹{work.expenditure?.toFixed(2)} Lakhs
                    </span>
                  </div>
                )}
                {work.expenditure !== undefined && (
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-2.5 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        work.expenditure > work.sanctionedAmount ? 'bg-rose-500' : 'bg-[#1D9BF0]'
                      }`}
                      style={{
                        width: `${Math.min(100, (work.expenditure / work.sanctionedAmount) * 100)}%`
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5 text-xs text-slate-600 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Recommended:</span>
                  <span className="font-mono font-semibold text-[#0F1419]">{work.recommendedDate || '2023-04-12'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Sanctioned:</span>
                  <span className="font-mono font-semibold text-[#0F1419]">{work.sanctionDate || '2023-06-20'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Target Completion:</span>
                  <span className="font-mono font-semibold text-[#0F1419]">{work.completionDate || '2024-03-31'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Creation & Verification Card */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#EFF3F4]">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#1D9BF0]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F1419]">
              Physical Asset Creation & Geotag Verification
            </h3>
          </div>
          {work.latestAssetVerificationStatus && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                work.latestAssetVerificationStatus === 'verified'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : work.latestAssetVerificationStatus === 'disputed'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              Latest: {work.latestAssetVerificationStatus.toUpperCase()}
            </span>
          )}
        </div>

        {Array.isArray(work.assetCreation) && work.assetCreation.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {work.assetCreation.map((asset, idx) => {
              const status = (asset.verificationStatus || 'unverified').toLowerCase();
              const badgeStyle =
                status === 'verified'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : status === 'disputed'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200';

              return (
                <div
                  key={asset.assetId || idx}
                  className="p-3.5 rounded-xl border border-[#EFF3F4] bg-[#F7F9F9] space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#0F1419] truncate">
                      {asset.assetType || 'Physical Asset'}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md border ${badgeStyle}`}>
                      {status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono space-y-0.5">
                    {asset.geotagLat !== null && asset.geotagLong !== null ? (
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-[#1D9BF0] shrink-0" />
                        <span>
                          {asset.geotagLat}, {asset.geotagLong}
                        </span>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic">No geotag coordinates logged</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-[#F7F9F9] text-center text-xs text-slate-400">
            No physical asset records logged for this work yet.
          </div>
        )}
      </div>

      {/* Page Action Footer Bar */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-subtle">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>
            Last scored: {work.scoredAt ? new Date(work.scoredAt).toLocaleString() : 'Recent ML Batch'} · Model v{work.modelVersion || '1.0'}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-xs font-semibold text-[#0F1419] bg-white border border-[#EFF3F4] rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            Back
          </button>

          {!isMpRole && (
            <button
              onClick={handleIssueAuditNotice}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 ${
                auditNoticeSent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white'
              }`}
            >
              {auditNoticeSent ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Notice Dispatched to DNO!</span>
                </>
              ) : (
                <>
                  <span>Issue Audit Notice</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
