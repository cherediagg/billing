'use client';

import { Button, ConsoleFeed, Error as ErrorAlert, Loading, TextInput, Title, Toast } from 'src/components';
import styles from './page.module.css';
import { useGetConfig } from '../config/hooks/useGetConfig';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useUpdatePrices } from './hooks/useUpdatePrices';

export default function Page() {
  const [showToast, setToast] = useState(false);
  const [ipc, setIPC] = useState<number | null>(null);

  const { clients, loading, error } = useGetConfig();
  const { updatePrices, isUpdating, successMsg, errorMsg } = useUpdatePrices();

  useEffect(() => {
    if (successMsg) setToast(true);
  }, [successMsg]);

  const updatedPrices = useMemo(() => {
    if (!ipc || !clients || clients.length === 0) return [];

    return clients.map((client) => {
      const currentPrice = client.servicios[0]?.price || 0;
      const numericPrice = typeof currentPrice === 'number' ? currentPrice : parseFloat(String(currentPrice)) || 0;
      const newPrice = numericPrice * (1 + ipc / 100);

      return parseFloat(newPrice.toFixed(2));
    });
  }, [ipc, clients]);

  const handleUpdatePrices = useCallback(async () => {
    if (!clients || updatedPrices.length === 0) return;

    const newClients = clients.map((client, index) => ({
      ...client,
      servicios: client.servicios.map((service, svcIndex) =>
        svcIndex === 0 ? { ...service, price: updatedPrices[index] } : service
      ),
    }));

    await updatePrices(newClients);
  }, [clients, updatedPrices, updatePrices]);

  return (
    <section className={styles.page}>
      <Title>Actualizar Precios por IPC</Title>
      
      <Loading loading={loading} />
      
      <ErrorAlert message={error || errorMsg}>{error || errorMsg}</ErrorAlert>
      
      <Suspense fallback={<Loading loading />}>
        <div className="space-y-4">
          <TextInput
            type="number"
            step="0.01"
            label="Porcentaje de subida del IPC (%)"
            id="id-ipc-input"
            placeholder="Ejemplo: 3.5"
            onChange={(e) => setIPC(e.target.value ? parseFloat(e.target.value) : null)}
            className="bg-lime-50 dark:bg-slate-800 font-mono text-lg"
            required
          />

          <ConsoleFeed>
            <div className="text-emerald-400 mb-2 font-medium">
              Se van a actualizar <b>{clients.length} precios de servicios</b>. Pulsa el botón para guardar los cambios:
            </div>
            {clients.map((client, index) => {
              const currentPrice = client.servicios[0]?.price || 0;
              const hasNewPrice = updatedPrices.length > 0 && ipc !== null;
              return (
                <div
                  key={client.id || index}
                  className="px-2 py-1 flex items-center justify-between text-xs border-b border-slate-700/50 last:border-0"
                >
                  <span className="font-mono text-slate-300">{client.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono">
                      {typeof currentPrice === 'number' ? currentPrice.toFixed(2) : currentPrice} €
                    </span>
                    {hasNewPrice && (
                      <span className="text-emerald-400 font-bold font-mono">
                        ➡ {updatedPrices[index]?.toFixed(2)} €
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </ConsoleFeed>

          <Button
            className="mt-6 mx-auto block py-2.5 px-6"
            ariaLabel="Actualizar precios"
            onClick={handleUpdatePrices}
            isDisabled={isUpdating || updatedPrices.length === 0}
          >
            {isUpdating ? 'Actualizando precios...' : 'Actualizar precios'}
          </Button>

          {showToast && <Toast message="¡Precios actualizados y guardados con éxito!" />}
        </div>
      </Suspense>
    </section>
  );
}
