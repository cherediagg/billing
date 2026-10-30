import { render, screen, fireEvent } from '@testing-library/react';
import Index from './page';
import * as fetchBillingModule from './billing/hooks/useFetchBilling';
import * as generateBillsModule from './billing/hooks/useGenerateBills';

jest.mock('./billing/hooks/useFetchBilling');
jest.mock('./billing/hooks/useGenerateBills');

describe('Index Page Component', () => {
  const mockProcessFiles = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    jest.spyOn(fetchBillingModule, 'useFetchBilling').mockReturnValue({
      data: undefined,
      loading: true,
      error: null,
      refetch: jest.fn(),
    });
    jest.spyOn(generateBillsModule, 'useGenerateBills').mockReturnValue({
      files: [],
      isLoading: false,
      errorGenerate: null,
      processFiles: mockProcessFiles,
    });

    render(<Index />);
    expect(screen.queryByText(/Cargando/i)).not.toBeNull();
  });

  it('renders error state', () => {
    jest.spyOn(fetchBillingModule, 'useFetchBilling').mockReturnValue({
      data: undefined,
      loading: false,
      error: 'Error al cargar datos',
      refetch: jest.fn(),
    });
    jest.spyOn(generateBillsModule, 'useGenerateBills').mockReturnValue({
      files: [],
      isLoading: false,
      errorGenerate: null,
      processFiles: mockProcessFiles,
    });

    render(<Index />);
    expect(screen.queryByText(/Error al cargar datos/i)).not.toBeNull();
  });

  it('renders fetched data and allows input modification', () => {
    jest.spyOn(fetchBillingModule, 'useFetchBilling').mockReturnValue({
      data: { lastBill: '2024F100_ejemplo.pdf', nextId: 101, total: 5 },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
    jest.spyOn(generateBillsModule, 'useGenerateBills').mockReturnValue({
      files: [],
      isLoading: false,
      errorGenerate: null,
      processFiles: mockProcessFiles,
    });

    render(<Index />);
    expect(screen.queryByText(/2024F100_ejemplo.pdf/i)).not.toBeNull();
    const input = screen.getByLabelText(/Próxima numeración/i) as HTMLInputElement;
    expect(input.value).toBe('101');

    fireEvent.change(input, { target: { value: '150' } });
    expect(input.value).toBe('150');
  });

  it('displays success messages when files are generated', () => {
    jest.spyOn(fetchBillingModule, 'useFetchBilling').mockReturnValue({
      data: { lastBill: '2024F100_ejemplo.pdf', nextId: 101, total: 5 },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
    jest.spyOn(generateBillsModule, 'useGenerateBills').mockReturnValue({
      files: [
        { name: '2024F101_cliente1.pdf', id: 101 },
        { name: '2024F102_cliente2.pdf', id: 102 },
      ],
      isLoading: false,
      errorGenerate: null,
      processFiles: mockProcessFiles,
    });

    render(<Index />);
    expect(screen.queryByText(/Se van a generar/i)).not.toBeNull();
    expect(screen.queryByText(/2024F101_cliente1.pdf/i)).not.toBeNull();
    expect(screen.queryByText(/2024F102_cliente2.pdf/i)).not.toBeNull();
  });

  it('disables the button when loading or no id is set', () => {
    jest.spyOn(fetchBillingModule, 'useFetchBilling').mockReturnValue({
      data: { lastBill: '2024F100_ejemplo.pdf', nextId: 101, total: 5 },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
    jest.spyOn(generateBillsModule, 'useGenerateBills').mockReturnValue({
      files: [],
      isLoading: true,
      errorGenerate: null,
      processFiles: mockProcessFiles,
    });

    render(<Index />);
    const button = screen.getByRole('button', { name: /Generar facturas/i });
    expect(button.hasAttribute('disabled')).toBe(true);
  });
});
