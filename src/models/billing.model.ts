export interface BillingSummary {
  lastBill: string;
  total: number;
  nextId: number;
}

export interface GeneratedInvoice {
  name: string;
  id: number;
}

export interface BillingGenerationRequest {
  billNumber: number;
}
