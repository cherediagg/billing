import { render } from '@testing-library/react';

import Title from './title';

describe('Title', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Title>Test Title</Title>);
    expect(baseElement).toBeTruthy();
  });

  it('should display the children text', () => {
    const { getByText } = render(<Title>Test Title</Title>);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('should apply the default className from the CSS module', () => {
    const { container } = render(<Title>Default Styled Title</Title>);
    const h1 = container.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1?.className).toBe('title'); 
  });

  it('should apply the custom className passed as a prop', () => {
    const { container } = render(
      <Title className="custom-class">Custom Class Title</Title>
    );
    const h1 = container.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1?.className).toMatch(/custom-class/);
  });

  it('should merge the default className with a custom className', () => {
    const { container } = render(
      <Title className="custom-class">Merged Classes Title</Title>
    );
    const h1 = container.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1?.className).toBe('title custom-class');
  });

  it('should handle missing className gracefully', () => {
    const { container } = render(<Title>No Class Name</Title>);
    const h1 = container.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1?.className).toMatch(/title/);
  });
});
