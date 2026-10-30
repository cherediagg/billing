import { renderHook, waitFor } from '@testing-library/react';
import useGetConfig from './useGetConfig';

describe('useGetConfig', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch clients configuration successfully', async () => {
    const mockClients = [
      {
        id: '1',
        name: 'Comunidad A',
        email: 'a@example.com',
        taxId: 'H12345678',
        address: 'Calle A 1',
        city: 'Badalona',
        servicios: [],
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockClients,
    });

    const { result } = renderHook(() => useGetConfig());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.clients).toEqual(mockClients);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch failure properly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const { result } = renderHook(() => useGetConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Error al obtener la configuración de clientes');
  });
});
