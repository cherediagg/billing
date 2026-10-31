'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { useFetchBilling } from './billing/hooks/useFetchBilling';
import { useGenerateBills } from './billing/hooks/useGenerateBills';
import Title from 'src/components/title/title';
import Button from 'src/components/button/button';
import ConsoleFeed from 'src/components/console-feedback/console-feed';
import ErrorAlert from 'src/components/error/error';
import Loading from 'src/components/loading/loading';
import TextInput from 'src/components/input-text/text-input';
import Toast from 'src/components/toast/toast';

export default function Index() {
  const [idBill, setIdBill] = useState<number>(0);
  const [showToast, setShowToast] = useState(false);

  const { data, loading, error } = useFetchBilling();
  const { files, isLoading, errorGenerate, processFiles } = useGenerateBills(idBill);

  useEffect(() => {
    if (data?.nextId) {
      setIdBill(data.nextId);
    }
  }, [data]);

  useEffect(() => {
    if (files.length > 0) {
      setShowToast(true);
    }
  }, [files]);

  return (
    <section className={styles.page}>
      <Title>Generador de Facturas</Title>
      
      <Loading loading={loading} />
      
      <ErrorAlert message={error || errorGenerate}>
        {error || errorGenerate}
      </ErrorAlert>

      {data && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Última factura generada:
            </span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-md text-sm">
              {data.lastBill}
            </span>
          </div>

          <TextInput
            type="number"
            label="Próxima numeración"
            id="id-bill-input"
            placeholder="Número de factura"
            onChange={(e) => setIdBill(parseInt(e.target.value, 10) || 0)}
            value={idBill || ''}
            className="bg-lime-50 dark:bg-slate-800 font-mono text-lg"
            required
          />

          <ConsoleFeed>
            <div className="text-emerald-400 mb-2">
              Se van a generar <b>{data.total} facturas</b>. Pulsa el botón para continuar...
            </div>
            {files.map((file) => (
              <div key={`${file.name}-${file.id}`} className="px-1 py-0.5 text-emerald-300 flex items-center gap-2">
                <span>✅</span>
                <span>{file.name}</span>
                <span className="text-xs text-emerald-500">({file.id})</span>
              </div>
            ))}
          </ConsoleFeed>

          <Button
            ariaLabel="Generar facturas"
            onClick={processFiles}
            isDisabled={isLoading || files.length > 0 || !idBill}
            className="mt-6 mx-auto block py-2.5 px-6"
          >
            {isLoading
              ? 'Procesando facturas...'
              : files.length > 0
              ? 'Facturas generadas correctamente'
              : 'Generar facturas'}
          </Button>
        </div>
      )}

      {showToast && <Toast message="¡Facturas generadas con éxito!" />}
    </section>
  );
}
