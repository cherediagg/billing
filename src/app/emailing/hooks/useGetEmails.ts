'use client';

import { useState, useEffect, useCallback } from 'react';
import { EmailRecipient } from '../../../models';

export type Emails = EmailRecipient;

export interface UseGetEmailsResult {
  data: EmailRecipient[] | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGetEmails(): UseGetEmailsResult {
  const [data, setData] = useState<EmailRecipient[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmailData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/emailing');
      if (!response.ok) {
        throw new Error('Error al obtener los correos de facturación');
      }
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err: any) {
      setError(err?.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmailData();
  }, [fetchEmailData]);

  return { data, loading, error, refetch: fetchEmailData };
}

// Alias for backwards compatibility
export const UseGetEmails = useGetEmails;
export default useGetEmails;
