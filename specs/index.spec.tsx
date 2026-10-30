import React from 'react';
import { render } from '@testing-library/react';
import Page from '../src/app/page';
import * as fetchBillingModule from '../src/app/billing/hooks/useFetchBilling';
import * as generateBillsModule from '../src/app/billing/hooks/useGenerateBills';

describe('Root Specs Page', () => {
  beforeEach(() => {
    jest.spyOn(fetchBillingModule, 'useFetchBilling').mockReturnValue({
      data: { lastBill: '2024F100.pdf', nextId: 101, total: 5 },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
    jest.spyOn(generateBillsModule, 'useGenerateBills').mockReturnValue({
      files: [],
      isLoading: false,
      errorGenerate: null,
      processFiles: jest.fn(),
    });
  });

  it('should render successfully', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
