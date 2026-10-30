import { renderHook, waitFor } from '@testing-library/react';
import useGetEmails from './useGetEmails';

describe('useGetEmails', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch emails list successfully', async () => {
    const mockEmails = [
      { email: 'vecinos@example.com', file: '2024F101_vecinos.pdf' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEmails,
    });

    const { result } = renderHook(() => useGetEmails());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockEmails);
    expect(result.current.error).toBeNull();
  });
});
