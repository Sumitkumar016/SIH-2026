import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useApiQuery
 * Standardized data-fetching hook preserving existing data during refetches.
 * 
 * @param {Function} fetchFn - Async function returning data
 * @param {Array} deps - Dependency array triggering automatic refetches
 * @param {Object} options - { initialData, enabled }
 */
export function useApiQuery(fetchFn, deps = [], options = {}) {
  const { initialData = null, enabled = true } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled && initialData === null);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState(null);

  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const hasLoadedOnce = useRef(initialData !== null);

  const execute = useCallback(async () => {
    if (!enabled) return;

    if (hasLoadedOnce.current) {
      setIsRefetching(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await fetchFnRef.current();
      setData(result);
      hasLoadedOnce.current = true;
      return result;
    } catch (err) {
      console.error('useApiQuery error:', err);
      setError(err);
    } finally {
      setLoading(false);
      setIsRefetching(false);
    }
  }, [enabled]);

  useEffect(() => {
    execute();
  }, [...deps, execute]);

  return {
    data,
    loading,
    isRefetching,
    error,
    refetch: execute,
    setData,
  };
}

export default useApiQuery;
