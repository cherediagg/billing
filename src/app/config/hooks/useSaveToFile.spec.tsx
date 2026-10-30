import { renderHook, act } from '@testing-library/react';
import useSaveToFile from './useSaveToFile';

describe('useSaveToFile', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should save valid companies successfully', async () => {
    const mockCompanies = [
      {
        id: '1',
        name: 'Comunidad B',
        email: 'b@example.com',
        taxId: 'H12345678',
        address: 'Calle B 2',
        city: 'Badalona',
        servicios: [],
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Guardado correctamente' }),
    });

    const { result } = renderHook(() => useSaveToFile(mockCompanies));

    let success = false;
    await act(async () => {
      success = await result.current.saveToFile();
    });

    expect(success).toBe(true);
    expect(result.current.successMsg).toContain('Archivo guardado exitosamente.');
    expect(result.current.errorMsg).toBe('');
  });

  it('should reject companies with missing name or email', async () => {
    const invalidCompanies = [
      {
        id: '1',
        name: '',
        email: '',
        taxId: '',
        address: '',
        city: '',
        servicios: [],
      },
    ];

    const { result } = renderHook(() => useSaveToFile(invalidCompanies));

    let success = false;
    await act(async () => {
      success = await result.current.saveToFile();
    });

    expect(success).toBe(false);
    expect(result.current.errorMsg).toBe('Todas las empresas deben tener al menos un nombre y un correo.');
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
