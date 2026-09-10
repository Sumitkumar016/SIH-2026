import { mockWorksData, mockCurrentMp } from './mockData';
import { apiFetch } from './apiClient';

/**
 * MP Data Layer (src/api/mpApi.js)
 * Scoped strictly to the logged-in MP's individual constituency.
 * Filters from the central mock dataset without duplicating data.
 */

export const mpApi = {
  // Get MP profile / identity
  async getMpProfile(mpId = 'MP-BR-0412') {
    if (!mpId || mpId === 'MP-BR-0412' || mpId === 'MP001') {
      return { ...mockCurrentMp };
    }
    const fromWorks = mockWorksData.find(w => w.mpId === mpId || w.mpName.toLowerCase().includes(mpId.toLowerCase()));
    if (fromWorks) {
      return {
        mpId,
        mpName: fromWorks.mpName,
        constituency: fromWorks.constituency || 'Constituency',
        state: fromWorks.state || 'India',
        district: fromWorks.district,
        term: '17th / 18th Lok Sabha',
        house: 'Lok Sabha',
        annualEntitlementCr: 5.0,
      };
    }
    return { ...mockCurrentMp };
  },

  // Get My Constituency Overview (KPIs, utilization, and only this MP's flagged works)
  async getMyConstituencyOverview(mpId = 'MP-BR-0412') {
    try {
      const remote = await apiFetch('/api/mp/overview');
      if (remote && remote.mp && remote.kpis && Array.isArray(remote.flaggedWorks)) {
        return remote;
      }
    } catch {
      // Gracefully fall back to local seed/mock data when backend is not reached
    }

    const mpInfo = await this.getMpProfile(mpId);
    // Filter works for this MP
    const mpWorks = mockWorksData.filter(
      (w) => w.mpName.toLowerCase() === mpInfo.mpName.toLowerCase()
    );


    // Calculate MP-scoped KPIs
    const totalRecommendedCount = mpWorks.length + 3; // +3 pipeline requests in draft
    const totalSanctionedCount = mpWorks.filter(w => w.status !== 'Draft' && w.status !== 'Recommended').length;
    const completedWorks = mpWorks.filter(w => w.status === 'Completed');
    const totalCompletedCount = completedWorks.length;

    // Total Sanctioned Amount & Total Expenditure (in ₹ Lakhs)
    const totalSanctionedLakhs = mpWorks.reduce((acc, w) => acc + (w.sanctionedAmount || 0), 0);
    const totalExpenditureLakhs = mpWorks.reduce((acc, w) => acc + (w.expenditure || 0), 0);

    // Entitlement in Lakhs (₹5 Cr = 500 Lakhs)
    const annualEntitlementLakhs = (mpInfo.annualEntitlementCr || 5.0) * 100;
    const utilizationRatePercent = Math.min(100, Math.round((totalExpenditureLakhs / annualEntitlementLakhs) * 1000) / 10);

    // Flagged cases for THIS MP only
    const flaggedWorks = mpWorks.filter(
      (w) => w.riskLevel === 'High' || w.riskLevel === 'Medium' || (w.riskScore && w.riskScore >= 40)
    );

    return {
      mp: mpInfo,
      kpis: {
        annualEntitlementCr: mpInfo.annualEntitlementCr || 5.0,
        annualEntitlementLakhs,
        totalRecommendedCount,
        totalSanctionedCount,
        totalCompletedCount,
        totalSanctionedCr: Math.round((totalSanctionedLakhs / 100) * 100) / 100,
        totalExpenditureCr: Math.round((totalExpenditureLakhs / 100) * 100) / 100,
        totalSanctionedLakhs: Math.round(totalSanctionedLakhs * 10) / 10,
        totalExpenditureLakhs: Math.round(totalExpenditureLakhs * 10) / 10,
        utilizationRatePercent,
        totalFlaggedCount: flaggedWorks.length,
      },
      flaggedWorks,
    };
  },

  // Get full list of works for this MP with search & filters
  async getMyWorks(mpId = 'MP-BR-0412', filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);

      const qs = params.toString();
      const endpoint = qs ? `/api/mp/works?${qs}` : '/api/mp/works';
      const remote = await apiFetch(endpoint);
      if (remote && Array.isArray(remote.data)) {
        return remote;
      }
    } catch {
      // Gracefully fall back to local mock data when backend is not reached
    }

    const mpInfo = mockCurrentMp;
    let works = mockWorksData.filter(
      (w) => w.mpName.toLowerCase() === mpInfo.mpName.toLowerCase()
    );

    // Filter by Status
    if (filters.status && filters.status !== 'All') {
      works = works.filter((w) => w.status.toLowerCase() === filters.status.toLowerCase());
    }

    // Filter by Category
    if (filters.category && filters.category !== 'All') {
      works = works.filter((w) => w.category === filters.category);
    }

    // Filter by Risk Level
    if (filters.riskLevel && filters.riskLevel !== 'All') {
      works = works.filter((w) => w.riskLevel.toLowerCase() === filters.riskLevel.toLowerCase());
    }

    // Text Search by Work ID or description/vendor
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      works = works.filter(
        (w) =>
          w.workId.toLowerCase().includes(q) ||
          (w.description && w.description.toLowerCase().includes(q)) ||
          w.category.toLowerCase().includes(q) ||
          (w.vendorName && w.vendorName.toLowerCase().includes(q))
      );
    }

    return {
      mp: mpInfo,
      total: works.length,
      data: works,
    };
  },
};

