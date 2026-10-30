import { Service } from '../models';

export interface InvoiceTotals {
  baseImponible: number;
  iva: number;
  total: number;
}

/**
 * Calculates base price, VAT, and total for an array of invoice service items.
 * Follows SRP: pure calculation without DOM or state side-effects.
 */
export function calculateInvoiceTotals(items: Service[], taxRate = 0.21): InvoiceTotals {
  const baseImponible = items.reduce((sum, item) => {
    const quantity =
      typeof item.quantity === 'number' ? item.quantity : parseFloat(String(item.quantity)) || 0;
    const price =
      typeof item.price === 'number' ? item.price : parseFloat(String(item.price)) || 0;
    return sum + quantity * price;
  }, 0);

  const iva = baseImponible * taxRate;
  const total = baseImponible + iva;

  return {
    baseImponible: parseFloat(baseImponible.toFixed(2)),
    iva: parseFloat(iva.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
}

/**
 * Calculates updated prices based on an IPC percentage increase.
 * Pure function adhering to deterministic domain rules.
 */
export function calculateIpcPriceIncrease(currentPrice: number | string, ipcPercentage: number): number {
  const numericPrice = typeof currentPrice === 'number' ? currentPrice : parseFloat(String(currentPrice)) || 0;
  const newPrice = numericPrice * (1 + ipcPercentage / 100);
  return parseFloat(newPrice.toFixed(2));
}
