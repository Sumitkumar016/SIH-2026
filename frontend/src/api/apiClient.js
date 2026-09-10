/**
 * Shared API Client (src/api/apiClient.js)
 * Automatically attaches in-memory JWT authorization token to outbound requests.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let inMemoryToken = null;

export function setAuthToken(token) {
  inMemoryToken = token;
}

export function getAuthToken() {
  return inMemoryToken;
}

let activeRequestsCount = 0;
const requestListeners = new Set();

export function onApiActivityChange(listener) {
  requestListeners.add(listener);
  listener(activeRequestsCount > 0, activeRequestsCount);
  return () => requestListeners.delete(listener);
}

function notifyActivity() {
  const isBusy = activeRequestsCount > 0;
  requestListeners.forEach((listener) => {
    try {
      listener(isBusy, activeRequestsCount);
    } catch {
      // ignore errors in listeners
    }
  });
}

/**
 * Shared authenticated fetch wrapper.
 * Prepends base URL, sets JSON headers, and attaches Bearer token if present.
 * 
 * @param {string} endpoint - e.g. '/api/auth/me' or full URL
 * @param {RequestInit} [options={}] - Standard fetch options
 * @returns {Promise<any>}
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (inMemoryToken) {
    headers['Authorization'] = `Bearer ${inMemoryToken}`;
  }

  let body = options.body;
  if (
    body !== undefined &&
    body !== null &&
    typeof body === 'object' &&
    typeof body !== 'string' &&
    !(body instanceof FormData) &&
    !(body instanceof Blob)
  ) {
    body = JSON.stringify(body);
  }

  activeRequestsCount++;
  notifyActivity();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, options.timeout || 8000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
      headers,
      ...(body !== undefined ? { body } : {}),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
    activeRequestsCount = Math.max(0, activeRequestsCount - 1);
    notifyActivity();
  }
}

export default apiFetch;
