import { apiFetch } from './apiClient';

/**
 * District Authority Data Layer (src/api/districtApi.js)
 * Connects directly to backend District Authority REST endpoints.
 */

let lastValidDistrictOverview = null;
let lastValidVerificationQueue = null;

export const districtApi = {
  // Get District Profile Context
  async getDistrictProfile(districtId) {
    if (lastValidDistrictOverview?.district) {
      return lastValidDistrictOverview.district;
    }
    try {
      const overview = await this.getDistrictOverview(districtId);
      return overview?.district || null;
    } catch {
      return lastValidDistrictOverview?.district || null;
    }
  },

  // Get District Overview (KPIs, MP-wise breakdown table)
  async getDistrictOverview(districtId) {
    try {
      const remote = await apiFetch('/api/district/overview');
      if (remote && remote.district && remote.kpis && Array.isArray(remote.mpBreakdown)) {
        lastValidDistrictOverview = remote;
        return remote;
      }
      throw new Error('Invalid district overview received from server');
    } catch (err) {
      if (lastValidDistrictOverview) {
        return lastValidDistrictOverview;
      }
      throw err;
    }
  },

  // Get Verification Queue: ONLY completed works where photo evidence is missing
  async getVerificationQueue(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const qs = params.toString();
      const endpoint = qs ? `/api/district/verification?${qs}` : '/api/district/verification';
      const remote = await apiFetch(endpoint);
      if (remote && Array.isArray(remote.data)) {
        const result = {
          district: lastValidDistrictOverview?.district || null,
          total: remote.pagination?.total ?? remote.total ?? remote.data.length,
          data: remote.data,
          pagination: remote.pagination,
        };
        lastValidVerificationQueue = result;
        return result;
      }
      throw new Error('Invalid verification queue received from server');
    } catch (err) {
      if (lastValidVerificationQueue) {
        return lastValidVerificationQueue;
      }
      throw err;
    }
  },

  // Action 1: Mark as Verified (evidence confirmed, removes from queue)
  async markWorkVerified(workId) {
    const res = await apiFetch(`/api/district/verification/${encodeURIComponent(workId)}/verify`, {
      method: 'POST',
    });
    return res;
  },

  // Action 2: Request Evidence (sends notice/reminder)
  async requestEvidence(workId, note = 'Formal notice sent to implementing agency') {
    const res = await apiFetch(`/api/district/verification/${encodeURIComponent(workId)}/request-evidence`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
    return res;
  },

  // Action 3: Escalate to Investigation (sends work to Auditor dashboard)
  async escalateWorkToInvestigation(workId, note = 'Evidence not provided after multiple statutory reminder periods') {
    const res = await apiFetch(`/api/district/verification/${encodeURIComponent(workId)}/escalate`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
    return res;
  },
};
