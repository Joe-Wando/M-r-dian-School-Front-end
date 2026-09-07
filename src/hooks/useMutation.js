import { useCallback, useState } from "react";

/**
 * Encapsule une action d'ecriture (POST/PATCH/DELETE).
 *   const { mutate, loading, error } = useMutation(api.createBooking);
 *   await mutate(payload);
 */
export function useMutation(action) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        return await action(...args);
      } catch (err) {
        setError(err.message || "L'operation a echoue.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [action]
  );

  return { mutate, loading, error, setError };
}
