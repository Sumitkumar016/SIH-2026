import { mockWorksData } from './mockData';
import { mpladsService } from './mpladsService';

/**
 * Ministry API Layer (src/api/ministryApi.js)
 * Centralized data access for Ministry (National View) dashboards.
 * Aggregates directly from shared mock dataset without duplicating data.
 */

/**
 * Aggregates MP-level metrics and supports full listing, filtering, sorting,
 * and top/bottom leaderboard rankings strictly by Fund Utilization %.
 * 
 * Handles zero/invalid denominators:
 * - Zero sanctionedAmount => fundUtilization: null ('N/A').
 * - Zero recommended works => completionRate: null ('N/A').
 */
export async function getMpLeaderboard(filters = {}) {
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

    // Track state/district if not set
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
    // Zero / invalid denominator checks
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
      fundUtilization, // number (e.g. 98.4) or null ('N/A')
      completionRate,  // number (e.g. 100.0) or null ('N/A')
      totalSanctionedAmount: Math.round(mp.totalSanctionedAmount * 100) / 100,
      totalExpenditure: Math.round(mp.totalExpenditure * 100) / 100,
    };
  });

  // Extract unique available states and districts for FilterBar
  const availableStates = Array.from(new Set(allMps.map((m) => m.state).filter(Boolean))).sort();
  const availableDistricts = Array.from(
    new Set(allMps.map((m) => m.district || m.constituency).filter(Boolean))
  ).sort();

  // Top 5 / Bottom 5 (excludes N/A fundUtilization)
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

  // Apply filters to full list
  let filteredMps = [...allMps];

  // Search filter (MP Name, Constituency, District, State)
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

  // State filter
  if (filters.state && filters.state !== 'All') {
    filteredMps = filteredMps.filter(
      (m) => m.state.toLowerCase() === filters.state.toLowerCase()
    );
  }

  // District filter
  if (filters.district && filters.district !== 'All') {
    filteredMps = filteredMps.filter(
      (m) =>
        m.district.toLowerCase() === filters.district.toLowerCase() ||
        m.constituency.toLowerCase() === filters.district.toLowerCase()
    );
  }

  // Utilization Range filter
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

  // Completion Rate Range filter
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

  // Sorting
  const sortField = filters.sortField || 'fundUtilization';
  const sortDirection = filters.sortDirection || 'desc';

  filteredMps.sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    // Keep N/A / null values at the bottom when sorting numerically
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

export const ministryApi = {
  ...mpladsService,
  getMpLeaderboard,
};

export default ministryApi;
