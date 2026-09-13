import { login as apiLogin } from '../api/authApi.js';

/**
 * Authentication Helper & Demo Users (src/auth/mockAuth.js)
 * Demo credentials for development / presentation access.
 */





export const mockUsers = [
  {
    id: 1,
    name: "Ministry Admin",
    email: "ministry@mplads-sentinel.local",
    password: "ministry123",
    role: "ministry",
    roleLabel: "Ministry (National View)",
    defaultPath: "/ministry/overview",
  },
  {
    id: 756,
    name: "AASHTIKAR PATIL NAGESH BAPURAO",
    email: "mp1@mplads-sentinel.local",
    password: "mp1123",
    role: "mp",
    roleLabel: "Member of Parliament (MP)",
    mpId: 1,
    stateId: 20,
    defaultPath: "/mp/overview",
  },
  {
    id: 164,
    name: "Durg District Authority",
    email: "district127@mplads-sentinel.local",
    password: "district127123",
    role: "district",
    roleLabel: "District Authority",
    districtId: 127,
    stateId: 7,
    districtName: "Durg",
    state: "Chhattisgarh",
    defaultPath: "/district/overview",
  },
  {
    id: 8,
    name: "Chhattisgarh Nodal Authority",
    email: "chhattisgarh@mplads-sentinel.local",
    password: "state7123",
    role: "state",
    roleLabel: "State Nodal Authority",
    stateId: 7,
    stateName: "Chhattisgarh",
    department: "Planning & Development Department, Chhattisgarh",
    defaultPath: "/state/overview",
  },
  {
    id: 1299,
    name: "Platform Auditor",
    email: "auditor@mplads-sentinel.local",
    password: "auditor123",
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
