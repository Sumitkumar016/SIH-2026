import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  Calendar,
  Building2,
  User,
  MapPin,
  Sparkles,
  ExternalLink,
  Send,
  CheckCircle2,
  Clock,
  Fingerprint,
  Camera,
  Layers,
  FileText,
  Activity,
  Check,
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
import RiskBadge from '../../components/common/RiskBadge';
import { auditorApi } from '../../api/auditorApi';

/**
 * PAGE 2: Case Investigation Detail (Auditor Role)
 * Route: /auditor/case/:workId
 * Rich AI Investigation & Action Center
 */
export default function AuditorCaseDetailPage() {
  const { workId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Investigation Form State
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [status, setStatus] = useState('Under Review');
  const [verifiedProgressPct, setVerifiedProgressPct] = useState('');
  const [discrepancyFlag, setDiscrepancyFlag] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSubmittedSuccess, setReportSubmittedSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Asset Verification Form State
  const [assetType, setAssetType] = useState('');
  const [assetVerificationStatus, setAssetVerificationStatus] = useState('verified');
  const [geotagLat, setGeotagLat] = useState('');
  const [geotagLong, setGeotagLong] = useState('');
  const [isSubmittingAsset, setIsSubmittingAsset] = useState(false);
  const [assetSubmittedSuccess, setAssetSubmittedSuccess] = useState(false);

  const loadCase = async () => {
    setLoading(true);
    const res = await auditorApi.getCaseById(workId);
    if (res) {
      setCaseData(res);
      if (res.auditorReport) {
        setInvestigationNotes(res.auditorReport.notes || '');
        setConclusion(res.auditorReport.conclusion || '');
        setStatus(res.auditorReport.status || 'Under Review');
        setVerifiedProgressPct(
          res.auditorReport.verifiedProgressPct !== null && res.auditorReport.verifiedProgressPct !== undefined
            ? String(res.auditorReport.verifiedProgressPct)
            : ''
        );
        setDiscrepancyFlag(Boolean(res.auditorReport.discrepancyFlag));
        setReportSubmittedSuccess(true);
      }
      if (res.assetCreation && res.assetCreation.length > 0) {
        const latestAsset = res.assetCreation[0];
        setAssetType(latestAsset.assetType || '');
        setAssetVerificationStatus(latestAsset.verificationStatus || 'verified');
        setGeotagLat(
          latestAsset.geotagLat !== null && latestAsset.geotagLat !== undefined
            ? String(latestAsset.geotagLat)
            : ''
        );
        setGeotagLong(
          latestAsset.geotagLong !== null && latestAsset.geotagLong !== undefined
            ? String(latestAsset.geotagLong)
            : ''
        );
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCase();
  }, [workId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAction = async (actionType) => {
    await auditorApi.updateCaseAction(workId, actionType);
    showToast(`Audit Action executed: ${actionType}`);
    await loadCase();
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!conclusion) {
      showToast('Please select a conclusion before submitting.');
      return;
    }
    setIsSubmittingReport(true);
    const payload = {
      conclusion,
      notes: investigationNotes,
      status,
    };
    if (verifiedProgressPct !== '' && !isNaN(Number(verifiedProgressPct))) {
      payload.verifiedProgressPct = Number(verifiedProgressPct);
    }
    if (discrepancyFlag !== undefined) {
      payload.discrepancyFlag = Boolean(discrepancyFlag);
    }
    await auditorApi.submitAuditorReport(workId, payload);
    setIsSubmittingReport(false);
    setReportSubmittedSuccess(true);
    showToast('Official Audit Report filed — visible to Ministry & State dashboards.');
  };

  const handleSubmitAsset = async (e) => {
    e.preventDefault();
    if (!assetVerificationStatus) {
      showToast('Please select a verification status.');
      return;
    }
    setIsSubmittingAsset(true);
    const payload = {
      verificationStatus: assetVerificationStatus,
    };
    if (assetType.trim()) {
      payload.assetType = assetType.trim();
    }
    if (geotagLat !== '' && !isNaN(Number(geotagLat))) {
      payload.geotagLat = Number(geotagLat);
    }
    if (geotagLong !== '' && !isNaN(Number(geotagLong))) {
      payload.geotagLong = Number(geotagLong);
    }

    const res = await auditorApi.submitAssetVerification(workId, payload);
    setIsSubmittingAsset(false);
    if (res?.success) {
      setAssetSubmittedSuccess(true);
      showToast('Physical asset verification status updated successfully.');
      await loadCase();
    } else {
      showToast('Failed to submit asset verification.');
    }
  };

  if (loading || !caseData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D9BF0]" />
      </div>
    );
  }

  // Explainability chart data
  const breakdown = caseData.riskFactorBreakdown || {
    costOverrun: 35,
    delaySlippage: 30,
    duplicateSimilarity: 20,
    vendorAnomaly: 15,
  };

  const chartData = [
    { factor: 'Financial Inflation', percent: breakdown.costOverrun || 0, color: '#EF4444' },
    { factor: 'Progress Mismatch', percent: breakdown.delaySlippage || 0, color: '#F59E0B' },
    { factor: 'Duplicate/GIS Match', percent: breakdown.duplicateSimilarity || 0, color: '#6366F1' },
    { factor: 'Vendor Concentration', percent: breakdown.vendorAnomaly || 0, color: '#EC4899' },
  ].sort((a, b) => b.percent - a.percent);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Back Nav & Quick Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/auditor/queue')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0F1419] bg-white border border-[#EFF3F4] px-3 py-1.5 rounded-xl shadow-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Case Queue</span>
        </button>

        {caseData.vendorName && (
          <Link
            to={`/auditor/vendor?vendor=${encodeURIComponent(caseData.vendorName)}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <Fingerprint className="w-4 h-4 text-purple-600" />
            <span>Cross-Reference Vendor ({caseData.vendorName})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* INVESTIGATION CASE HEADER CARD */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-rose-600 shadow-xs shrink-0">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base font-bold text-[#0F1419]">
                {caseData.workId}
              </span>
              <RiskBadge level={caseData.riskLevel} score={caseData.riskScore} />
              <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md ${
                caseData.escalationSource === 'district'
                  ? 'bg-purple-50 text-purple-800 border border-purple-200'
                  : 'bg-sky-50 text-sky-800 border border-sky-200'
              }`}>
                {caseData.escalationSource === 'district' ? '📍 District Escalated' : '🤖 AI Flagged'}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-[#0F1419] mt-1">
              {caseData.description || caseData.flagReason}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
              <span>{caseData.category}</span>
              <span>•</span>
              <span>{caseData.district}, {caseData.state}</span>
              <span>•</span>
              <span>Recommending MP: <strong className="text-[#0F1419]">{caseData.mpName}</strong></span>
            </div>
          </div>
        </div>

        {/* Large Prominent Risk Score */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center shrink-0 self-start md:self-auto min-w-[130px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
            AI Risk Score
          </span>
          <div className="text-3xl font-black text-rose-600 font-mono mt-0.5">
            {caseData.riskScore}<span className="text-sm font-normal text-slate-500">/100</span>
          </div>
          <span className="text-[10px] font-bold text-rose-700 block mt-0.5">
            Critical Review Required
          </span>
        </div>
      </div>

      {/* DISTRICT ESCALATION CALLOUT (IF ESCALATED BY DISTRICT) */}
      {caseData.escalationSource === 'district' && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-900">
              Escalated by District Authority ({caseData.district} Collectorate)
            </div>
            <p className="text-xs text-purple-900 font-semibold mt-0.5">
              "{caseData.escalationNote || 'Contractor failed to provide completion photo evidence despite multiple statutory reminder notices.'}"
            </p>
            <span className="text-[10px] text-purple-700 font-mono mt-1 block">
              Escalated on: {caseData.escalatedDate || '2024-07-15'}
            </span>
          </div>
        </div>
      )}

      {/* SECTION 1: WHY FLAGGED? + EXPECTED VS ACTUAL COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (6 cols): Horizontal Bar Chart */}
        <div className="lg:col-span-6 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EFF3F4]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#1D9BF0]" />
              Why Flagged? Contributory ML Vectors
            </h3>
            <span className="text-[11px] text-slate-500">Risk Weightage</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#EFF3F4' }} />
                <YAxis type="category" dataKey="factor" tick={{ fontSize: 11, fill: '#0F1419', fontWeight: 500 }} axisLine={{ stroke: '#EFF3F4' }} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`${value}% impact`, 'Weightage']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #EFF3F4', fontSize: '12px' }}
                />
                <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={16}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-[#F7F9F9] border border-[#EFF3F4] text-xs text-slate-700 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#1D9BF0] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#0F1419]">Diagnostic Audit Rationale:</strong> {caseData.aiDiagnosticSummary || caseData.flagReason}
            </p>
          </div>
        </div>

        {/* Right (6 cols): Expected vs Actual Progress & Financial Comparison */}
        <div className="lg:col-span-6 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EFF3F4]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Expected vs Actual Disparity Forensics
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Discrepancy: {Math.abs((caseData.expectedProgress || 100) - (caseData.physicalProgress || 54))}%</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#EFF3F4]">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Expected Progress</span>
              <div className="text-2xl font-extrabold text-[#0F1419] font-mono mt-0.5">
                {caseData.expectedProgress || 100}%
              </div>
              <span className="text-[10px] text-slate-400">Based on elapsed SLA milestone</span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">Audited Physical Progress</span>
              <div className="text-2xl font-extrabold text-rose-600 font-mono mt-0.5">
                {caseData.physicalProgress || 54}%
              </div>
              <span className="text-[10px] text-rose-700 font-semibold">Ground milestone stall</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#EFF3F4]">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Sanctioned Amount</span>
              <div className="text-xl font-bold text-[#0F1419] font-mono mt-0.5">
                ₹{caseData.sanctionedAmount?.toFixed(2)}L
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#EFF3F4]">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Actual Expenditure Drawn</span>
              <div className={`text-xl font-bold font-mono mt-0.5 ${
                caseData.expenditure > caseData.sanctionedAmount ? 'text-rose-600' : 'text-[#0F1419]'
              }`}>
                ₹{caseData.expenditure?.toFixed(2)}L
              </div>
            </div>
          </div>

          {/* AI Recommendation banner */}
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1D9BF0] shrink-0" />
              <span><strong>AI Action Recommendation:</strong> Field verification and forensic vendor audit recommended.</span>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 2: WORK LIFECYCLE HORIZONTAL TIMELINE STEPPER */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          Full Work Lifecycle Statutory Timeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
          <div className="p-3 rounded-xl bg-[#F7F9F9] border border-[#EFF3F4]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#1D9BF0]">1. Recommended</div>
            <div className="text-xs font-bold text-[#0F1419] font-mono mt-1">{caseData.recommendedDate || '2023-04-12'}</div>
            <div className="text-[11px] text-slate-500">By MP {caseData.mpName}</div>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F9F9] border border-[#EFF3F4]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#1D9BF0]">2. Sanctioned</div>
            <div className="text-xs font-bold text-[#0F1419] font-mono mt-1">{caseData.sanctionDate || '2023-06-20'}</div>
            <div className="text-[11px] text-slate-500">By District Collectorate</div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-800">3. Target Completion</div>
            <div className="text-xs font-bold text-rose-700 font-mono mt-1">{caseData.completionDate || '2024-02-15'}</div>
            <div className="text-[11px] text-rose-600 font-semibold">{caseData.status}</div>
          </div>
        </div>
      </div>

      {/* SECTION 3: SITE LOCATION & PHOTO EVIDENCE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Static Map Visual Area */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#1D9BF0]" />
              Geospatial Site Location
            </h3>
            <span className="text-[11px] font-mono text-slate-500">GPS: 25.5941° N, 85.1376° E</span>
          </div>

          {/* Map Placeholder */}
          <div className="w-full h-48 bg-slate-100 rounded-xl border border-[#EFF3F4] flex flex-col items-center justify-center text-slate-400 p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-sky-50/40 to-slate-200/60" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white border border-rose-300 flex items-center justify-center text-rose-600 shadow-card animate-bounce">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#0F1419] mt-2">
                {caseData.district}, {caseData.state}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                Constituency: {caseData.constituency || caseData.district}
              </span>
            </div>
          </div>
        </div>

        {/* Photo Evidence Comparison */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" />
              Geotagged Photo Evidence Audit
            </h3>
            <span className="text-[11px] font-semibold text-rose-600">
              {caseData.photoEvidenceStatus === 'missing' ? '⚠️ Missing Ground Evidence' : '✓ Verified'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 h-48">
            <div className="border border-[#EFF3F4] rounded-xl bg-[#F7F9F9] p-3 flex flex-col items-center justify-center text-center">
              <Camera className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-bold text-slate-700">Before Work (Inception)</span>
              <span className="text-[10px] text-slate-400 mt-1 font-mono">Geotagged 12-Apr-2023</span>
            </div>

            <div className="border border-rose-200 rounded-xl bg-rose-50/40 p-3 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="w-6 h-6 text-rose-500 mb-1" />
              <span className="text-xs font-bold text-rose-800">Latest Photo Status</span>
              <span className="text-[10px] text-rose-600 mt-1 font-semibold">Missing Post-Completion Upload</span>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 4: INVESTIGATION FORM & ACTIONS */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFF3F4]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg text-purple-800">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F1419]">
                Investigation Findings & Official Audit Filing
              </h2>
              <span className="text-[11px] text-slate-500">
                Document conclusions and submit the official auditor report for central MoSPI & state authorities
              </span>
            </div>
          </div>

          {reportSubmittedSuccess && (
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Report Filed
            </span>
          )}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-xs font-semibold text-slate-500 mr-2">Audit Action Triggers:</span>
          <button
            type="button"
            onClick={() => handleAction('Request Physical Inspection')}
            className="px-3 py-1.5 text-xs font-semibold text-[#0F1419] bg-[#F7F9F9] border border-[#EFF3F4] hover:bg-slate-100 rounded-xl transition-colors shadow-xs"
          >
            Request Inspection
          </button>
          <button
            type="button"
            onClick={() => handleAction('Request Supplementary Evidence')}
            className="px-3 py-1.5 text-xs font-semibold text-[#0F1419] bg-[#F7F9F9] border border-[#EFF3F4] hover:bg-slate-100 rounded-xl transition-colors shadow-xs"
          >
            Request Evidence
          </button>
          <button
            type="button"
            onClick={() => handleAction('Mark Under Review')}
            className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-xl transition-colors shadow-xs"
          >
            Mark Under Review
          </button>
          <button
            type="button"
            onClick={() => handleAction('Resolve Case')}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-xl transition-colors shadow-xs"
          >
            Resolve Case
          </button>
        </div>

        {/* Official Report Form */}
        <form onSubmit={handleSubmitReport} className="space-y-4 pt-2 border-t border-[#EFF3F4]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Investigation Conclusion:
              </label>
              <select
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                required
                className="w-full text-xs p-2.5 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] font-medium"
              >
                <option value="" disabled>Select a conclusion...</option>
                <option value="Confirmed Anomaly">Confirmed — Irregularity Verified</option>
                <option value="Requires Field Action">Requires Field Action (Remedial Notice)</option>
                <option value="False Positive">False Positive — No Irregularity Found</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Case Resolution Status:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] font-medium"
              >
                <option value="Under Review">Under Review</option>
                <option value="Escalated">Escalated to Ministry Directorate</option>
                <option value="Resolved">Resolved / Closed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Verified Progress % (Optional):
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={verifiedProgressPct}
                onChange={(e) => setVerifiedProgressPct(e.target.value)}
                placeholder="e.g. 65 (leave empty if not evaluated)"
                className="w-full text-xs p-2.5 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] font-medium placeholder-slate-400"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="relative flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={discrepancyFlag}
                  onChange={(e) => setDiscrepancyFlag(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                />
                <span className="text-xs font-bold text-rose-700">
                  Discrepancy Flag (Reported progress does not match ground verification)
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Detailed Investigation Notes & Audit Findings:
            </label>
            <textarea
              rows={3}
              value={investigationNotes}
              onChange={(e) => setInvestigationNotes(e.target.value)}
              placeholder="Document physical site findings, invoice mismatches, contractor explanations, or recommended recovery action..."
              className="w-full text-xs p-3 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] placeholder-slate-400"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              Submitted report is permanently appended to this work record across all roles.
            </span>
            <button
              type="submit"
              disabled={isSubmittingReport || !investigationNotes.trim()}
              className="px-5 py-2 text-xs font-bold text-white bg-[#1D9BF0] hover:bg-[#1A8CD8] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmittingReport ? 'Submitting Report...' : 'Submit Official Audit Report'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 5: PHYSICAL ASSET VERIFICATION */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFF3F4]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-100 rounded-lg text-sky-800">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F1419]">
                Physical Asset Ground Verification
              </h2>
              <span className="text-[11px] text-slate-500">
                Record on-site asset creation status, asset classification, and geotag telemetry
              </span>
            </div>
          </div>

          {assetSubmittedSuccess && (
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Asset Recorded
            </span>
          )}
        </div>

        <form onSubmit={handleSubmitAsset} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Asset Type:
              </label>
              <input
                type="text"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                placeholder="e.g. Community Hall, Solar Light"
                className="w-full text-xs p-2.5 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] font-medium placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Verification Status:
              </label>
              <select
                value={assetVerificationStatus}
                onChange={(e) => setAssetVerificationStatus(e.target.value)}
                required
                className="w-full text-xs p-2.5 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] font-medium"
              >
                <option value="verified">Verified (Ground Confirmed)</option>
                <option value="unverified">Unverified (Pending Check)</option>
                <option value="disputed">Disputed (Anomaly Detected)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Geotag Latitude:
              </label>
              <input
                type="number"
                step="any"
                value={geotagLat}
                onChange={(e) => setGeotagLat(e.target.value)}
                placeholder="e.g. 25.5941"
                className="w-full text-xs p-2.5 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] font-medium placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Geotag Longitude:
              </label>
              <input
                type="number"
                step="any"
                value={geotagLong}
                onChange={(e) => setGeotagLong(e.target.value)}
                placeholder="e.g. 85.1376"
                className="w-full text-xs p-2.5 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] font-medium placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              Updates the central asset registry and verification queue for this project.
            </span>
            <button
              type="submit"
              disabled={isSubmittingAsset}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0F1419] hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmittingAsset ? 'Saving Verification...' : 'Record Asset Verification'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
