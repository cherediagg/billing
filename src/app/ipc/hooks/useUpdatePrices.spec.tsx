import { renderHook, act } from '@testing-library/react';
import useUpdatePrices from './useUpdatePrices';

describe('useUpdatePrices', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should update prices successfully', async () => {
    const mockCompanies = [
      {
        id: '1',
        name: 'Comunidad IPC',
        email: 'ipc@example.com',
        taxId: 'H12345678',
        address: 'Calle IPC 10',
        city: 'Badalona',
        servicios: [
          { id: '1', concept: 'Limpieza', quantity: 1, price: 105 },
        ],
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Precios actualizados' }),
    });

    const { result } = renderHook(() => useUpdatePrices());

    let success = false;
    await act(async () => {
      success = await result.current.updatePrices(mockCompanies);
    });

    expect(success).toBe(true);
    expect(result.current.successMsg).toContain('Precios actualizados y guardados exitosamente.');
    expect(result.current.errorMsg).toBe('');
  });
});
