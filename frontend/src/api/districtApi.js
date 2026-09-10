import { mockWorksData, mockCurrentDistrict } from './mockData';
import { apiFetch } from './apiClient';

/**
 * District Authority Data Layer (src/api/districtApi.js)
 * Scoped strictly to the logged-in district (Patna, Bihar) across ALL MPs who have works there.
 * Mutates shared mockWorksData in-place for live cross-dashboard demo consistency (e.g. Auditor dashboard).
 */

export const districtApi = {
  // Get District Profile Context
  async getDistrictProfile(districtId = 'DIST-BR-PATNA') {
    if (!districtId || districtId === 'DIST-BR-PATNA' || districtId === 'DIST001') {
      return { ...mockCurrentDistrict };
    }
    const fromWorks = mockWorksData.find(w => w.districtId === districtId || w.district.toLowerCase().includes(districtId.toLowerCase()));
    if (fromWorks) {
      return {
        districtId,
        districtName: fromWorks.district,
        state: fromWorks.state,
        nodalOfficer: 'District Nodal Officer (DNO)',
        headquarters: `${fromWorks.district} Collectorate`,
        totalActiveWorks: 18,
        totalSanctionedCr: 14.8,
      };
    }
    return { ...mockCurrentDistrict };
  },

  // Get District Overview (KPIs, MP-wise breakdown table)
  async getDistrictOverview(districtId = 'DIST-BR-PATNA') {
    try {
      const remote = await apiFetch('/api/district/overview');
      if (remote && remote.district && remote.kpis && Array.isArray(remote.mpBreakdown)) {
        return remote;
      }
    } catch {
      // Gracefully fall back to local seed/mock data when backend is unreachable
    }

    const districtInfo = await this.getDistrictProfile(districtId);
    const districtWorks = mockWorksData.filter(
      (w) => w.district.toLowerCase() === districtInfo.districtName.toLowerCase()
    );

    // District-wide summary KPIs
    const totalWorks = districtWorks.length;
    const sanctionedWorks = districtWorks.filter(w => w.status !== 'Draft' && w.status !== 'Recommended');
    const completedWorks = districtWorks.filter(w => w.status === 'Completed');
    const flaggedWorks = districtWorks.filter(
      w => w.riskLevel === 'High' || w.riskLevel === 'Medium' || (w.riskScore && w.riskScore >= 40)
    );

    const totalSanctionedLakhs = districtWorks.reduce((acc, w) => acc + (w.sanctionedAmount || 0), 0);
    const totalExpenditureLakhs = districtWorks.reduce((acc, w) => acc + (w.expenditure || 0), 0);

    // Group works by MP
    const mpMap = new Map();
    districtWorks.forEach(w => {
      if (!mpMap.has(w.mpName)) {
        mpMap.set(w.mpName, {
          mpName: w.mpName,
          constituency: w.constituency || 'Constituency',
          works: [],
          totalWorks: 0,
          flaggedCount: 0,
          completedCount: 0,
          totalSanctionedLakhs: 0,
          totalExpenditureLakhs: 0,
        });
      }
      const entry = mpMap.get(w.mpName);
      entry.works.push(w);
      entry.totalWorks += 1;
      if (w.status === 'Completed') entry.completedCount += 1;
      if (w.riskLevel === 'High' || w.riskLevel === 'Medium' || (w.riskScore && w.riskScore >= 40)) {
        entry.flaggedCount += 1;
      }
      entry.totalSanctionedLakhs += (w.sanctionedAmount || 0);
      entry.totalExpenditureLakhs += (w.expenditure || 0);
    });

    const mpBreakdown = Array.from(mpMap.values()).map(m => ({
      ...m,
      completionRate: Math.round((m.completedCount / m.totalWorks) * 100),
      totalSanctionedCr: Math.round((m.totalSanctionedLakhs / 100) * 100) / 100,
    }));

    return {
      district: districtInfo,
      kpis: {
        totalWorks,
        totalSanctionedCount: sanctionedWorks.length,
        totalCompletedCount: completedWorks.length,
        totalFlaggedCount: flaggedWorks.length,
        totalSanctionedCr: Math.round((totalSanctionedLakhs / 100) * 100) / 100,
        totalExpenditureCr: Math.round((totalExpenditureLakhs / 100) * 100) / 100,
        completionRate: Math.round((completedWorks.length / totalWorks) * 1000) / 10,
      },
      mpBreakdown,
    };
  },

  // Get Verification Queue: ONLY completed works where photo evidence is missing
  async getVerificationQueue(districtId = 'DIST-BR-PATNA') {
    try {
      const remote = await apiFetch('/api/district/verification');
      if (remote && Array.isArray(remote.data)) {
        return {
          district: mockCurrentDistrict,
          total: remote.data.length,
          data: remote.data,
        };
      }
    } catch {
      // Graceful fallback to mock data
    }

    const districtInfo = mockCurrentDistrict;
    const missingEvidenceWorks = mockWorksData.filter(
      (w) =>
        w.district.toLowerCase() === districtInfo.districtName.toLowerCase() &&
        w.status === 'Completed' &&
        w.photoEvidenceStatus === 'missing'
    ).map((w) => ({
      ...w,
      assetVerificationStatus:
        w.assetVerificationStatus ||
        w.latestAssetVerificationStatus ||
        w.assetCreation?.[0]?.verificationStatus ||
        null,
    }));

    return {
      district: districtInfo,
      total: missingEvidenceWorks.length,
      data: [...missingEvidenceWorks],
    };
  },

  // Action 1: Mark as Verified (evidence confirmed, removes from queue)
  async markWorkVerified(workId) {
    try {
      const res = await apiFetch(`/api/district/verification/${encodeURIComponent(workId)}/verify`, {
        method: 'POST',
      });
      if (res && res.success) {
        const target = mockWorksData.find(w => w.workId === workId);
        if (target) {
          target.photoEvidenceStatus = 'verified';
          target.verifiedDate = new Date().toISOString().slice(0, 10);
        }
        return res;
      }
    } catch {
      // Graceful fallback to local mock mutation
    }

    const target = mockWorksData.find(w => w.workId === workId);
    if (target) {
      target.photoEvidenceStatus = 'verified';
      target.verifiedDate = new Date().toISOString().slice(0, 10);
    }
    return { success: true, workId };
  },

  // Action 2: Request Evidence (sends notice/reminder)
  async requestEvidence(workId, note = 'Formal notice sent to implementing agency') {
    try {
      const res = await apiFetch(`/api/district/verification/${encodeURIComponent(workId)}/request-evidence`, {
        method: 'POST',
        body: JSON.stringify({ note }),
      });
      if (res && res.success) {
        const target = mockWorksData.find(w => w.workId === workId);
        if (target) {
          target.evidenceReminderSent = true;
          target.evidenceReminderDate = new Date().toISOString().slice(0, 10);
          target.evidenceReminderNote = note;
        }
        return res;
      }
    } catch {
      // Graceful fallback to local mock mutation
    }

    const target = mockWorksData.find(w => w.workId === workId);
    if (target) {
      target.evidenceReminderSent = true;
      target.evidenceReminderDate = new Date().toISOString().slice(0, 10);
      target.evidenceReminderNote = note;
    }
    return { success: true, workId, note };
  },

  // Action 3: Escalate to Investigation (updates shared mock data object for Auditor dashboard)
  async escalateWorkToInvestigation(workId, note = 'Evidence not provided after multiple statutory reminder periods') {
    try {
      const res = await apiFetch(`/api/district/verification/${encodeURIComponent(workId)}/escalate`, {
        method: 'POST',
        body: JSON.stringify({ note }),
      });
      if (res && res.success) {
        const target = mockWorksData.find(w => w.workId.toLowerCase() === workId.toLowerCase());
        if (target) {
          target.escalationSource = 'district';
          target.escalationNote = note;
          target.escalatedDate = new Date().toISOString().slice(0, 10);
          target.status = 'Under Investigation';
          target.caseStatus = 'Escalated';
          if (target.riskScore < 75) {
            target.riskScore = Math.max(target.riskScore, 75);
            target.riskLevel = 'High';
          }
        }
        return res;
      }
    } catch {
      // Graceful fallback to local mock mutation
    }

    const target = mockWorksData.find(w => w.workId.toLowerCase() === workId.toLowerCase());
    if (target) {
      target.escalationSource = 'district';
      target.escalationNote = note;
      target.escalatedDate = new Date().toISOString().slice(0, 10);
      target.status = 'Under Investigation';
      target.caseStatus = 'Escalated';
      if (target.riskScore < 75) {
        target.riskScore = Math.max(target.riskScore, 75);
        target.riskLevel = 'High';
      }
    }
    return { success: true, workId, target };
  },
};
