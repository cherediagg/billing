import { renderHook, waitFor } from '@testing-library/react';
import useFetchBilling from './useFetchBilling';

describe('useFetchBilling', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch and return billing summary data', async () => {
    const mockData = {
      lastBill: '2024F100_edificio.pdf',
      total: 10,
      nextId: 101,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useFetchBilling());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error properly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Carpeta no encontrada' }),
    });

    const { result } = renderHook(() => useFetchBilling());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Carpeta no encontrada');
  });
});
