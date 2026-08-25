/**
 * Mock Authentication Service (src/auth/mockAuth.js)
 * Frontend-only authentication layer for hackathon / demo prototyping.
 * 
 * SWAPPABILITY NOTE:
 * When migrating to a real REST backend, only the internals of `login()` need to be replaced
 * with `const res = await fetch('/api/auth/login', { ... }); return res.json();`.
 * All calling signatures and context hooks remain identical.
 */

export const mockUsers = [
  {
    id: 1,
    name: "Ministry Admin (Central MoSPI)",
    email: "ministry@mplads.gov.in",
    password: "demo123",
    role: "ministry",
    roleLabel: "Ministry (National View)",
    department: "MoSPI Oversight Wing, Govt of India",
    defaultPath: "/ministry/overview",
  },
  {
    id: 2,
    name: "Shri Ravi Shankar Prasad",
    email: "mp@mplads.gov.in",
    password: "demo123",
    role: "mp",
    roleLabel: "Member of Parliament (MP)",
    mpId: "MP-BR-0412",
    constituency: "Patna Sahib",
    state: "Bihar",
    defaultPath: "/mp/overview",
  },
  {
    id: 3,
    name: "Dr. Chandrashekhar Singh, IAS",
    email: "district@mplads.gov.in",
    password: "demo123",
    role: "district",
    roleLabel: "District Authority",
    districtId: "DIST-BR-PATNA",
    districtName: "Patna",
    state: "Bihar",
    defaultPath: "/district/overview",
  },
  {
    id: 4,
    name: "Shri S. Siddharth, IAS",
    email: "state@mplads.gov.in",
    password: "demo123",
    role: "state",
    roleLabel: "State Nodal Authority",
    stateId: "STATE-BR",
    stateName: "Bihar",
    department: "Planning & Development Department",
    defaultPath: "/state/overview",
  },
  {
    id: 5,
    name: "Senior Forensic Auditor",
    email: "auditor@mplads.gov.in",
    password: "demo123",
    role: "auditor",
    roleLabel: "Independent Auditor",
    department: "Central Forensic Investigation Wing",
    defaultPath: "/auditor/queue",
  },
];

/**
 * Mock login function returning a Promise to mimic a real REST API endpoint.
 * @param {string} email - Email address or role key
 * @param {string} password - User password
 * @returns {Promise<Object>} Matched user object without password
 */
export async function login(email, password) {
  return new Promise((resolve, reject) => {
    // Small micro-timeout simulating async network latency
    setTimeout(() => {
      const cleanEmail = (email || '').trim().toLowerCase();
      const user = mockUsers.find(
        (u) =>
          (u.email.toLowerCase() === cleanEmail ||
           u.role.toLowerCase() === cleanEmail) &&
          u.password === password
      );

      if (user) {
        const { password: _, ...safeUser } = user;
        resolve(safeUser);
      } else {
        reject(new Error("Invalid email or password. Use demo123 or select a Quick Login button below."));
      }
    }, 150);
  });
}

/**
 * Quick helper to retrieve user profile by role for one-click demo switching.
 * @param {string} role - 'ministry' | 'mp' | 'district' | 'state' | 'auditor'
 * @returns {Object|null}
 */
export function getMockUserByRole(role) {
  const user = mockUsers.find((u) => u.role.toLowerCase() === (role || '').toLowerCase());
  if (!user) return null;
  const { password: _, ...safeUser } = user;
  return safeUser;
}
