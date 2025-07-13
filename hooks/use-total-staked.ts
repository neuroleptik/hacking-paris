import { useEffect, useState } from 'react';

interface TotalStakedData {
  totalStaked: string;
  totalStakedRaw: string;
  symbol: string;
  data: {
    totalStaked: string;
  };
  error?: string;
}

export function useTotalStaked() {
  const [data, setData] = useState<TotalStakedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTotalStaked = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/total-staked');
      const result = await response.json();

      if (response.ok) {
        setData(result);
      } else {
        setError(
          result.error || 'Erreur lors de la récupération du total staké'
        );
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Erreur lors de la récupération du total staké:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalStaked();
  }, []);

  const refresh = () => {
    fetchTotalStaked();
  };

  return {
    data,
    loading,
    error,
    refresh
  };
}
