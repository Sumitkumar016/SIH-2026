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

  const startTime = Date.now();
  console.log('[apiFetch] START', url, {
    hasExternalSignal: !!options.signal,
    alreadyAborted: options.signal?.aborted,
  });

  if (options.signal) {
    options.signal.addEventListener('abort', () => {
      const elapsed = Date.now() - startTime;
      console.log('[apiFetch] EXTERNAL SIGNAL ABORTED', url, `after ${elapsed}ms`);
    });
  }

  const controller = new AbortController();
  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    const elapsed = Date.now() - startTime;
    console.log('[apiFetch] INTERNAL TIMEOUT ABORT', url, `after ${elapsed}ms`);
    controller.abort(new DOMException(`Request timed out after ${options.timeout || 30000}ms`, 'TimeoutError'));
  }, options.timeout || 30000);

  if (options.signal) {
    if (options.signal.aborted) {
      controller.abort(options.signal.reason);
    } else {
      options.signal.addEventListener('abort', () => {
        controller.abort(options.signal.reason);
      }, { once: true });
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
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
  } catch (err) {
    const isAbort = err.name === 'AbortError' || err.name === 'TimeoutError' || err.code === 20;
    if (isAbort) {
      err.isTimeout = timedOut;
      err.isExternalAbort = Boolean(options.signal?.aborted);
      err.isAborted = true;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
    activeRequestsCount = Math.max(0, activeRequestsCount - 1);
    notifyActivity();
  }
}

export default apiFetch;
