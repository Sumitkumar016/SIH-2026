import { mockCurrentState, mockBiharDistrictsData, mockWorksData } from './mockData';

/**
 * State Nodal Authority Data Layer (src/api/stateApi.js)
 * Scoped strictly to the logged-in State (Bihar) - aggregates works across all districts.
 */

export const stateApi = {
  // Get State Profile Context
  async getStateProfile(stateId = 'STATE-BR') {
    return { ...mockCurrentState };
  },

  // Get State Overview rollup
  async getStateOverview(stateId = 'STATE-BR') {
    const stateInfo = mockCurrentState;
    const districts = mockBiharDistrictsData.map(d => ({
      ...d,
      completionRate: Math.round((d.completed / d.totalWorks) * 100),
    }));

    // Aggregate state totals
    const totalWorks = districts.reduce((acc, d) => acc + d.totalWorks, 0);
    const totalSanctionedCr = districts.reduce((acc, d) => acc + d.sanctionedCr, 0);
    const totalCompleted = districts.reduce((acc, d) => acc + d.completed, 0);
    const totalFlaggedCount = districts.reduce((acc, d) => acc + d.flaggedCount, 0);
    const avgRiskScore = Math.round(districts.reduce((acc, d) => acc + d.avgRiskScore, 0) / districts.length);

    return {
      state: stateInfo,
      kpis: {
        totalWorks,
        totalSanctionedCr: Math.round(totalSanctionedCr * 10) / 10,
        totalCompleted,
        completionRate: Math.round((totalCompleted / totalWorks) * 1000) / 10,
        totalFlaggedCount,
        avgRiskScore,
        totalDistrictsCovered: districts.length,
      },
      districts: [...districts].sort((a, b) => b.flaggedCount - a.flaggedCount),
    };
  },

  // Get District Summary Details (including top 3 highest-risk projects)
  async getDistrictSummary(districtName) {
    const districtInfo = mockBiharDistrictsData.find(
      d => d.district.toLowerCase() === districtName.toLowerCase()
    ) || {
      district: districtName,
      totalWorks: 120,
      sanctionedCr: 60.0,
      completed: 85,
      flaggedCount: 18,
      avgRiskScore: 55,
      highRisk: 8,
      medRisk: 6,
      lowRisk: 4,
    };

    // Find actual matching works from mockWorksData
    let matchingWorks = mockWorksData.filter(
      w => w.district.toLowerCase() === districtName.toLowerCase()
    );

    // If fewer than 3, generate realistic fallback works for the selected district
    if (matchingWorks.length < 3) {
      const fallbackWorks = [
        {
          workId: `MPLADS-BR-2024-${districtName.slice(0, 3).toUpperCase()}-01`,
          mpName: `MP (${districtName} Constituency)`,
          state: "Bihar",
          district: districtName,
          category: "Rural Roads & Bridges",
          description: `Widening and blacktopping of Rural Link Corridor in ${districtName} Block`,
          sanctionedAmount: 78.50,
          expenditure: 98.20,
          status: "Delayed",
          riskScore: 84,
          riskLevel: "High",
          flagReason: "Cost overrun by 25% and 8-month delay in culvert casting",
          vendorName: "M/s Apex Infra Projects",
          riskFactorBreakdown: { costOverrun: 40, delaySlippage: 35, duplicateSimilarity: 15, vendorAnomaly: 10 },
          aiDiagnosticSummary: `Significant timeline deviation detected during ground inspection in ${districtName}.`,
        },
        {
          workId: `MPLADS-BR-2024-${districtName.slice(0, 3).toUpperCase()}-02`,
          mpName: `MP (${districtName} Constituency)`,
          state: "Bihar",
          district: districtName,
          category: "Drinking Water Supply",
          description: `Installation of 15 Solar Deep Borewells in ${districtName} rural wards`,
          sanctionedAmount: 52.00,
          expenditure: 49.80,
          status: "Under Review",
          riskScore: 68,
          riskLevel: "Medium",
          flagReason: "Water laboratory quality test results not submitted by agency",
          vendorName: "Ganga Civil Solutions",
          riskFactorBreakdown: { costOverrun: 10, delaySlippage: 50, duplicateSimilarity: 20, vendorAnomaly: 20 },
          aiDiagnosticSummary: "Civil structure complete; water test safety compliance report pending.",
        },
        {
          workId: `MPLADS-BR-2024-${districtName.slice(0, 3).toUpperCase()}-03`,
          mpName: `MP (${districtName} Constituency)`,
          state: "Bihar",
          district: districtName,
          category: "Education & Smart Classrooms",
          description: `Smart Interactive Digital Classroom Setup in ${districtName} Girls High School`,
          sanctionedAmount: 45.00,
          expenditure: 44.50,
          status: "Ongoing",
          riskScore: 42,
          riskLevel: "Medium",
          flagReason: "Minor 30-day equipment delivery lag",
          vendorName: "Southern Tech Labs",
          riskFactorBreakdown: { costOverrun: 5, delaySlippage: 60, duplicateSimilarity: 15, vendorAnomaly: 20 },
          aiDiagnosticSummary: "Hardware delivered; power backup installation underway.",
        }
      ];
      matchingWorks = [...matchingWorks, ...fallbackWorks].slice(0, 3);
    }

    // Sort by risk score descending
    matchingWorks.sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));
    const topProjects = matchingWorks.slice(0, 3);

    return {
      district: districtInfo.district,
      totalWorks: districtInfo.totalWorks,
      sanctionedCr: districtInfo.sanctionedCr,
      completed: districtInfo.completed,
      flaggedCount: districtInfo.flaggedCount,
      avgRiskScore: districtInfo.avgRiskScore,
      riskBreakdown: {
        high: districtInfo.highRisk,
        medium: districtInfo.medRisk,
        low: districtInfo.lowRisk,
      },
      topProjects,
    };
  }
};
