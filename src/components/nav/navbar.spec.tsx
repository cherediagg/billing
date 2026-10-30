import { render, screen } from '@testing-library/react';
import Navbar from './navbar';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navbar', () => {
  it('should render successfully with default items', () => {
    const { baseElement } = render(<Navbar />);
    expect(baseElement).toBeTruthy();
    expect(screen.getByText('Generador')).toBeTruthy();
  });

  it('should render custom menu items', () => {
    const customItems = [
      { name: 'Inicio', href: '/' },
      { name: 'Servicios', href: '/servicios' },
    ];
    render(<Navbar menuItems={customItems} />);
    expect(screen.getByText('Inicio')).toBeTruthy();
    expect(screen.getByText('Servicios')).toBeTruthy();
  });
});
