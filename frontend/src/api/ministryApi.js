import { mpladsService } from './mpladsService';
import { apiFetch } from './apiClient';

/**
 * Ministry API Layer (src/api/ministryApi.js)
 * Centralized data access for Ministry (National View) dashboards.
 * Interfaces directly with live backend API endpoints.
 */

/**
 * Aggregates MP-level metrics and supports full listing, filtering, sorting,
 * and top/bottom leaderboard rankings strictly by Fund Utilization %.
 * 
 * Handles zero/invalid denominators:
 * - Zero sanctionedAmount => fundUtilization: null ('N/A').
 * - Zero recommended works => completionRate: null ('N/A').
 */
// In-memory cache for MP Leaderboard
let cachedMpLeaderboard = null;

export async function getMpLeaderboard(filters = {}) {
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

export const getTrendsMonthly = mpladsService.getTrendsMonthly;
export const getTrendsCategories = mpladsService.getTrendsCategories;
export const getTrendsVendors = mpladsService.getTrendsVendors;
export const getTrendsStates = mpladsService.getTrendsStates;
export const getTrendsLocations = mpladsService.getTrendsLocations;
export const getTrendsAnalytics = mpladsService.getTrendsAnalytics;
export const getPredictiveWatchlist = mpladsService.getPredictiveWatchlist;

export const ministryApi = {
  ...mpladsService,
  getMpLeaderboard,
  getTrendsMonthly,
  getTrendsCategories,
  getTrendsVendors,
  getTrendsStates,
  getTrendsLocations,
  getTrendsAnalytics,
  getPredictiveWatchlist,
};

export default ministryApi;


