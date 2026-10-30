import { render } from '@testing-library/react';

import ConsoleFeed from './console-feed';

describe('ConsoleFeed', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ConsoleFeed> Algo </ConsoleFeed>);
    expect(baseElement).toBeTruthy();
  });
});
