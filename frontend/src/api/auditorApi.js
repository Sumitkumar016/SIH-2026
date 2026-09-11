import { mockWorksData } from './mockData';
import { apiFetch } from './apiClient';

/**
 * Auditor / Investigator Data Layer (src/api/auditorApi.js)
 * Reads from and writes directly to shared mockWorksData in-place.
 */

export const auditorApi = {
  // Get High-Risk Case Queue (Excludes Low Risk entirely)
  async getCaseQueue(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
      if (filters.caseStatus) params.append('caseStatus', filters.caseStatus);
      if (filters.source) params.append('source', filters.source);

      const queryStr = params.toString();
      const endpoint = `/api/auditor/queue${queryStr ? `?${queryStr}` : ''}`;
      const remote = await apiFetch(endpoint);
      if (remote && Array.isArray(remote.data)) {
        return {
          total: remote.data.length,
          data: remote.data,
        };
      }
    } catch {
      // Gracefully fall back to local seed/mock data when backend is unreachable
    }

    // Only Medium and High risk cases
    let cases = mockWorksData.filter(
      (w) => w.riskLevel === 'High' || w.riskLevel === 'Medium' || (w.riskScore && w.riskScore >= 40)
    ).map(w => ({
      ...w,
      caseStatus: w.caseStatus || (w.auditorReport ? 'Resolved' : w.escalationSource === 'district' ? 'Escalated' : 'New'),
      escalationSource: w.escalationSource || 'ai',
    }));

    // Filter by Risk Level
    if (filters.riskLevel && filters.riskLevel !== 'All') {
      cases = cases.filter(c => c.riskLevel.toLowerCase() === filters.riskLevel.toLowerCase());
    }

    // Filter by Case Status
    if (filters.caseStatus && filters.caseStatus !== 'All') {
      cases = cases.filter(c => c.caseStatus.toLowerCase() === filters.caseStatus.toLowerCase());
    }

    // Filter by Source (AI vs District)
    if (filters.source && filters.source !== 'All') {
      cases = cases.filter(c => c.escalationSource.toLowerCase() === filters.source.toLowerCase());
    }

    // Search query
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      cases = cases.filter(
        c =>
          c.workId.toLowerCase().includes(q) ||
          c.mpName.toLowerCase().includes(q) ||
          (c.vendorName && c.vendorName.toLowerCase().includes(q)) ||
          c.district.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q) ||
          (c.flagReason && c.flagReason.toLowerCase().includes(q))
      );
    }

    // Sort by risk score descending by default
    cases.sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));

    return {
      total: cases.length,
      data: cases,
    };
  },

  // Get Case Details by Work ID
  async getCaseById(workId) {
    try {
      const remote = await apiFetch(`/api/auditor/case/${encodeURIComponent(workId)}`);
      if (remote && remote.workId) {
        return remote;
      }
    } catch {
      // Gracefully fall back to local seed/mock data when backend is unreachable
    }

    const target = mockWorksData.find(w => w.workId.toLowerCase() === workId.toLowerCase());
    if (!target) return null;

    return {
      ...target,
      caseStatus: target.caseStatus || (target.auditorReport ? 'Resolved' : target.escalationSource === 'district' ? 'Escalated' : 'New'),
      escalationSource: target.escalationSource || 'ai',
      expectedProgress: target.expectedProgress || (target.status === 'Completed' ? 100 : 90),
      physicalProgress: target.physicalProgress || 54,
    };
  },

  // Vendor Cross-Reference Tool: Inspect vendor across entire national dataset
  async getVendorProfile(vendorName) {
    if (!vendorName || !vendorName.trim()) {
      vendorName = "Rajasthan Project Engineering"; // Default sample vendor in database
    }

    try {
      const remote = await apiFetch(`/api/auditor/vendor?name=${encodeURIComponent(vendorName)}`);
      if (remote && remote.vendorName) {
        return remote;
      }
    } catch {
      // Gracefully fall back to local seed/mock data when backend is unreachable
    }

    const cleanName = vendorName.trim().toLowerCase();
    const vendorWorks = mockWorksData.filter(
      w => w.vendorName && w.vendorName.toLowerCase().includes(cleanName)
    );

    const totalWorks = vendorWorks.length;
    const totalAmountLakhs = vendorWorks.reduce((acc, w) => acc + (w.sanctionedAmount || 0), 0);
    const totalPaymentCr = Math.round((totalAmountLakhs / 100) * 100) / 100;
    const avgPaymentLakhs = totalWorks > 0 ? Math.round((totalAmountLakhs / totalWorks) * 10) / 10 : 0;

    const distinctMps = Array.from(new Set(vendorWorks.map(w => w.mpName)));
    const distinctDistricts = Array.from(new Set(vendorWorks.map(w => `${w.district}, ${w.state}`)));
    const distinctStates = Array.from(new Set(vendorWorks.map(w => w.state)));
    const highRiskCount = vendorWorks.filter(w => w.riskLevel === 'High' || (w.riskScore && w.riskScore >= 70)).length;

    // Pattern Detection: Repeating round-figure amounts (e.g. 2+ works with exact same amount)
    const amountCounts = {};
    vendorWorks.forEach(w => {
      const amt = w.sanctionedAmount?.toFixed(2);
      if (amt) {
        amountCounts[amt] = (amountCounts[amt] || 0) + 1;
      }
    });
    const repeatedAmounts = Object.keys(amountCounts).filter(amt => amountCounts[amt] > 1);

    // Enriched works with red flag markers
    const enrichedWorks = vendorWorks.map(w => {
      const amtStr = w.sanctionedAmount?.toFixed(2);
      const isRepeatedAmount = repeatedAmounts.includes(amtStr);

      return {
        ...w,
        isRedFlagged: isRepeatedAmount || w.riskScore >= 70,
        flags: [
          ...(isRepeatedAmount ? [`Identical ₹${amtStr}L Contract`] : []),
        ],
      };
    });

    // Pattern Alert generation
    let patternAlerts = [];
    if (repeatedAmounts.length > 0) {
      const maxRepeat = Math.max(...repeatedAmounts.map(a => amountCounts[a]));
      patternAlerts.push(
        `⚠️ Round-Figure Anomaly: ${maxRepeat} works awarded with identical ₹${repeatedAmounts[0]} Lakh amounts across ${distinctStates.length} states.`
      );
    }
    if (distinctStates.length >= 3 && highRiskCount >= 2) {
      patternAlerts.push(
        `⚠️ Multi-State Concentration: Vendor operates across ${distinctStates.join(', ')} with a high ${Math.round((highRiskCount / totalWorks) * 100)}% anomaly risk concentration.`
      );
    }

    return {
      vendorName: vendorWorks.length > 0 ? vendorWorks[0].vendorName : vendorName,
      totalWorks,
      totalPaymentCr,
      avgPaymentLakhs,
      distinctMpsCount: distinctMps.length,
      distinctMps,
      distinctDistrictsCount: distinctDistricts.length,
      distinctDistricts,
      distinctStatesCount: distinctStates.length,
      distinctStates,
      highRiskCount,
      patternAlerts,
      works: enrichedWorks,
    };
  },

  // Submit Auditor Report
  async submitAuditorReport(workId, reportData) {
    try {
      const res = await apiFetch(`/api/auditor/case/${encodeURIComponent(workId)}/report`, {
        method: 'POST',
        body: JSON.stringify(reportData),
      });
      if (res) {
        const target = mockWorksData.find(w => w.workId.toLowerCase() === workId.toLowerCase());
        if (target) {
          target.auditorReport = res;
          target.caseStatus = res.status || reportData.status || 'Under Review';
        }
        return { success: true, workId, report: res };
      }
    } catch {
      // Graceful fallback to local mock data
    }

    const target = mockWorksData.find(w => w.workId.toLowerCase() === workId.toLowerCase());
    if (target) {
      target.auditorReport = {
        conclusion: reportData.conclusion || 'Confirmed Anomaly',
        notes: reportData.notes || '',
        submittedDate: new Date().toISOString().slice(0, 10),
        submittedBy: 'Independent Auditor',
        status: reportData.status || 'Under Review',
        verifiedProgressPct: reportData.verifiedProgressPct !== undefined ? reportData.verifiedProgressPct : null,
        discrepancyFlag: Boolean(reportData.discrepancyFlag),
      };
      target.caseStatus = reportData.status || 'Under Review';
    }
    return { success: true, workId, report: target?.auditorReport };
  },

  // Submit Asset Verification
  async submitAssetVerification(workId, assetData) {
    try {
      const res = await apiFetch(`/api/auditor/case/${encodeURIComponent(workId)}/asset`, {
        method: 'POST',
        body: JSON.stringify(assetData),
      });
      if (res) {
        const target = mockWorksData.find(w => w.workId.toLowerCase() === workId.toLowerCase());
        if (target) {
          target.assetCreation = [res];
          target.latestAssetVerificationStatus = res.verificationStatus;
        }
        return { success: true, workId, asset: res };
      }
    } catch {
      // Graceful fallback to local mock data
    }

    const target = mockWorksData.find(w => w.workId.toLowerCase() === workId.toLowerCase());
    if (target) {
      target.assetCreation = [assetData];
      target.latestAssetVerificationStatus = assetData.verificationStatus;
    }
    return { success: true, workId, asset: assetData };
  },

  // Case Action Trigger (Request Inspection, Request Evidence, etc.)
  async updateCaseAction(workId, actionType, note = '') {
    try {
      const res = await apiFetch(`/api/auditor/case/${encodeURIComponent(workId)}/action`, {
        method: 'POST',
        body: JSON.stringify({ actionType, note }),
      });
      if (res && res.success) {
        const target = mockWorksData.find(w => w.workId.toLowerCase() === workId.toLowerCase());
        if (target) {
          target.lastAuditorAction = {
            actionType,
            note,
            date: new Date().toISOString().slice(0, 10),
          };
          if (actionType === 'Resolve Case' || actionType === 'Resolve') target.caseStatus = 'Resolved';
          if (actionType === 'Mark Under Review') target.caseStatus = 'Under Review';
          if (actionType === 'Escalate') target.caseStatus = 'Escalated';
        }
        return res;
      }
    } catch {
      // Graceful fallback to local mock mutation
    }

    const target = mockWorksData.find(w => w.workId.toLowerCase() === workId.toLowerCase());
    if (target) {
      target.lastAuditorAction = {
        actionType,
        note,
        date: new Date().toISOString().slice(0, 10),
      };
      if (actionType === 'Resolve Case' || actionType === 'Resolve') target.caseStatus = 'Resolved';
      if (actionType === 'Mark Under Review') target.caseStatus = 'Under Review';
      if (actionType === 'Escalate') target.caseStatus = 'Escalated';
    }
    return { success: true, workId, actionType };
  },
};
