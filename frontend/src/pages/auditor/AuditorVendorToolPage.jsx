import React, { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import {
  Fingerprint,
  Search,
  Building2,
  AlertTriangle,
  IndianRupee,
  MapPin,
  User,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import RiskBadge from '../../components/common/RiskBadge';
import SearchBox from '../../components/common/SearchBox';
import { auditorApi } from '../../api/auditorApi';

/**
 * PAGE 3: Vendor Cross-Reference Tool (KEY DIFFERENTIATOR FEATURE)
 * Route: /auditor/vendor
 * Purpose: Uncovers nationwide multi-state contractor collusion, repeat identical payments,
 * and contract anomaly signatures.
 */
export default function AuditorVendorToolPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialVendor = searchParams.get('vendor') || 'M/s Apex Infra Projects';

  const [searchTerm, setSearchTerm] = useState(initialVendor);
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);

  const sampleVendors = [
    'M/s Apex Infra Projects',
    'Ganga Civil Solutions',
    'Eastern Buildtech Ltd',
    'Vanguard Constructions Pvt Ltd',
    'Southern Tech Labs',
  ];

  const fetchVendorData = async (name) => {
    setLoading(true);
    const data = await auditorApi.getVendorProfile(name);
    setVendorData(data);
    setLoading(false);
  };

  useEffect(() => {
    const q = searchParams.get('vendor') || 'M/s Apex Infra Projects';
    setSearchTerm(q);
    fetchVendorData(q);
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;
    setSearchParams({ vendor: searchTerm });
    fetchVendorData(searchTerm);
  };

  const handleSelectSampleVendor = (vendor) => {
    setSearchTerm(vendor);
    setSearchParams({ vendor });
    fetchVendorData(vendor);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* KEY DIFFERENTIATOR FEATURE HEADER */}
      <div className="bg-gradient-to-r from-purple-50/90 via-sky-50/50 to-indigo-50/70 border border-purple-200/80 rounded-2xl p-5 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-white rounded-xl border border-purple-200 text-purple-700 shadow-xs mt-0.5">
              <Fingerprint className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-700 text-white font-mono">
                  Forensic Differentiator
                </span>
                <span className="text-xs text-purple-800 font-semibold">
                  Multi-State Collusion Scanner
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0F1419] tracking-tight mt-1">
                Vendor Cross-Reference & Cartel Forensics
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
                Cross-references contractor awards across <span className="font-bold text-[#0F1419]">all 28 states and MPs</span> to detect contract-splitting, repeat round figures, and cartel concentration.
              </p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs border border-purple-100 rounded-xl p-3 text-xs font-mono self-start md:self-auto">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Audited Scope</span>
            <span className="text-sm font-extrabold text-[#0F1419]">Nationwide Repository</span>
          </div>
        </div>
      </div>

      {/* VENDOR SEARCH BOX & QUICK SHORTCUTS */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vendor by exact or partial name (e.g. M/s Apex Infra Projects, Ganga Civil Solutions)..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#F7F9F9] text-xs sm:text-sm text-[#0F1419] placeholder-slate-400 border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:bg-white transition-all font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#1D9BF0] hover:bg-[#1A8CD8] rounded-xl transition-colors shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <span>Scan Vendor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-semibold text-[11px]">Quick Forensics Presets:</span>
          {sampleVendors.map((v) => (
            <button
              key={v}
              onClick={() => handleSelectSampleVendor(v)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                searchTerm.toLowerCase() === v.toLowerCase()
                  ? 'bg-purple-100 text-purple-900 border-purple-300 font-bold'
                  : 'bg-[#F7F9F9] text-slate-700 border-[#EFF3F4] hover:bg-slate-100'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {loading || !vendorData ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D9BF0]" />
        </div>
      ) : (
        <div className="space-y-6">

          {/* PATTERN ALERT BANNER (IF DETECTED) */}
          {vendorData.patternAlerts && vendorData.patternAlerts.length > 0 && (
            <div className="bg-rose-50 border border-rose-200/90 rounded-2xl p-4.5 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                  AI Forensic Pattern Detection Alerts ({vendorData.patternAlerts.length} Red Flags)
                </h3>
              </div>
              <div className="space-y-1.5 pl-7">
                {vendorData.patternAlerts.map((alertText, idx) => (
                  <p key={idx} className="text-xs font-semibold text-rose-900 leading-relaxed">
                    {alertText}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* VENDOR PROFILE SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Card 1: Total Works */}
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Works Awarded</span>
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 border border-[#EFF3F4]">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
                {vendorData.totalWorks}
              </div>
              <div className="mt-2 text-[11px] text-rose-600 font-bold">
                {vendorData.highRiskCount} High-Risk Flagged
              </div>
            </div>

            {/* Card 2: Total Payment Amount */}
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Payment Volume</span>
                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
                ₹{vendorData.totalPaymentCr.toFixed(2)} <span className="text-sm font-normal text-slate-500">Cr</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Across all ministries & MPs
              </div>
            </div>

            {/* Card 3: Distinct MPs Worked With */}
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Distinct MPs</span>
                <div className="p-1.5 bg-sky-50 rounded-lg text-[#1D9BF0] border border-sky-100">
                  <User className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
                {vendorData.distinctMpsCount} <span className="text-sm font-normal text-slate-500">MPs</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 truncate" title={vendorData.distinctMps.join(', ')}>
                {vendorData.distinctMps.slice(0, 2).join(', ')}...
              </div>
            </div>

            {/* Card 4: Distinct Districts & States */}
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Districts & States</span>
                <div className="p-1.5 bg-purple-50 rounded-lg text-purple-700 border border-purple-100">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
                {vendorData.distinctDistrictsCount} <span className="text-sm font-normal text-slate-500">({vendorData.distinctStatesCount} States)</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                {vendorData.distinctStates.join(', ')}
              </div>
            </div>

            {/* Card 5: Average Payment Amount */}
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Avg Payment Size</span>
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 border border-[#EFF3F4]">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
                ₹{vendorData.avgPaymentLakhs.toFixed(1)} <span className="text-sm font-normal text-slate-500">L</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Per work average
              </div>
            </div>

          </div>

          {/* NATIONWIDE WORKS LIST FOR THIS VENDOR */}
          <div className="bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden">
            <div className="p-4 bg-[#F7F9F9] border-b border-[#EFF3F4] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#0F1419] flex items-center gap-2">
                  <span>Nationwide Contract Register for</span>
                  <span className="text-purple-700 font-mono underline">{vendorData.vendorName}</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  Rows highlighted in red contain detected collusion signatures (repeating round-figure amounts)
                </span>
              </div>
              <span className="text-xs font-mono font-bold bg-white border border-[#EFF3F4] px-2.5 py-1 rounded-lg">
                {vendorData.works.length} Contracts Cross-Referenced
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F7F9F9]/50 border-b border-[#EFF3F4] text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-3 px-4">Work ID</th>
                    <th className="py-3 px-4">Recommending MP</th>
                    <th className="py-3 px-4">State & District</th>
                    <th className="py-3 px-4 text-right">Sanctioned Amount</th>
                    <th className="py-3 px-3 text-center">Risk Level</th>
                    <th className="py-3 px-4 min-w-[200px]">Detected Pattern Flag</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EFF3F4] text-xs">
                  {vendorData.works.map((w) => {
                    return (
                      <tr
                        key={w.workId}
                        onClick={() => onOpenWorkDetail(w)}
                        className={`cursor-pointer transition-colors group ${
                          w.isRedFlagged ? 'bg-rose-50/30 hover:bg-rose-50/60' : 'hover:bg-[#F7F9F9]'
                        }`}
                      >
                        {/* Work ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                          <div className="flex items-center gap-1.5">
                            <span>{w.workId}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1D9BF0]" />
                          </div>
                        </td>

                        {/* MP Name */}
                        <td className="py-3.5 px-4 font-medium text-[#0F1419]">
                          <div>{w.mpName}</div>
                          <div className="text-[10px] text-slate-400">{w.category}</div>
                        </td>

                        {/* State & District */}
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          <div>{w.state}</div>
                          <div className="text-[10px] text-slate-400">{w.district}</div>
                        </td>

                        {/* Sanctioned Amount */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-[#0F1419]">
                          <span className={w.flags?.some(f => f.includes('Identical')) ? 'px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-200' : ''}>
                            ₹{w.sanctionedAmount?.toFixed(2)}L
                          </span>
                        </td>

                        {/* Risk Level */}
                        <td className="py-3.5 px-3 text-center">
                          <RiskBadge level={w.riskLevel} score={w.riskScore} size="sm" />
                        </td>

                        {/* Red Flag Tag */}
                        <td className="py-3.5 px-4">
                          {w.flags && w.flags.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {w.flags.map((f, i) => (
                                <span key={i} className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                                  {f}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-medium">
                              Standard execution
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-3 bg-[#F7F9F9] border-t border-[#EFF3F4] flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-700" />
                <span>
                  Click any contract row to inspect full work details and audit evidence.
                </span>
              </div>
              <span className="font-mono text-[11px] font-semibold text-slate-700">
                Vendor Audit Hash: #VN-8820-APEX
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
