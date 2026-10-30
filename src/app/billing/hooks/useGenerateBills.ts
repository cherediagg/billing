'use client';

import { useState } from 'react';
import { GeneratedInvoice } from '../../../models';

export interface UseGenerateBillsResult {
  files: GeneratedInvoice[];
  isLoading: boolean;
  errorGenerate: string | null;
  processFiles: () => Promise<void>;
}

export function useGenerateBills(billNumber: number): UseGenerateBillsResult {
  const [files, setFiles] = useState<GeneratedInvoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorGenerate, setError] = useState<string | null>(null);

  const processFiles = async () => {
    if (!billNumber || isNaN(billNumber) || billNumber <= 0) {
      setError('Por favor introduce un número de factura válido');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ billNumber }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al generar las facturas');
      }

      setFiles(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido al procesar';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { files, isLoading, errorGenerate, processFiles };
}

// Alias for backwards compatibility
export const UseGenerateBills = useGenerateBills;
export default useGenerateBills;
