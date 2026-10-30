import { render } from '@testing-library/react';
import Page from './page';
import * as getConfigModule from '../config/hooks/useGetConfig';

describe('Invoice Page', () => {
  beforeEach(() => {
    jest.spyOn(getConfigModule, 'useGetConfig').mockReturnValue({
      clients: [
        {
          id: '1',
          name: 'Comunidad Centro',
          email: 'centro@example.com',
          taxId: 'B12345678',
          address: 'Calle Mayor 10',
          city: 'Badalona',
          servicios: [],
        },
      ],
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it('should render successfully', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
