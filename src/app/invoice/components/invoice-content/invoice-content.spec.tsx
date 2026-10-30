import { render, screen } from '@testing-library/react';
import InvoiceContent from './invoice-content';
import * as invoiceContextModule from '../../context/invoiceContext';

describe('InvoiceContent', () => {
  it('should render successfully with invoice data', () => {
    jest.spyOn(invoiceContextModule, 'useInvoice').mockReturnValue({
      clients: [
        {
          id: '1',
          name: 'Comunidad Centro',
          email: 'centro@example.com',
          taxId: 'B12345678',
          address: 'Calle Mayor 10',
          city: 'Badalona',
          servicios: [],
        },
      ],
      loading: false,
      error: null,
      selectedClient: {
        id: '1',
        name: 'Comunidad Centro',
        email: 'centro@example.com',
        taxId: 'B12345678',
        address: 'Calle Mayor 10',
        city: 'Badalona',
        servicios: [
          { id: '1', concept: 'Limpieza escaleras', quantity: 1, price: 100 },
        ],
      },
      items: [
        { id: '1', concept: 'Limpieza escaleras', quantity: 1, price: 100 },
      ],
      totals: { baseImponible: 100, iva: 21, total: 121 },
      setSelectedClient: jest.fn(),
      setItems: jest.fn(),
      handleItemChange: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
    });

    render(<InvoiceContent />);
    expect(screen.getByText('Comunidad Centro')).toBeTruthy();
    expect(screen.getByText('Limpieza escaleras')).toBeTruthy();
  });
});
