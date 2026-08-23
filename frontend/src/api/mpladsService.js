import {
  mockWorksData,
  mockPredictiveWatchlist,
  mockStateRiskData,
  mockMonthlyTrends,
  mockCategoryAnomalies,
  mockTopVendors,
} from './mockData';

/**
 * Service layer for MPLADS AI Platform
 * Decouples components from direct data sources.
 * Can be effortlessly swapped with real Axios / fetch REST endpoints later.
 */

export const mpladsService = {
  // Fetch National Overview summary metrics & state data
  async getNationalOverviewMetrics() {
    // Calculate India-wide totals from state aggregates
    const totalWorks = mockStateRiskData.reduce((acc, s) => acc + s.totalWorks, 0);
    const totalSanctionedCr = mockStateRiskData.reduce((acc, s) => acc + s.sanctionedCr, 0);
    const totalCompleted = mockStateRiskData.reduce((acc, s) => acc + s.completed, 0);
    const totalFlagged = mockStateRiskData.reduce((acc, s) => acc + s.flaggedCount, 0);
    const totalHighRisk = mockStateRiskData.reduce((acc, s) => acc + s.highRisk, 0);
    const totalMedRisk = mockStateRiskData.reduce((acc, s) => acc + s.medRisk, 0);
    const totalLowRisk = mockStateRiskData.reduce((acc, s) => acc + s.lowRisk, 0);
    const nationalExpenditureCr = Math.round(totalSanctionedCr * 0.842 * 10) / 10;

    return {
      kpis: {
        totalWorksRecommended: totalWorks + 1420,
        totalSanctionedWorks: totalWorks,
        totalCompletedWorks: totalCompleted,
        completionRate: Math.round((totalCompleted / totalWorks) * 1000) / 10,
        totalSanctionedCr: Math.round(totalSanctionedCr * 10) / 10,
        totalExpenditureCr: nationalExpenditureCr,
        expenditureRatio: Math.round((nationalExpenditureCr / totalSanctionedCr) * 1000) / 10,
        totalFlaggedCases: totalFlagged,
        flaggedRatePercent: Math.round((totalFlagged / totalWorks) * 1000) / 10,
        riskDistribution: {
          high: totalHighRisk,
          medium: totalMedRisk,
          low: totalLowRisk,
        }
      },
      statesData: mockStateRiskData,
      recentAlerts: mockWorksData.filter(w => w.riskLevel === 'High' || w.riskScore >= 70).slice(0, 8),
      topAttentionStates: [...mockStateRiskData].sort((a, b) => b.riskIndex - a.riskIndex).slice(0, 5)
    };
  },

  // Fetch All Flagged Works with filtering & pagination
  async getFlaggedWorks(filters = {}) {
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

  // Get specific work by ID (searches both flagged works and predictive watchlist)
  async getWorkById(workId) {
    const fromFlagged = mockWorksData.find(w => w.workId === workId);
    if (fromFlagged) return fromFlagged;
    const fromPredictive = mockPredictiveWatchlist.find(w => w.workId === workId);
    return fromPredictive || null;
  }
};
