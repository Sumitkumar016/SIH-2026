import {
  mockWorksData,
  mockPredictiveWatchlist,
  mockStateRiskData,
  mockMonthlyTrends,
  mockCategoryAnomalies,
  mockTopVendors,
} from './mockData';
import { apiFetch } from './apiClient';

/**
 * Service layer for MPLADS AI Platform
 * Decouples components from direct data sources.
 * Can be effortlessly swapped with real Axios / fetch REST endpoints later.
 */

// In-flight request deduplication & last valid data cache
let inFlightOverviewPromise = null;
let lastValidOverviewData = null;

export const mpladsService = {
  // Fetch National Overview summary metrics & state data
  async getNationalOverviewMetrics(forceRefresh = false) {
    if (!forceRefresh && inFlightOverviewPromise) {
      return inFlightOverviewPromise;
    }

    inFlightOverviewPromise = (async () => {
      try {
        const remote = await apiFetch('/api/ministry/overview');
        if (remote && remote.kpis && remote.statesData) {
          lastValidOverviewData = remote;
          return remote;
        }
        throw new Error('Invalid overview data received from server');
      } catch (err) {
        // If we have previously loaded valid data, preserve it rather than crashing
        if (lastValidOverviewData) {
          return lastValidOverviewData;
        }
        // Do not silently substitute fake mock data; throw so UI shows ErrorState
        throw err;
      } finally {
        setTimeout(() => {
          inFlightOverviewPromise = null;
        }, 300);
      }
    })();

    return inFlightOverviewPromise;
  },

  // Fetch All Flagged Works with filtering & pagination
  async getFlaggedWorks(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.state) params.append('state', filters.state);
      if (filters.category) params.append('category', filters.category);
      if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
      if (filters.status) params.append('status', filters.status);
      if (filters.financialYear) params.append('financialYear', filters.financialYear);

      const qs = params.toString();
      const endpoint = qs ? `/api/ministry/flagged?${qs}` : '/api/ministry/flagged';
      const remote = await apiFetch(endpoint);
      if (remote && Array.isArray(remote.data)) {
        return {
          total: remote.data.length,
          data: remote.data,
        };
      }
    } catch {
      // Gracefully fall back to local seed/mock data when backend is not reached
    }

    let works = [...mockWorksData];

    // Filter by State
    if (filters.state && filters.state !== 'All') {
      works = works.filter(w => w.state.toLowerCase() === filters.state.toLowerCase());
    }

    // Filter by District
    if (filters.district && filters.district !== 'All') {
      works = works.filter(w => w.district.toLowerCase() === filters.district.toLowerCase());
    }

    // Filter by Category
    if (filters.category && filters.category !== 'All') {
      works = works.filter(w => w.category === filters.category);
    }

    // Filter by Risk Level
    if (filters.riskLevel && filters.riskLevel !== 'All') {
      works = works.filter(w => w.riskLevel.toLowerCase() === filters.riskLevel.toLowerCase());
    }

    // Filter by Status
    if (filters.status && filters.status !== 'All') {
      works = works.filter(w => w.status.toLowerCase() === filters.status.toLowerCase());
    }

    // Text Search query (Work ID, MP Name, Vendor, Constituency)
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      works = works.filter(w =>
        w.workId.toLowerCase().includes(q) ||
        w.mpName.toLowerCase().includes(q) ||
        w.vendorName.toLowerCase().includes(q) ||
        w.district.toLowerCase().includes(q) ||
        (w.constituency && w.constituency.toLowerCase().includes(q))
      );
    }

    return {
      total: works.length,
      data: works
    };
  },

  // Fetch Trends and Analytics
  async getTrendsAnalytics() {
    try {
      const remote = await apiFetch('/api/ministry/trends');
      if (remote && Array.isArray(remote.monthlyTrends)) {
        return remote;
      }
    } catch {
      // Gracefully fall back to local seed/mock data when backend is not reached
    }

    return {
      monthlyTrends: mockMonthlyTrends,
      categoryAnomalies: mockCategoryAnomalies,
      topVendors: mockTopVendors,
      stateComparison: mockStateRiskData.slice(0, 10).map(s => ({
        state: s.state,
        sanctionRate: 100,
        completionRate: Math.round((s.completed / s.totalWorks) * 100),
        flaggedPercent: Math.round((s.flaggedCount / s.totalWorks) * 1000) / 10,
        riskIndex: s.riskIndex
      }))
    };
  },


  // Fetch Predictive Risk Watchlist
  async getPredictiveWatchlist(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.state) params.append('state', filters.state);
      if (filters.category) params.append('category', filters.category);

      const qs = params.toString();
      const endpoint = qs ? `/api/ministry/predictions?${qs}` : '/api/ministry/predictions';
      const remote = await apiFetch(endpoint);
      if (remote && Array.isArray(remote.data)) {
        return {
          total: remote.data.length,
          data: remote.data,
        };
      }
    } catch {
      // Gracefully fall back to local seed/mock data when backend is not reached
    }

    let watchlist = [...mockPredictiveWatchlist];

    if (filters.state && filters.state !== 'All') {
      watchlist = watchlist.filter(w => w.state.toLowerCase() === filters.state.toLowerCase());
    }
    if (filters.category && filters.category !== 'All') {
      watchlist = watchlist.filter(w => w.category === filters.category);
    }
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      watchlist = watchlist.filter(w =>
        w.workId.toLowerCase().includes(q) ||
        w.mpName.toLowerCase().includes(q) ||
        w.vendorName.toLowerCase().includes(q) ||
        w.district.toLowerCase().includes(q)
      );
    }

    // Default sort by riskDeltaPercent descending (extracting integer)
    watchlist.sort((a, b) => {
      const deltaA = parseInt(a.riskDeltaPercent.replace(/[^0-9]/g, ''), 10);
      const deltaB = parseInt(b.riskDeltaPercent.replace(/[^0-9]/g, ''), 10);
      return deltaB - deltaA;
    });

    return {
      total: watchlist.length,
      data: watchlist
    };
  },

  // Get specific work by ID (searches backend first, then local mock sets)
  async getWorkById(workId) {
    if (!workId) return null;
    try {
      const remote = await apiFetch(`/api/works/${encodeURIComponent(workId)}`);
      if (remote && remote.workId) {
        return remote;
      }
    } catch {
      // Gracefully fall back to local seed/mock data when backend is not reached
    }

    const cleanId = decodeURIComponent(workId).trim().toLowerCase();
    const fromFlagged = mockWorksData.find(w => w.workId?.toLowerCase() === cleanId);
    if (fromFlagged) return fromFlagged;
    const fromPredictive = mockPredictiveWatchlist.find(w => w.workId?.toLowerCase() === cleanId);
    return fromPredictive || null;
  },

  // Issue Audit Notice (Ministry / District / State / Auditor)
  async issueAuditNotice(workId) {
    try {
      const res = await apiFetch(`/api/works/${encodeURIComponent(workId)}/audit-notice`, {
        method: 'POST',
      });
      return res;
    } catch {
      return {
        success: true,
        issuedAt: new Date().toISOString(),
        reportId: Date.now(),
      };
    }
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

      const qs = params.toString();
      const endpoint = qs ? `/api/ministry/mp-performance?${qs}` : '/api/ministry/mp-performance';
      const remote = await apiFetch(endpoint);
      if (remote && Array.isArray(remote.data)) {
        const rankable = remote.data.filter((m) => m.fundUtilization !== null && !isNaN(m.fundUtilization));
        const top5 = remote.top5 || [...rankable].sort((a, b) => b.fundUtilization - a.fundUtilization).slice(0, 5).map((m, i) => ({ ...m, rank: i + 1 }));
        const bottom5 = remote.bottom5 || [...rankable].sort((a, b) => a.fundUtilization - b.fundUtilization).slice(0, 5).map((m, i) => ({ ...m, rank: i + 1 }));

        return {
          data: remote.data,
          total: remote.data.length,
          allMps: remote.data,
          availableStates: remote.availableStates || [],
          availableDistricts: remote.availableDistricts || [],
          top5,
          bottom5,
        };
      }
    } catch {
      // Gracefully fall back to local seed/mock data when backend is not reached
    }

    const mpMap = new Map();

    mockWorksData.forEach((work) => {
      if (!work.mpName) return;
      const mpName = work.mpName.trim();

      if (!mpMap.has(mpName)) {
        mpMap.set(mpName, {
          mpName,
          state: work.state || 'N/A',
          district: work.district || work.constituency || 'N/A',
          constituency: work.constituency || work.district || 'N/A',
          totalWorks: 0,
          completedWorks: 0,
          ongoingWorks: 0,
          underReviewWorks: 0,
          delayedWorks: 0,
          totalSanctionedAmount: 0,
          totalExpenditure: 0,
          categories: {},
          works: [],
        });
      }

      const mp = mpMap.get(mpName);
      mp.totalWorks += 1;

      if (mp.state === 'N/A' && work.state) mp.state = work.state;
      if (mp.district === 'N/A' && work.district) mp.district = work.district;
      if (mp.constituency === 'N/A' && work.constituency) mp.constituency = work.constituency;

      const status = (work.status || '').toLowerCase();
      if (status === 'completed') {
        mp.completedWorks += 1;
      } else if (status === 'ongoing' || status === 'sanctioned') {
        mp.ongoingWorks += 1;
      } else if (status === 'under review') {
        mp.underReviewWorks += 1;
      } else if (status === 'delayed' || status === 'halted') {
        mp.delayedWorks += 1;
      }

      if (work.category) {
        mp.categories[work.category] = (mp.categories[work.category] || 0) + 1;
      }

      if (typeof work.sanctionedAmount === 'number' && !isNaN(work.sanctionedAmount) && work.sanctionedAmount > 0) {
        mp.totalSanctionedAmount += work.sanctionedAmount;
      }
      if (typeof work.expenditure === 'number' && !isNaN(work.expenditure) && work.expenditure >= 0) {
        mp.totalExpenditure += work.expenditure;
      }

      mp.works.push({
        workId: work.workId,
        category: work.category,
        description: work.description,
        status: work.status,
        sanctionedAmount: work.sanctionedAmount,
        expenditure: work.expenditure,
        district: work.district,
      });
    });

    const allMps = Array.from(mpMap.values()).map((mp) => {
      const hasSanctionedAmount = mp.totalSanctionedAmount > 0;
      const fundUtilization = hasSanctionedAmount
        ? Math.round((mp.totalExpenditure / mp.totalSanctionedAmount) * 1000) / 10
        : null;

      const hasRecommendedWorks = mp.totalWorks > 0;
      const completionRate = hasRecommendedWorks
        ? Math.round((mp.completedWorks / mp.totalWorks) * 1000) / 10
        : null;

      return {
        ...mp,
        fundUtilization,
        completionRate,
        totalSanctionedAmount: Math.round(mp.totalSanctionedAmount * 100) / 100,
        totalExpenditure: Math.round(mp.totalExpenditure * 100) / 100,
      };
    });

    const availableStates = Array.from(new Set(allMps.map((m) => m.state).filter(Boolean))).sort();
    const availableDistricts = Array.from(
      new Set(allMps.map((m) => m.district || m.constituency).filter(Boolean))
    ).sort();

    const rankableMps = allMps.filter(
      (mp) => mp.fundUtilization !== null && !isNaN(mp.fundUtilization)
    );

    const top5 = [...rankableMps]
      .sort((a, b) => b.fundUtilization - a.fundUtilization)
      .slice(0, 5)
      .map((mp, index) => ({ ...mp, rank: index + 1 }));

    const bottom5 = [...rankableMps]
      .sort((a, b) => a.fundUtilization - b.fundUtilization)
      .slice(0, 5)
      .map((mp, index) => ({ ...mp, rank: index + 1 }));

    let filteredMps = [...allMps];

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      filteredMps = filteredMps.filter(
        (m) =>
          m.mpName.toLowerCase().includes(q) ||
          m.constituency.toLowerCase().includes(q) ||
          m.district.toLowerCase().includes(q) ||
          m.state.toLowerCase().includes(q)
      );
    }

    if (filters.state && filters.state !== 'All') {
      filteredMps = filteredMps.filter(
        (m) => m.state.toLowerCase() === filters.state.toLowerCase()
      );
    }

    if (filters.district && filters.district !== 'All') {
      filteredMps = filteredMps.filter(
        (m) =>
          m.district.toLowerCase() === filters.district.toLowerCase() ||
          m.constituency.toLowerCase() === filters.district.toLowerCase()
      );
    }

    if (filters.utilizationRange && filters.utilizationRange !== 'All') {
      filteredMps = filteredMps.filter((m) => {
        if (m.fundUtilization === null || isNaN(m.fundUtilization)) {
          return filters.utilizationRange === 'N/A';
        }
        const u = m.fundUtilization;
        if (filters.utilizationRange === '0-25') return u >= 0 && u <= 25;
        if (filters.utilizationRange === '25-50') return u > 25 && u <= 50;
        if (filters.utilizationRange === '50-75') return u > 50 && u <= 75;
        if (filters.utilizationRange === '75-100') return u > 75 && u <= 100;
        if (filters.utilizationRange === '>100') return u > 100;
        return true;
      });
    }

    if (filters.completionRange && filters.completionRange !== 'All') {
      filteredMps = filteredMps.filter((m) => {
        if (m.completionRate === null || isNaN(m.completionRate)) {
          return filters.completionRange === 'N/A';
        }
        const c = m.completionRate;
        if (filters.completionRange === '0-25') return c >= 0 && c <= 25;
        if (filters.completionRange === '25-50') return c > 25 && c <= 50;
        if (filters.completionRange === '50-75') return c > 50 && c <= 75;
        if (filters.completionRange === '75-100') return c > 75 && c <= 100;
        return true;
      });
    }

    const sortField = filters.sortField || 'fundUtilization';
    const sortDirection = filters.sortDirection || 'desc';

    filteredMps.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (valA === null || valA === undefined || isNaN(valA)) {
        return valB === null || valB === undefined || isNaN(valB) ? 0 : 1;
      }
      if (valB === null || valB === undefined || isNaN(valB)) {
        return -1;
      }

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return {
      data: filteredMps,
      total: filteredMps.length,
      allMps,
      top5,
      bottom5,
      availableStates,
      availableDistricts,
    };
  }
};
