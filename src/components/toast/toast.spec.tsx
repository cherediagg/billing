import { render, act } from '@testing-library/react';
import Toast from './toast';

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('should render successfully', () => {
    const { baseElement } = render(<Toast message="creado" />);
    expect(baseElement).toBeTruthy();
  });

  it('should render the toast with the correct message', () => {
    const { getByText } = render(<Toast message="Test Message" duration={3000} />);
    expect(getByText('Test Message')).toBeTruthy();
  });

  it('should render the icon', () => {
    const { container } = render(<Toast message="Test Message" duration={3000} />);
    const icon = container.querySelector('.icon');
    expect(icon).toBeTruthy();
  });

  it('should hide the toast after the specified duration', () => {
    const { queryByText } = render(<Toast message="Test Message" duration={1000} />);
    expect(queryByText('Test Message')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(queryByText('Test Message')).toBeNull();
  });

  it('should not render anything if no message is provided', () => {
    const { container } = render(<Toast message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should clear the timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount } = render(<Toast message="Test Message" duration={3000} />);
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    clearTimeoutSpy.mockRestore();
  });

  it('should set aria attributes for accessibility', () => {
    const { getByRole } = render(<Toast message="Accessible Toast" duration={3000} />);
    const toast = getByRole('alert');
    expect(toast.getAttribute('aria-live')).toBe('polite');
  });
});
