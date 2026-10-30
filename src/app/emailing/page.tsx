'use client';

import styles from './page.module.css';
import { useGetEmails, Emails } from './hooks/useGetEmails';
import { useSendEmails } from './hooks/useSendEmails';
import { useEffect, useState } from 'react';
import { Button, ConsoleFeed, Error as ErrorAlert, Loading, Title, Toast } from 'src/components';

export default function Page() {
  const [emailsToSend, setEmailsToSend] = useState<Emails[]>([]);
  const { data, loading, error } = useGetEmails();
  const { files, isLoading, errorSending, processFiles } = useSendEmails(emailsToSend);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (data) {
      setEmailsToSend(data);
    }
  }, [data]);

  useEffect(() => {
    if (files) setShowToast(true);
  }, [files]);

  const handleCheckboxChange = (email: Emails, checked: boolean) => {
    const updatedEmails = [...emailsToSend];
    if (checked) {
      updatedEmails.push(email);
    } else {
      const index = updatedEmails.findIndex((e) => e.file === email.file);
      if (index !== -1) {
        updatedEmails.splice(index, 1);
      }
    }
    setEmailsToSend(updatedEmails);
  };

  const renderPreResult = data && (
    <div className="email-list space-y-4">
      <ConsoleFeed>
        <div className="email-summary mb-2">
          Se van a enviar <b className="email-count">{emailsToSend.length}</b> emails:
        </div>
        {data.map((email) => (
          <div key={email.file} className="email-item mb-1 flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 cursor-pointer flex-1">
              <input
                className="email-checkbox w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                type="checkbox"
                checked={emailsToSend.some((e) => e.file === email.file)}
                onChange={(e) => handleCheckboxChange(email, e.target.checked)}
              />
              <span className="email-file font-mono text-xs text-slate-300">{email.file}</span>
            </label>
            <span className="email-address text-emerald-400 text-xs shrink-0 ml-2">
              {email.email} 📧
            </span>
          </div>
        ))}
      </ConsoleFeed>

      <Button
        className="send-emails-btn mt-4 mx-auto block py-2 px-6"
        ariaLabel="Enviar emails"
        onClick={processFiles}
        isDisabled={isLoading || !!files || emailsToSend.length === 0}
      >
        {isLoading ? 'Procesando...' : files ? files : 'Enviar emails'}
      </Button>
    </div>
  );

  return (
    <section className={styles.page}>
      <Title>Enviar facturas por email</Title>
      
      <Loading loading={loading} />
      
      <ErrorAlert message={error}>{error}</ErrorAlert>
      
      <ErrorAlert message={errorSending?.reason || null}>
        <p>{errorSending?.reason}</p>
        <div className="error-failed-emails">
          Han fallado los siguientes emails:
          {errorSending?.failedEmails.map((file, index) => (
            <div key={index} className="failed-email">
              {file.file} - {file.email}
            </div>
          ))}
        </div>
      </ErrorAlert>

      {renderPreResult}

      {showToast && <Toast message={files} />}
    </section>
  );
}
