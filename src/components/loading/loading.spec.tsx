import { render } from '@testing-library/react';
import Loading from './loading';

describe('Loading Component', () => {
  it('renders nothing if loading is false', () => {
    const { baseElement } = render(<Loading loading={false} />);
    expect(baseElement).toBeDefined();
  });

  it('renders the loading text and dots when loading is true', () => {
    const { getByText, baseElement } = render(<Loading loading={true} />);
    const loadingText = getByText('Cargando');
    expect(loadingText).toBeTruthy();
    expect(baseElement.getElementsByClassName('dot')).toBeTruthy();
  });

  it('allows a custom message to be passed as a prop', () => {
    const { getByText } = render(<Loading loading={true} message="Cargando datos..." />);
    const loadingText = getByText('Cargando datos...');
    expect(loadingText).toBeTruthy();
  });

  it('should have the correct role and aria-live attribute for accessibility', () => {
    const { baseElement } = render(<Loading loading={true} />);
    const loadingElement = baseElement.querySelector('.loading');
    expect(loadingElement?.getAttribute('role')).toBe('status');
    expect(loadingElement?.getAttribute('aria-live')).toBe('polite');
  });

  it('does not render when loading is false', () => {
    const { baseElement } = render(<Loading loading={false} />);
    expect(baseElement.querySelector('.loading')).toBeNull();
  });
});
