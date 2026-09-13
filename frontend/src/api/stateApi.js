import { apiFetch } from './apiClient';

/**
 * State Nodal Authority Data Layer (src/api/stateApi.js)
 * Connects directly to backend State Nodal Authority REST endpoints.
 */

let lastValidStateOverview = null;
const districtSummaryCache = new Map();

export const stateApi = {
  // Get State Profile Context
  async getStateProfile(stateId) {
    if (lastValidStateOverview?.state) {
      return lastValidStateOverview.state;
    }
    try {
      const overview = await this.getStateOverview(stateId);
      return overview?.state || null;
    } catch {
      return lastValidStateOverview?.state || null;
    }
  },

  // Get State Overview rollup
  async getStateOverview(stateId) {
    try {
      const remote = await apiFetch('/api/state/overview');
      if (remote && remote.state && remote.kpis && Array.isArray(remote.districts)) {
        lastValidStateOverview = remote;
        return remote;
      }
      throw new Error('Invalid state overview response from server');
    } catch (err) {
      if (lastValidStateOverview) {
        return lastValidStateOverview;
      }
      throw err;
    }
  },

  // Get District Summary Details (including top 3 highest-risk projects)
  async getDistrictSummary(districtName) {
    try {
      const remote = await apiFetch(`/api/state/districts/${encodeURIComponent(districtName)}/summary`);
      if (remote && remote.district) {
        const result = {
          ...remote,
          topProjects: remote.topRiskProjects || remote.topProjects || [],
        };
        districtSummaryCache.set(districtName.toLowerCase(), result);
        return result;
      }
      throw new Error('Invalid district summary response from server');
    } catch (err) {
      if (districtSummaryCache.has(districtName.toLowerCase())) {
        return districtSummaryCache.get(districtName.toLowerCase());
      }
      throw err;
    }
  }
};
