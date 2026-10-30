import { render, fireEvent } from '@testing-library/react';
import Button from './button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<Button onClick={() => {''}}>Click Me</Button>);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('applies the primary variant by default', () => {
    const { container } = render(<Button onClick={() => {''}}>Primary</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('primary');
  });

  it('applies the correct variant class', () => {
    const { container } = render(
      <Button onClick={() => {''}} variant="error">
        Error Button
      </Button>
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('error');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when isDisabled is true', () => {
    const { container } = render(
      <Button onClick={() => {''}} isDisabled>
        Disabled Button
      </Button>
    );
    const button = container.querySelector('button');
    expect(button?.disabled).toBeTruthy();
  });

  it('handles custom className correctly', () => {
    const { container } = render(
      <Button onClick={() => {''}} className="custom-class">
        Custom Class Button
      </Button>
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('custom-class');
  });
});
