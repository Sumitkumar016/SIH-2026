import { apiFetch } from './apiClient';

/**
 * Service layer for MPLADS AI Platform
 * Decouples components from direct data sources.
 * Can be effortlessly swapped with real Axios / fetch REST endpoints later.
 */

// In-flight request deduplication & caches
let lastValidKpis = null;
let lastValidRisk = null;
let lastValidStates = null;
let lastValidUrgent = null;
let lastValidAlerts = null;
let cachedTrends = null;
let cachedWatchlist = null;
const cachedWorksById = new Map();
let cachedMpLeaderboard = null;

export const mpladsService = {
  // Fetch National Overview KPIs
  async getOverviewKpis() {
    try {
      const remote = await apiFetch('/api/ministry/overview/kpis');
      if (remote && typeof remote.totalWorksRecommended === 'number') {
        lastValidKpis = remote;
        return remote;
      }
      throw new Error('Invalid KPI data received from server');
    } catch (err) {
      if (lastValidKpis) return lastValidKpis;
      throw err;
    }
  },

  // Fetch National Overview Risk Distribution
  async getOverviewRisk() {
    try {
      const remote = await apiFetch('/api/ministry/overview/risk');
      if (remote && remote.riskDistribution) {
        lastValidRisk = remote;
        return remote;
      }
      throw new Error('Invalid risk distribution data received from server');
    } catch (err) {
      if (lastValidRisk) return lastValidRisk;
      throw err;
    }
  },

  // Fetch National Overview State Distribution
  async getOverviewStates() {
    try {
      const remote = await apiFetch('/api/ministry/overview/states');
      if (remote && Array.isArray(remote.statesData)) {
        lastValidStates = remote;
        return remote;
      }
      throw new Error('Invalid states data received from server');
    } catch (err) {
      if (lastValidStates) return lastValidStates;
      throw err;
    }
  },

  // Fetch National Overview Top Urgent States
  async getOverviewUrgent() {
    try {
      const remote = await apiFetch('/api/ministry/overview/urgent');
      if (remote && Array.isArray(remote.topAttentionStates)) {
        lastValidUrgent = remote;
        return remote;
      }
      throw new Error('Invalid urgent states data received from server');
    } catch (err) {
      if (lastValidUrgent) return lastValidUrgent;
      throw err;
    }
  },

  // Fetch National Overview Recent Alerts
  async getOverviewAlerts() {
    try {
      const remote = await apiFetch('/api/ministry/overview/alerts');
      if (remote && Array.isArray(remote.recentAlerts)) {
        lastValidAlerts = remote;
        return remote;
      }
      throw new Error('Invalid alerts data received from server');
    } catch (err) {
      if (lastValidAlerts) return lastValidAlerts;
      throw err;
    }
  },

  // Fetch All Flagged Works with filtering & pagination (Live-Only, no caching)
  async getFlaggedWorks(filters = {}, options = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.state) params.append('state', filters.state);
      if (filters.category) params.append('category', filters.category);
      if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
      if (filters.status) params.append('status', filters.status);
      if (filters.financialYear) params.append('financialYear', filters.financialYear);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sortField) params.append('sortField', filters.sortField);
      if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);

      const qs = params.toString();
      const endpoint = qs ? `/api/ministry/flagged?${qs}` : '/api/ministry/flagged';
      const remote = await apiFetch(endpoint, options);
      if (remote && Array.isArray(remote.data)) {
        return {
          total: remote.pagination?.total ?? remote.total ?? remote.data.length,
          data: remote.data,
          availableStates: remote.availableStates || [],
          availableCategories: remote.availableCategories || [],
          pagination: remote.pagination,
        };
      }
      throw new Error('Invalid flagged works response from server');
    } catch (err) {
      throw err;
    }
  },

  // Trends 1: Monthly Trends
  async getTrendsMonthly(filters = {}) {
    const params = new URLSearchParams();
    if (filters.state && filters.state !== 'ALL') params.append('state', filters.state);
    if (filters.district && filters.district !== 'ALL') params.append('district', filters.district);
    const qs = params.toString();
    const endpoint = qs ? `/api/ministry/trends/monthly?${qs}` : '/api/ministry/trends/monthly';
    const remote = await apiFetch(endpoint);
    if (remote && Array.isArray(remote.monthlyTrends)) {
      return remote.monthlyTrends;
    }
    throw new Error('Invalid monthly trends response from server');
  },

  // Trends 2: Category Anomalies
  async getTrendsCategories(filters = {}) {
    const params = new URLSearchParams();
    if (filters.state && filters.state !== 'ALL') params.append('state', filters.state);
    if (filters.district && filters.district !== 'ALL') params.append('district', filters.district);
    const qs = params.toString();
    const endpoint = qs ? `/api/ministry/trends/categories?${qs}` : '/api/ministry/trends/categories';
    const remote = await apiFetch(endpoint);
    if (remote && Array.isArray(remote.categoryAnomalies)) {
      return remote.categoryAnomalies;
    }
    throw new Error('Invalid category anomalies response from server');
  },

  // Trends 3: Vendor Concentration & Risk
  async getTrendsVendors(filters = {}) {
    const params = new URLSearchParams();
    if (filters.state && filters.state !== 'ALL') params.append('state', filters.state);
    if (filters.district && filters.district !== 'ALL') params.append('district', filters.district);
    const qs = params.toString();
    const endpoint = qs ? `/api/ministry/trends/vendors?${qs}` : '/api/ministry/trends/vendors';
    const remote = await apiFetch(endpoint);
    if (remote && Array.isArray(remote.topVendors)) {
      return remote.topVendors;
    }
    throw new Error('Invalid top vendors response from server');
  },

  // Trends 4: State Performance vs Risk
  async getTrendsStates(filters = {}) {
    const params = new URLSearchParams();
    if (filters.state && filters.state !== 'ALL') params.append('state', filters.state);
    if (filters.district && filters.district !== 'ALL') params.append('district', filters.district);
    const qs = params.toString();
    const endpoint = qs ? `/api/ministry/trends/states?${qs}` : '/api/ministry/trends/states';
    const remote = await apiFetch(endpoint);
    if (remote && Array.isArray(remote.stateComparison)) {
      return remote.stateComparison;
    }
    throw new Error('Invalid state comparison response from server');
  },

  // Trends Locations: States & Districts list
  async getTrendsLocations() {
    const remote = await apiFetch('/api/ministry/trends/locations');
    if (remote && Array.isArray(remote.states)) {
      return remote.states;
    }
    throw new Error('Invalid locations response from server');
  },

  // Fetch Trends and Analytics (Backwards-compatible consolidated)
  async getTrendsAnalytics(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.state && filters.state !== 'ALL') params.append('state', filters.state);
      if (filters.district && filters.district !== 'ALL') params.append('district', filters.district);
      const qs = params.toString();
      const endpoint = qs ? `/api/ministry/trends?${qs}` : '/api/ministry/trends';
      const remote = await apiFetch(endpoint);
      if (remote && Array.isArray(remote.monthlyTrends)) {
        cachedTrends = remote;
        return remote;
      }
      throw new Error('Invalid trends data response from server');
    } catch (err) {
      if (cachedTrends) return cachedTrends;
      throw err;
    }
  },

  // Fetch Predictive Risk Watchlist
  async getPredictiveWatchlist(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.state) params.append('state', filters.state);
      if (filters.category) params.append('category', filters.category);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const qs = params.toString();
      const endpoint = qs ? `/api/ministry/predictions?${qs}` : '/api/ministry/predictions';
      const remote = await apiFetch(endpoint);
      if (remote && Array.isArray(remote.data)) {
        return {
          total: remote.pagination?.total ?? remote.total ?? remote.data.length,
          data: remote.data,
          pagination: remote.pagination,
        };
      }
      throw new Error('Invalid predictions response from server');
    } catch (err) {
      if (cachedWatchlist) return cachedWatchlist;
      throw err;
    }
  },

  // Get specific work by ID (searches backend first)
  async getWorkById(workId) {
    if (!workId) return null;
    const cleanId = decodeURIComponent(workId).trim();
    try {
      const remote = await apiFetch(`/api/works/${encodeURIComponent(cleanId)}`);
      if (remote && remote.workId) {
        cachedWorksById.set(cleanId.toLowerCase(), remote);
        return remote;
      }
      throw new Error(`Work ${cleanId} not found on server`);
    } catch (err) {
      if (cachedWorksById.has(cleanId.toLowerCase())) {
        return cachedWorksById.get(cleanId.toLowerCase());
      }
      throw err;
    }
  },

  // Issue Audit Notice (Ministry / District / State / Auditor)
  async issueAuditNotice(workId) {
    const res = await apiFetch(`/api/works/${encodeURIComponent(workId)}/audit-notice`, {
      method: 'POST',
    });
    return res;
  },

  // Fetch MP Performance Leaderboard (Ranked strictly by Fund Utilization %)
  async getMpLeaderboard(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.state) params.append('state', filters.state);
      if (filters.district) params.append('district', filters.district);
      if (filters.utilizationRange) params.append('utilizationRange', filters.utilizationRange);
      if (filters.completionRange) params.append('completionRange', filters.completionRange);
      if (filters.sortField) params.append('sortField', filters.sortField);
      if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const qs = params.toString();
      const endpoint = qs ? `/api/ministry/mp-performance?${qs}` : '/api/ministry/mp-performance';
      const remote = await apiFetch(endpoint);
      if (remote && Array.isArray(remote.data)) {
        return {
          data: remote.data,
          total: remote.pagination?.total ?? remote.total ?? remote.data.length,
          pagination: remote.pagination,
          availableStates: remote.availableStates || [],
          availableDistricts: remote.availableDistricts || [],
          top5: remote.top5 || [],
          bottom5: remote.bottom5 || [],
        };
      }
      throw new Error('Invalid MP performance response from server');
    } catch (err) {
      if (cachedMpLeaderboard) return cachedMpLeaderboard;
      throw err;
    }
  }
};
