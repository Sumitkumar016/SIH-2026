import { apiFetch } from './apiClient';

/**
 * MP Data Layer (src/api/mpApi.js)
 * Connects directly to backend Member of Parliament REST endpoints.
 */

let lastValidMpOverview = null;

export const mpApi = {
  // Get MP profile / identity
  async getMpProfile(mpId) {
    if (lastValidMpOverview?.mp) {
      return lastValidMpOverview.mp;
    }
    try {
      const overview = await this.getMyConstituencyOverview();
      return overview?.mp || null;
    } catch {
      return lastValidMpOverview?.mp || null;
    }
  },

  // Get My Constituency Overview (KPIs, utilization, and only this MP's flagged works)
  async getMyConstituencyOverview() {
    try {
      const remote = await apiFetch('/api/mp/overview');
      if (remote && remote.mp && remote.kpis && Array.isArray(remote.flaggedWorks)) {
        lastValidMpOverview = remote;
        return remote;
      }
      throw new Error('Invalid MP overview data received from server');
    } catch (err) {
      if (lastValidMpOverview) {
        return lastValidMpOverview;
      }
      throw err;
    }
  },

  // Get full list of works for this MP with search & filters
  async getMyWorks(filters = {}) {
    if (typeof filters === 'string') {
      filters = arguments[1] || {};
    }

    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.sortField) params.append('sortField', filters.sortField);
    if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);

    const qs = params.toString();
    const endpoint = qs ? `/api/mp/works?${qs}` : '/api/mp/works';
    const remote = await apiFetch(endpoint);
    if (remote && Array.isArray(remote.data)) {
      return remote;
    }
    throw new Error('Invalid works data received from server');
  },
};

