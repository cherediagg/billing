import { render, fireEvent  } from '@testing-library/react';

import Error from './error';

describe('Error', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Error message={''}>Algo</Error>);
    expect(baseElement).toBeTruthy();
  });

  it('should render the error message when message is provided', () => {
    const { getByRole } = render(<Error message="An error occurred">Error content</Error>);
    const alert = getByRole('alert');
    expect(alert).toBeTruthy();
  });

  it('should not render anything when message is null', () => {
    const { queryByRole } = render(<Error message={null}>Error content</Error>);
    const alert = queryByRole('alert');
    expect(alert).toBeNull();
  });

  it('should call setIsVisible(false) when the close button is clicked', () => {
    const { getByRole, queryByRole } = render(<Error message="An error occurred">Error content</Error>);
    const closeButton = getByRole('button', { name: 'Cerrar mensaje de error' });
    fireEvent.click(closeButton);
    const alert = queryByRole('alert');
    expect(alert).toBeNull();
  });

  it('should update visibility when the message changes', () => {
    const { rerender, getByRole, queryByRole } = render(<Error message={null}>Error content</Error>);
    let alert = queryByRole('alert');
    expect(alert).toBeNull();

    rerender(<Error message="New error">Error content</Error>);
    alert = getByRole('alert');
    expect(alert).toBeTruthy();

    rerender(<Error message={null}>Error content</Error>);
    alert = queryByRole('alert');
    expect(alert).toBeNull();
  });
});
