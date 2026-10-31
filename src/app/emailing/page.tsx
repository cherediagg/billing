'use client';

import styles from './page.module.css';
import { useGetEmails, Emails } from './hooks/useGetEmails';
import { useSendEmails } from './hooks/useSendEmails';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Button from 'src/components/button/button';
import ConsoleFeed from 'src/components/console-feedback/console-feed';
import ErrorAlert from 'src/components/error/error';
import Loading from 'src/components/loading/loading';
import Title from 'src/components/title/title';
import Toast from 'src/components/toast/toast';

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

  const selectedFileSet = useMemo(
    () => new Set(emailsToSend.map((e) => e.file)),
    [emailsToSend]
  );

  const handleCheckboxChange = useCallback((email: Emails, checked: boolean) => {
    setEmailsToSend((prevEmails) => {
      if (checked) {
        return [...prevEmails, email];
      }
      return prevEmails.filter((e) => e.file !== email.file);
    });
  }, []);

  const renderPreResult = data && (
    <div className="email-list space-y-4">
      <ConsoleFeed>
        <div className="email-summary mb-2">
          Se van a enviar <b className="email-count">{emailsToSend.length}</b> emails:
        </div>
        {data.map((email) => {
          const isSelected = selectedFileSet.has(email.file);
          return (
            <div key={email.file} className="email-item mb-1 flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 cursor-pointer flex-1">
                <input
                  className="email-checkbox w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => handleCheckboxChange(email, e.target.checked)}
                />
                <span className="email-file font-mono text-xs text-slate-300">{email.file}</span>
              </label>
              <span className="email-address text-emerald-400 text-xs shrink-0 ml-2">
                {email.email} 📧
              </span>
            </div>
          );
        })}
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
            <div key={`${file.file}-${file.email}-${index}`} className="failed-email">
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
