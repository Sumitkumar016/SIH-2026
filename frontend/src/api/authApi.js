import { apiFetch, setAuthToken } from './apiClient.js';

/**
 * Authentication API Service (src/api/authApi.js)
 * Connects frontend auth to Express / Prisma backend.
 */

/**
 * Perform login request with email and plaintext password
 * @param {string} email - User email
 * @param {string} password - User plaintext password
 * @returns {Promise<{ token: string, user: Object }>}
 */
export async function login(email, password) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (data?.token) {
    setAuthToken(data.token);
  }

  return {
    token: data.token,
    user: data.user,
  };
}

/**
 * Fetch current authenticated user session using active in-memory JWT token
 * @returns {Promise<Object>} Safe user profile
 */
export async function getMe() {
  const data = await apiFetch('/api/auth/me', {
    method: 'GET',
  });

  return data.user;
}

export default { login, getMe };
