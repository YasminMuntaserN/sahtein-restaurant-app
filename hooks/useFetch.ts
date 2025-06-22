import { useEffect, useState } from "react";

export function useFetch<T>(fetchFunction: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchFunction()
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
  }, [fetchFunction]);

  return { data, loading, error };
}
