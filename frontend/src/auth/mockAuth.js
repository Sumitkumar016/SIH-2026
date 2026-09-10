import { login as apiLogin } from '../api/authApi.js';

/**
 * Authentication Helper & Demo Users (src/auth/mockAuth.js)
 * Pre-configured with verified real seeded credentials from the Supabase database.
 * 
 * Consistent Demo Scope:
 * - State: Bihar (state_id: 5)
 * - District: Aurangabad (district_id: 84, state_id: 5)
 * - MP: ABHAY KUMAR SINHA (mp_id: 3, constituency: AURANGABAD_BR, state_id: 5, allocated_amount: 1470)
 */

// later we can use
// export const mockUsers = [
//   {
//     id: 1,
//     name: "Ministry Admin",
//     email: "ministry@mplads.gov.in",
//     password: "ministry@mplads123",
//     role: "ministry",
//     roleLabel: "Ministry (National View)",
//     department: "MoSPI Oversight Wing, Govt of India",
//     defaultPath: "/ministry/overview",
//   },
//   {
//     id: 758,
//     name: "ABHAY KUMAR SINHA",
//     email: "abhaykumarsinha@mplads.gov.in",
//     password: "abhaykumarsinha@mplads123",
//     role: "mp",
//     roleLabel: "Member of Parliament (MP)",
//     constituency: "AURANGABAD_BR",
//     state: "Bihar",
//     defaultPath: "/mp/overview",
//   },
//   {
//     id: 121,
//     name: "Aurangabad District Authority",
//     email: "aurangabad@mplads.gov.in",
//     password: "aurangabad@mplads123",
//     role: "district",
//     roleLabel: "District Authority",
//     districtName: "Aurangabad",
//     state: "Bihar",
//     defaultPath: "/district/overview",
//   },
//   {
//     id: 6,
//     name: "Bihar Nodal Authority",
//     email: "bihar@mplads.gov.in",
//     password: "bihar@mplads123",
//     role: "state",
//     roleLabel: "State Nodal Authority",
//     stateName: "Bihar",
//     department: "Planning & Development Department, Bihar",
//     defaultPath: "/state/overview",
//   },
//   {
//     id: 1299,
//     name: "Auditor Investigator",
//     email: "auditor@mplads.gov.in",
//     password: "auditor@mplads123",
//     role: "auditor",
//     roleLabel: "Independent Auditor",
//     department: "Central Forensic Investigation Wing",
//     defaultPath: "/auditor/queue",
//   },
// ];


export const mockUsers = [
  {
    id: 1,
    name: "Ananya Mehra",
    email: "ananya.mehra@mplads-sentinel.test",
    password: "Ministry@123",
    role: "ministry",
    roleLabel: "Ministry (National View)",
    department: "MoSPI Oversight Wing, Govt of India",
    defaultPath: "/ministry/overview",
  },
  {
    id: 54,
    name: "Kiran Yadav",
    email: "mp024.kiran.yadav@mplads-sentinel.test",
    password: "MP@123",
    role: "mp",
    roleLabel: "Member of Parliament (MP)",
    constituency: "Raipur",
    state: "Chhattisgarh",
    defaultPath: "/mp/overview",
  },
  {
    id: 193,
    name: "Durg District Office",
    email: "district027.durg@mplads-sentinel.test",
    password: "District@123",
    role: "district",
    roleLabel: "District Authority",
    districtName: "Durg",
    state: "Chhattisgarh",
    defaultPath: "/district/overview",
  },
  {
    id: 6,
    name: "Rohit Bansal — Chhattisgarh",
    email: "state05@mplads-sentinel.test",
    password: "State@123",
    role: "state",
    roleLabel: "State Nodal Authority",
    stateName: "Chhattisgarh",
    department: "Planning & Development Department, Chhattisgarh",
    defaultPath: "/state/overview",
  },
  {
    id: 217,
    name: "Ritu Deshpande",
    email: "ritu.deshpande@mplads-sentinel.test",
    password: "Auditor@123",
    role: "auditor",
    roleLabel: "Independent Auditor",
    department: "Central Forensic Investigation Wing",
    defaultPath: "/auditor/queue",
  },
];




/**
 * Delegates to real backend authApi.login
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
  const res = await apiLogin(email, password);
  return res.user;
}

/**
 * Quick helper to retrieve demo user profile by role
 * @param {string} role
 */
export function getMockUserByRole(role) {
  return mockUsers.find((u) => u.role.toLowerCase() === (role || '').toLowerCase()) || null;
}
