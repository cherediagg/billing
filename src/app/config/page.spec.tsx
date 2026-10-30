import { render, screen } from '@testing-library/react';
import Page from './page';
import * as getConfigModule from './hooks/useGetConfig';
import * as saveToFileModule from './hooks/useSaveToFile';

describe('Config Page', () => {
  beforeEach(() => {
    jest.spyOn(getConfigModule, 'useGetConfig').mockReturnValue({
      clients: [
        {
          id: '1',
          name: 'Comunidad Alfa',
          email: 'alfa@example.com',
          taxId: 'B12345678',
          address: 'Calle Alfa 10',
          city: 'Badalona',
          servicios: [],
        },
      ],
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
    jest.spyOn(saveToFileModule, 'useSaveToFile').mockReturnValue({
      saveToFile: jest.fn(),
      isSaving: false,
      successMsg: '',
      errorMsg: '',
    });
  });

  it('should render successfully with client list', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
    expect(screen.getByText('Administrar Empresas y Correos')).toBeTruthy();
  });
});
