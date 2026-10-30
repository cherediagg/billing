import { renderHook, act } from '@testing-library/react';
import useGenerateBills from './useGenerateBills';

describe('useGenerateBills', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should generate bills successfully', async () => {
    const mockResponse = [
      { name: '2024F101_edificio.pdf', id: 101 },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useGenerateBills(101));

    await act(async () => {
      await result.current.processFiles();
    });

    expect(result.current.files).toEqual(mockResponse);
    expect(result.current.errorGenerate).toBeNull();
  });

  it('should prevent processing if billNumber is invalid', async () => {
    const { result } = renderHook(() => useGenerateBills(0));

    await act(async () => {
      await result.current.processFiles();
    });

    expect(result.current.errorGenerate).toBe('Por favor introduce un número de factura válido');
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
