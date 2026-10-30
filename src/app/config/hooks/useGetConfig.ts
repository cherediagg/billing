'use client';

import { useState, useEffect, useCallback } from 'react';
import { Client } from '../../../models';

export interface UseGetConfigResult {
  clients: Client[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGetConfig(): UseGetConfigResult {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/config');
      if (!response.ok) {
        throw new Error('Error al obtener la configuración de clientes');
      }
      const result = await response.json();
      setClients(Array.isArray(result) ? result : []);
    } catch (err: any) {
      setError(err?.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigData();
  }, [fetchConfigData]);

  return { clients, loading, error, refetch: fetchConfigData };
}

// Alias for backwards compatibility
export const UseGetConfig = useGetConfig;
export default useGetConfig;
