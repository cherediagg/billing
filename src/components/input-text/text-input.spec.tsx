import { render, fireEvent } from '@testing-library/react';
import { TextInput } from './text-input';

describe('TextInput', () => {
  it('renders without crashing', () => {
    const { baseElement } = render(
      <TextInput label="Test Label" id="test-input" />
    );
    expect(baseElement).not.toBeNull();
  });

  it('displays the label and input field', () => {
    const { container } = render(
      <TextInput label="Test Label" id="test-input" />
    );
    const input = container.querySelector('#test-input') as HTMLInputElement;
    expect(input).not.toBeNull();
  });

  it('sets aria attributes correctly', () => {
    const { container } = render(
      <TextInput label="Test Label" id="test-input" required />
    );
    const input = container.querySelector('#test-input') as HTMLInputElement;
    expect(input.getAttribute('aria-required')).toBe('true');
  });

  it('shows required error on blur when field is empty', () => {
    const { container } = render(
      <TextInput label="Test Label" id="test-input" required />
    );
    const input = container.querySelector('#test-input') as HTMLInputElement;
    fireEvent.blur(input);
    const errorMessage = container.querySelector('#test-input-error');
    expect(errorMessage?.textContent).toBe('Campo obligatorio');
  });

  it('does not show error if field is filled on blur', () => {
    const { container } = render(
      <TextInput label="Test Label" id="test-input" required />
    );
    const input = container.querySelector('#test-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Valid Input' } });
    fireEvent.blur(input);
    const errorMessage = container.querySelector('#test-input-error');
    expect(errorMessage).toBeNull();
  });

  it('applies the error style when there is an error', () => {
    const { container } = render(
      <TextInput label="Test Label" id="test-input" required />
    );
    const input = container.querySelector('#test-input') as HTMLInputElement;
    fireEvent.blur(input);
    expect(input.className.includes('errorInput')).toBe(true);
  });

  it('resets the error message when input is corrected', () => {
    const { container } = render(
      <TextInput label="Test Label" id="test-input" required />
    );
    const input = container.querySelector('#test-input') as HTMLInputElement;
    fireEvent.blur(input);
    let errorMessage = container.querySelector('#test-input-error');
    expect(errorMessage?.textContent).toBe('Campo obligatorio');
    fireEvent.change(input, { target: { value: 'Valid Input' } });
    fireEvent.blur(input);
    errorMessage = container.querySelector('#test-input-error');
    expect(errorMessage).toBeNull();
  });
});
