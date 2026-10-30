import { render } from '@testing-library/react';

import PayMethod from './pay-method';

describe('PayMethod', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PayMethod />);
    expect(baseElement).toBeTruthy();
  });
});
