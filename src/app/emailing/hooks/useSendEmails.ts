'use client';

import { useState } from 'react';
import { EmailRecipient, FailedEmail } from '../../../models';

export interface EmailErrorPayload {
  failedEmails: FailedEmail[];
  reason: string;
}

export interface UseSendEmailsResult {
  files: string;
  isLoading: boolean;
  errorSending: EmailErrorPayload | null;
  processFiles: () => Promise<void>;
}

export function useSendEmails(emails: EmailRecipient[]): UseSendEmailsResult {
  const [files, setFiles] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorSending, setErrorSending] = useState<EmailErrorPayload | null>(null);

  const processFiles = async () => {
    if (!emails || emails.length === 0) {
      return;
    }

    setIsLoading(true);
    setErrorSending(null);
    setFiles('');

    try {
      const response = await fetch('/api/emailing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorSending({
          failedEmails: result.failedEmails || [],
          reason: result.reason || result.error || 'Error al enviar correos',
        });
        return;
      }

      setFiles(result.message || 'Correos enviados con éxito.');
    } catch (err: any) {
      setErrorSending({
        failedEmails: [],
        reason: err?.message || 'Error de conexión al enviar correos',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { files, isLoading, errorSending, processFiles };
}

// Alias for backwards compatibility
export const UseSendEmails = useSendEmails;
export default useSendEmails;
