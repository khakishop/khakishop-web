import { useState, useEffect } from 'react';

interface UseUnifiedDataResult {
  data: any[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  updateData: (newData: any[]) => Promise<boolean>;
}

export function useUnifiedData(category: string): UseUnifiedDataResult {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/unified-data?category=${category}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${category} data`);
      }

      const result = await response.json();
      setData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 로딩 실패');
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (newData: any[]): Promise<boolean> => {
    try {
      const response = await fetch('/api/unified-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, data: newData }),
      });

      if (!response.ok) throw new Error('Failed to update data');

      setData(newData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 업데이트 실패');
      return false;
    }
  };

  useEffect(() => {
    if (category) fetchData();
  }, [category]);

  return { data, loading, error, refetch: fetchData, updateData };
}
