import { render, screen } from '@testing-library/react';
import InvoiceItems from './invoice-items';
import * as invoiceContextModule from '../../context/invoiceContext';

describe('InvoiceItems', () => {
  it('should render items table successfully', () => {
    jest.spyOn(invoiceContextModule, 'useInvoice').mockReturnValue({
      clients: [],
      loading: false,
      error: null,
      selectedClient: null,
      items: [
        { id: '1', concept: 'Mantenimiento mensual', quantity: 1, price: 150 },
      ],
      totals: { baseImponible: 150, iva: 31.5, total: 181.5 },
      setSelectedClient: jest.fn(),
      setItems: jest.fn(),
      handleItemChange: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
    });

    render(<InvoiceItems />);
    expect(screen.getByText('Mantenimiento mensual')).toBeTruthy();
    expect(screen.getByText('150.00')).toBeTruthy();
  });
});
