import { render } from '@testing-library/react';
import InvoiceInfo from './invoice-info';

describe('InvoiceInfo', () => {
  it('should render the invoice number with the current year', () => {
    const { getByText } = render(<InvoiceInfo />);
    const currentYear = new Date().getFullYear();
    const invoiceNumber = getByText(`${currentYear}F635`);
    expect(invoiceNumber).toBeTruthy();
  });

  it('should display the correct current date in the format dd/mm/yyyy', () => {
    const { getByText } = render(<InvoiceInfo />);
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const currentDay = '20';

    const currentDate = getByText(`${currentDay}/${currentMonth}/${currentYear}`);
    expect(currentDate).toBeTruthy();
  });

  it('should display the correct due date in the format dd/mm/yyyy', () => {
    const { getByText } = render(<InvoiceInfo />);
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const dueDay = '28';

    const dueDate = getByText(`${dueDay}/${currentMonth}/${currentYear}`);
    expect(dueDate).toBeTruthy();
  });

  it('should render the static text "FACTURA:"', () => {
    const { getByText } = render(<InvoiceInfo />);
    const staticText = getByText('FACTURA:');
    expect(staticText).toBeTruthy();
  });

  it('should render the labels correctly', () => {
    const { getByText } = render(<InvoiceInfo />);
    expect(getByText('Nº de factura:')).toBeTruthy();
    expect(getByText('Fecha:')).toBeTruthy();
    expect(getByText('Vencimiento:')).toBeTruthy();
  });
});
