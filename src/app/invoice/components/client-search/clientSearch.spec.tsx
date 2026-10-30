import { render, screen, fireEvent } from '@testing-library/react';
import ClientSearch from './clientSearch';

describe('ClientSearch', () => {
  const mockClients = [
    {
      id: '1',
      name: 'Comunidad Norte',
      email: 'norte@example.com',
      taxId: 'H11111111',
      address: 'Calle Norte 1',
      city: 'Badalona',
      servicios: [],
    },
    {
      id: '2',
      name: 'Comunidad Sur',
      email: 'sur@example.com',
      taxId: 'H22222222',
      address: 'Avenida Sur 5',
      city: 'Barcelona',
      servicios: [],
    },
  ];

  it('should render successfully with default props', () => {
    const { baseElement } = render(<ClientSearch />);
    expect(baseElement).toBeTruthy();
  });

  it('should render and filter clients on search input', () => {
    const mockSelect = jest.fn();
    render(
      <ClientSearch
        clients={mockClients}
        onSelectClient={mockSelect}
        selectedClient={mockClients[0]}
      />
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'Sur' } });

    expect(screen.getByText('Comunidad Sur')).toBeTruthy();
    fireEvent.click(screen.getByText('Comunidad Sur'));
    expect(mockSelect).toHaveBeenCalledWith(mockClients[1]);
  });
});
