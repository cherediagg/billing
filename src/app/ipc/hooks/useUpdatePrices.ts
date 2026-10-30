'use client';

import { useState } from 'react';
import { Client } from '../../../models';

export interface UseUpdatePricesResult {
  successMsg: string;
  errorMsg: string;
  isUpdating: boolean;
  updatePrices: (companies: Client[]) => Promise<boolean>;
}

export function useUpdatePrices(): UseUpdatePricesResult {
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const updatePrices = async (companies: Client[]): Promise<boolean> => {
    const validCompanies = companies.filter(
      (company) => company.name && company.name.trim() && company.email && company.email.trim()
    );

    setIsUpdating(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await fetch('/api/ipc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: validCompanies }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar los precios actualizados');
      }

      setSuccessMsg('Precios actualizados y guardados exitosamente.');
      setErrorMsg('');
      return true;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Hubo un error al guardar los nuevos precios.';
      setSuccessMsg('');
      setErrorMsg(message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updatePrices, successMsg, errorMsg, isUpdating };
}

// Alias for backwards compatibility
export const UseUpdatePrices = useUpdatePrices;
export default useUpdatePrices;
