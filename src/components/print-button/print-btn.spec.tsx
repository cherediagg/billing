import { render, fireEvent } from '@testing-library/react';
import PrintBtn from './print-btn';

describe('PrintBtn', () => {
  it('should render the print button with the correct aria-label', () => {
    const { getByLabelText } = render(<PrintBtn />);
    const printButton = getByLabelText('Imprimir factura');
    expect(printButton).toBeTruthy();
    expect(printButton.getAttribute('aria-label')).toBe('Imprimir factura');
  });

  it('should trigger window.print() when clicked', () => {
    const printMock = jest.spyOn(window, 'print').mockImplementation(jest.fn());
    const { getByLabelText } = render(<PrintBtn />);
    const printButton = getByLabelText('Imprimir factura');
    fireEvent.click(printButton);
    expect(printMock).toHaveBeenCalled();
    printMock.mockRestore();
  });

  it('should trigger window.print() when pressing Enter key', () => {
    const printMock = jest.spyOn(window, 'print').mockImplementation(jest.fn());
    const { getByLabelText } = render(<PrintBtn />);
    const printButton = getByLabelText('Imprimir factura');
    fireEvent.keyDown(printButton, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(printMock).toHaveBeenCalled();
    printMock.mockRestore();
  });

  it('should have the correct role and tabIndex', () => {
    const { getByLabelText } = render(<PrintBtn />);
    const printButton = getByLabelText('Imprimir factura');
    expect(printButton.getAttribute('tabindex')).toBe('0');
  });

  it('should render the SVG icon inside the button', () => {
    const { container } = render(<PrintBtn />);
    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toBeTruthy();
    expect(svgIcon?.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
    expect(svgIcon?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svgIcon?.getAttribute('fill')).toBe('#000000');
  });
});
