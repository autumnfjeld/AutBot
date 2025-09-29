import { useState } from 'react';
import { API_BASE } from '../config.js';

interface UseQueryReturn {
  response: string;
  isLoading: boolean;
  error: string;
  submitQuery: (query: string) => Promise<void>;
  clearError: () => void;
}

const useQuery = (): UseQueryReturn => {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const submitQuery = async (query: string): Promise<void> => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResponse(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResponse(''); // Clear previous response on error
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (): void => {
    setError('');
  };

  return {
    response,
    isLoading,
    error,
    submitQuery,
    clearError,
  };
};

export default useQuery;
