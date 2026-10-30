import { render } from '@testing-library/react';

import SearchInput from './search-input';

describe('SearchInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SearchInput onSearch={jest.fn()} />);
    expect(baseElement).toBeTruthy();
  });
});
