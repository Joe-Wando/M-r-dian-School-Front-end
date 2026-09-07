import { useCallback, useEffect, useState } from "react";

/**
 * Charge une ressource via une fonction async.
 *   const { data, loading, error, reload } = useApi(() => api.listCourses(filters), [filters]);
 */
export function useApi(fetcher, deps = [], { immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fetcher, deps);

  const reload = useCallback(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    Promise.resolve()
      .then(run)
      .then((res) => alive && setData(res))
      .catch((err) => alive && setError(err.message || "Erreur inattendue."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [run]);

  useEffect(() => {
    if (!immediate) return;
    const cancel = reload();
    return cancel;
  }, [reload, immediate]);

  return { data, loading, error, reload, setData };
}
