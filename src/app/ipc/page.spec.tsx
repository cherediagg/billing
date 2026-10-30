import { render, screen, fireEvent } from '@testing-library/react';
import Page from './page';
import * as getConfigModule from '../config/hooks/useGetConfig';
import * as updatePricesModule from './hooks/useUpdatePrices';

describe('IPC Page', () => {
  const mockClients = [
    {
      id: '1',
      name: 'Comunidad IPC',
      email: 'ipc@example.com',
      taxId: 'B12345678',
      address: 'Calle IPC 10',
      city: 'Badalona',
      servicios: [
        { id: '1', concept: 'Limpieza', quantity: 1, price: 100 },
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
    jest.spyOn(updatePricesModule, 'useUpdatePrices').mockReturnValue({
      updatePrices: jest.fn(),
      isUpdating: false,
      successMsg: '',
      errorMsg: '',
    });
  });

  it('should render successfully and calculate price rise on input change', () => {
    render(<Page />);
    expect(screen.getByText('Actualizar Precios por IPC')).toBeTruthy();

    const input = screen.getByLabelText(/Porcentaje de subida del IPC/i);
    fireEvent.change(input, { target: { value: '5' } });

    expect(screen.getByText(/105.00 €/)).toBeTruthy();
  });
});
