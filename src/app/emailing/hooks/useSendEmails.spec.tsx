import { renderHook, act } from '@testing-library/react';
import useSendEmails from './useSendEmails';

describe('useSendEmails', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should send emails successfully', async () => {
    const mockRecipients = [
      { email: 'vecinos@example.com', file: '2024F101_vecinos.pdf' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: '1 emails enviados correctamente' }),
    });

    const { result } = renderHook(() => useSendEmails(mockRecipients));

    await act(async () => {
      await result.current.processFiles();
    });

    expect(result.current.files).toBe('1 emails enviados correctamente');
    expect(result.current.errorSending).toBeNull();
  });

  it('should do nothing if email list is empty', async () => {
    const { result } = renderHook(() => useSendEmails([]));

    await act(async () => {
      await result.current.processFiles();
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
