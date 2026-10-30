import { render, screen } from '@testing-library/react';
import TotalPrice from './total-price';
import * as invoiceContextModule from '../../context/invoiceContext';

describe('TotalPrice', () => {
  it('should render totals successfully', () => {
    jest.spyOn(invoiceContextModule, 'useInvoice').mockReturnValue({
      clients: [],
      loading: false,
      error: null,
      selectedClient: null,
      items: [],
      totals: { baseImponible: 200, iva: 42, total: 242 },
      setSelectedClient: jest.fn(),
      setItems: jest.fn(),
      handleItemChange: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
    });

    render(<TotalPrice />);
    expect(screen.getByText('200.00 €')).toBeTruthy();
    expect(screen.getByText('42.00 €')).toBeTruthy();
    expect(screen.getByText('242.00 €')).toBeTruthy();
  });
});
