'use client';

import { useState, useEffect, useCallback } from 'react';
import { BillingSummary } from '../../../models';

export interface UseFetchBillingResult {
  data: BillingSummary | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFetchBilling(): UseFetchBillingResult {
  const [data, setData] = useState<BillingSummary>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBillingData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/billing');
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Error al obtener datos de facturación');
      }
      setData(result);
    } catch (err: any) {
      setError(err?.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBillingData();
  }, [fetchBillingData]);

  return { data, loading, error, refetch: fetchBillingData };
}

// Alias for backwards compatibility
export const UseFetchBilling = useFetchBilling;
export default useFetchBilling;
