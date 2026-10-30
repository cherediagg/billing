import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { InvoiceProvider, useInvoice } from './invoiceContext';
import * as getConfigModule from '../../config/hooks/useGetConfig';

describe('InvoiceContext', () => {
  const mockClients = [
    {
      id: '1',
      name: 'Cliente Test',
      email: 'test@example.com',
      taxId: 'B12345678',
      address: 'Calle Test 1',
      city: 'Barcelona',
      servicios: [
        { id: '10', concept: 'Limpieza', quantity: 2, price: 50 },
      ],
    },
  ];

  beforeEach(() => {
    jest.spyOn(getConfigModule, 'useGetConfig').mockReturnValue({
      clients: mockClients,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it('should provide default client and calculate totals properly', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <InvoiceProvider>{children}</InvoiceProvider>
    );

    const { result } = renderHook(() => useInvoice(), { wrapper });

    expect(result.current.selectedClient?.name).toBe('Cliente Test');
    expect(result.current.totals.baseImponible).toBe(100);
    expect(result.current.totals.iva).toBe(21);
    expect(result.current.totals.total).toBe(121);
  });

  it('should update totals when an item is modified', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <InvoiceProvider>{children}</InvoiceProvider>
    );

    const { result } = renderHook(() => useInvoice(), { wrapper });

    act(() => {
      result.current.handleItemChange(0, 'price', '100');
    });

    expect(result.current.totals.baseImponible).toBe(200);
    expect(result.current.totals.iva).toBe(42);
    expect(result.current.totals.total).toBe(242);
  });
});
