import { render, act } from '@testing-library/react'
import Page from './page'
import UseGetEmails from './hooks/useGetEmails'
import UseSendEmails from './hooks/useSendEmails'

jest.mock('./hooks/useGetEmails')
jest.mock('./hooks/useSendEmails')

jest.mock('src/components', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
  ConsoleFeed: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Error: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Loading: () => <div>Loading...</div>,
  Title: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}))

describe('Page Component', () => {
  const mockEmails = [
    { file: 'file1.pdf', email: 'test1@example.com' },
    { file: 'file2.pdf', email: 'test2@example.com' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state', () => {
    ;(UseGetEmails as jest.Mock).mockReturnValue({ loading: true, data: null, error: null })
    ;(UseSendEmails as jest.Mock).mockReturnValue({ isLoading: false, errorSending: null, processFiles: jest.fn() })

    const { getByText } = render(<Page />)
    expect(getByText('Loading...')).toBeTruthy()
  })

  it('renders error state', () => {
    const errorMessage = 'Error fetching emails'
    ;(UseGetEmails as jest.Mock).mockReturnValue({ loading: false, data: null, error: errorMessage })
    ;(UseSendEmails as jest.Mock).mockReturnValue({ isLoading: false, errorSending: null, processFiles: jest.fn() })

    const { getByText } = render(<Page />)
    expect(getByText(errorMessage)).toBeTruthy()
  })

  it('renders email list and updates state on checkbox change', () => {
    ;(UseGetEmails as jest.Mock).mockReturnValue({ loading: false, data: mockEmails, error: null })
    ;(UseSendEmails as jest.Mock).mockReturnValue({ isLoading: false, errorSending: null, processFiles: jest.fn() })

    const { getByText, getAllByRole } = render(<Page />)
    
    expect(getByText(/Se van a enviar.*emails:/)).toBeTruthy()
    expect(getByText('2')).toBeTruthy() 

    const checkboxes = getAllByRole('checkbox') as HTMLInputElement[]
    expect(checkboxes).toHaveLength(2)
    expect(checkboxes[0].checked).toBeTruthy()
    expect(checkboxes[1].checked).toBeTruthy()


    act(() => {
      checkboxes[0].click()
    })

    expect(getByText('1')).toBeTruthy()
  })

  it('calls processFiles when "Enviar emails" button is clicked', () => {
    const mockProcessFiles = jest.fn();
    
    (UseGetEmails as jest.Mock).mockReturnValue({ loading: false, data: mockEmails, error: null });
    (UseSendEmails as jest.Mock).mockReturnValue({ isLoading: false, errorSending: null, processFiles: mockProcessFiles });

    const { getAllByText } = render(<Page />);
    const sendButtons = getAllByText('Enviar emails');
    expect(sendButtons.length).toBeGreaterThan(0);

    act(() => {
      sendButtons[0].click();
    })

    expect(mockProcessFiles).toHaveBeenCalled();
  })

  it('renders sending state', () => {
    ;(UseGetEmails as jest.Mock).mockReturnValue({ loading: false, data: mockEmails, error: null })
    ;(UseSendEmails as jest.Mock).mockReturnValue({ isLoading: true, errorSending: null, processFiles: jest.fn() })

    const { getByText } = render(<Page />)
    expect(getByText('Procesando...')).toBeTruthy()
  })

  it('renders error sending state', () => {
    const errorSending = {
      reason: 'Error sending emails',
      failedEmails: [{ file: 'file1.pdf', email: 'test1@example.com' }],
    }
    ;(UseGetEmails as jest.Mock).mockReturnValue({ loading: false, data: mockEmails, error: null })
    ;(UseSendEmails as jest.Mock).mockReturnValue({ isLoading: false, errorSending, processFiles: jest.fn() })

    const { getByText } = render(<Page />)
    expect(getByText('Error sending emails')).toBeTruthy()
    expect(getByText('Han fallado los siguientes emails:')).toBeTruthy()
    expect(getByText('file1.pdf - test1@example.com')).toBeTruthy()
  })
})

