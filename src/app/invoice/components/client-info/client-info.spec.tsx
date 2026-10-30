import { render, screen } from '@testing-library/react';
import ClientInfo from './client-info';
import * as invoiceContextModule from '../../context/invoiceContext';

describe('ClientInfo', () => {
  it('should render successfully when client is selected', () => {
    jest.spyOn(invoiceContextModule, 'useInvoice').mockReturnValue({
      clients: [],
      loading: false,
      error: null,
      selectedClient: {
        id: '1',
        name: 'Comunidad Centro',
        email: 'centro@example.com',
        taxId: 'B12345678',
        address: 'Calle Mayor 10',
        city: 'Badalona',
        servicios: [],
      },
      items: [],
      totals: { baseImponible: 100, iva: 21, total: 121 },
      setSelectedClient: jest.fn(),
      setItems: jest.fn(),
      handleItemChange: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
    });

    render(<ClientInfo />);
    expect(screen.getByText('Comunidad Centro')).toBeTruthy();
    expect(screen.getByText('Calle Mayor 10')).toBeTruthy();
  });

  it('should render null when no client is selected', () => {
    jest.spyOn(invoiceContextModule, 'useInvoice').mockReturnValue({
      clients: [],
      loading: false,
      error: null,
      selectedClient: null,
      items: [],
      totals: { baseImponible: 0, iva: 0, total: 0 },
      setSelectedClient: jest.fn(),
      setItems: jest.fn(),
      handleItemChange: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
    });

    const { container } = render(<ClientInfo />);
    expect(container.firstChild).toBeNull();
  });
});
