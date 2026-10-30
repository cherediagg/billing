'use client';

import { useState } from 'react';
import { Client } from '../../../models';

export interface UseSaveToFileResult {
  saveToFile: () => Promise<boolean>;
  isSaving: boolean;
  successMsg: string;
  errorMsg: string;
}

export function useSaveToFile(companies: Client[]): UseSaveToFileResult {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const saveToFile = async (): Promise<boolean> => {
    const validCompanies = companies.filter(
      (company) => company.name && company.name.trim() && company.email && company.email.trim()
    );

    if (validCompanies.length === 0 && companies.length > 0) {
      setErrorMsg('Todas las empresas deben tener al menos un nombre y un correo.');
      return false;
    }

    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: validCompanies }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el archivo');
      }

      setSuccessMsg('Archivo guardado exitosamente.');
      setErrorMsg('');
      return true;
    } catch (e: any) {
      setSuccessMsg('');
      setErrorMsg(e?.message || 'Hubo un error al guardar los datos.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveToFile, isSaving, successMsg, errorMsg };
}

// Alias for backwards compatibility
export const UseSaveToFile = useSaveToFile;
export default useSaveToFile;
