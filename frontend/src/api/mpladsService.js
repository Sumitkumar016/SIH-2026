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
  },

  // Fetch MP Performance Leaderboard (Ranked strictly by Fund Utilization %)
  async getMpLeaderboard(filters = {}) {
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
