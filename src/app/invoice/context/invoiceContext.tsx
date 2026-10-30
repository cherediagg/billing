'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useGetConfig } from '../../config/hooks/useGetConfig';
import { Client, Service } from 'src/models';

export interface InvoiceTotals {
  baseImponible: number;
  iva: number;
  total: number;
}

export interface InvoiceContextType {
  clients: Client[];
  loading: boolean;
  error: string | null;
  selectedClient: Client | null;
  items: Service[];
  totals: InvoiceTotals;
  setSelectedClient: (client: Client) => void;
  setItems: (items: Service[]) => void;
  handleItemChange: (index: number, field: keyof Service, value: string) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
}

export const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoice = (): InvoiceContextType => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { clients, loading, error } = useGetConfig();
  const [selectedClient, setSelectedClientState] = useState<Client | null>(null);
  const [items, setItems] = useState<Service[]>([]);

  useEffect(() => {
    if (clients && clients.length > 0 && !selectedClient) {
      const defaultClient = clients[0];
      setSelectedClientState(defaultClient);
      const defaultServices = defaultClient.servicios?.length
        ? defaultClient.servicios
        : [{ id: '1', concept: 'Servicio de limpieza', quantity: 1, price: 224 }];
      setItems([...defaultServices]);
    }
  }, [clients, selectedClient]);

  const totals = useMemo<InvoiceTotals>(() => {
    const baseImponible = items.reduce((sum, item) => {
      const quantity =
        typeof item.quantity === 'number' ? item.quantity : parseFloat(String(item.quantity)) || 0;
      const price =
        typeof item.price === 'number' ? item.price : parseFloat(String(item.price)) || 0;
      return sum + quantity * price;
    }, 0);

    const iva = baseImponible * 0.21;
    const total = baseImponible + iva;

    return {
      baseImponible: parseFloat(baseImponible.toFixed(2)),
      iva: parseFloat(iva.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  }, [items]);

  const handleItemChange = useCallback(
    (index: number, field: keyof Service, value: string) => {
      setItems((prevItems) => {
        const nextItems = [...prevItems];
        if (!nextItems[index]) return prevItems;

        nextItems[index] = {
          ...nextItems[index],
          [field]:
            field === 'concept'
              ? value
              : field === 'quantity'
              ? parseFloat(value) || 0
              : parseFloat(value) || 0,
        };
        return nextItems;
      });
    },
    []
  );

  const addItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      { id: String(Date.now()), concept: 'Nuevo concepto', quantity: 1, price: 0 },
    ]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const setSelectedClient = useCallback((client: Client) => {
    setSelectedClientState(client);
    setItems(
      client.servicios && client.servicios.length > 0
        ? [...client.servicios]
        : [{ id: String(Date.now()), concept: 'Servicio de limpieza', quantity: 1, price: 0 }]
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      clients,
      loading,
      error,
      selectedClient,
      items,
      totals,
      setSelectedClient,
      setItems,
      handleItemChange,
      addItem,
      removeItem,
    }),
    [
      clients,
      loading,
      error,
      selectedClient,
      items,
      totals,
      setSelectedClient,
      handleItemChange,
      addItem,
      removeItem,
    ]
  );

  return <InvoiceContext.Provider value={contextValue}>{children}</InvoiceContext.Provider>;
};
