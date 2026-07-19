/*
------------------------------------------------
File: useFetch.js
Purpose: Handles async data fetching states.
Responsibilities: Manages local loading, data, and error state mapping variables.
Dependencies: react
------------------------------------------------
*/

import { useState, useEffect, useCallback } from 'react';

/*
Custom fetch hook.
Params: apiFunc (function returning a promise).
Returns: { data, loading, error, refetch }.
*/
export const useFetch = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFunc();
      setData(res);
    } catch (err) {
      setError(err.message || 'Something went wrong fetching data.');
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
};
