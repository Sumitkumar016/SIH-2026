import { apiFetch } from './apiClient';

/**
 * Auditor / Investigator Data Layer (src/api/auditorApi.js)
 * Interacts directly with database-backed Auditor REST endpoints.
 */

// In-memory cache for auditor endpoints
let cachedCaseQueue = null;
const cachedCaseDetails = new Map();
const cachedVendorProfiles = new Map();

export const auditorApi = {
  // Get High-Risk Case Queue (Excludes Low Risk entirely)
  async getCaseQueue(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
      if (filters.caseStatus) params.append('caseStatus', filters.caseStatus);
      if (filters.source) params.append('source', filters.source);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const queryStr = params.toString();
      const endpoint = `/api/auditor/queue${queryStr ? `?${queryStr}` : ''}`;
      const remote = await apiFetch(endpoint);
      if (remote && Array.isArray(remote.data)) {
        return {
          total: remote.pagination?.total ?? remote.total ?? remote.data.length,
          data: remote.data,
          pagination: remote.pagination,
        };
      }
      throw new Error('Invalid case queue response from server');
    } catch (err) {
      if (cachedCaseQueue) return cachedCaseQueue;
      throw err;
    }
  },

  // Get Case Details by Work ID
  async getCaseById(workId) {
    if (!workId) return null;
    const cleanId = decodeURIComponent(workId).trim();
    try {
      const remote = await apiFetch(`/api/auditor/case/${encodeURIComponent(cleanId)}`);
      if (remote && remote.workId) {
        cachedCaseDetails.set(cleanId.toLowerCase(), remote);
        return remote;
      }
      throw new Error(`Case ${cleanId} not found on server`);
    } catch (err) {
      if (cachedCaseDetails.has(cleanId.toLowerCase())) {
        return cachedCaseDetails.get(cleanId.toLowerCase());
      }
      throw err;
    }
  },

  // Vendor Cross-Reference Tool: Inspect vendor across entire national dataset
  async getVendorProfile(vendorName) {
    const cleanName = (vendorName || '').trim();
    const endpoint = cleanName
      ? `/api/auditor/vendor?name=${encodeURIComponent(cleanName)}`
      : `/api/auditor/vendor`;
    try {
      const remote = await apiFetch(endpoint);
      if (remote && remote.vendorName) {
        if (cleanName) {
          cachedVendorProfiles.set(cleanName.toLowerCase(), remote);
        }
        return remote;
      }
      throw new Error(`Vendor ${cleanName || 'records'} not found on server`);
    } catch (err) {
      if (cleanName && cachedVendorProfiles.has(cleanName.toLowerCase())) {
        return cachedVendorProfiles.get(cleanName.toLowerCase());
      }
      throw err;
    }
  },

  // Submit Auditor Report
  async submitAuditorReport(workId, reportData) {
    const res = await apiFetch(`/api/auditor/case/${encodeURIComponent(workId)}/report`, {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
    return { success: true, workId, report: res };
  },

  // Submit Asset Verification
  async submitAssetVerification(workId, assetData) {
    const res = await apiFetch(`/api/auditor/case/${encodeURIComponent(workId)}/asset`, {
      method: 'POST',
      body: JSON.stringify(assetData),
    });
    return { success: true, workId, asset: res };
  },

  // Case Action Trigger (Request Inspection, Request Evidence, etc.)
  async updateCaseAction(workId, actionType, note = '') {
    const res = await apiFetch(`/api/auditor/case/${encodeURIComponent(workId)}/action`, {
      method: 'POST',
      body: JSON.stringify({ actionType, note }),
    });
    return res;
  },
};
