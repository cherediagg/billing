import { calculateInvoiceTotals, calculateIpcPriceIncrease } from './calculations';
import { Service } from '../models';

describe('Calculations domain utility (SRP)', () => {
  describe('calculateInvoiceTotals', () => {
    it('should correctly calculate base, IVA, and total for empty items', () => {
      const result = calculateInvoiceTotals([]);
      expect(result).toEqual({
        baseImponible: 0,
        iva: 0,
        total: 0,
      });
    });

    it('should correctly calculate base, IVA (21%), and total for multiple items', () => {
      const items: Service[] = [
        { id: '1', concept: 'Servicio Limpieza', quantity: 1, price: 100 },
        { id: '2', concept: 'Cristales', quantity: 2, price: 50 },
      ];

      const result = calculateInvoiceTotals(items);

      expect(result.baseImponible).toBe(200);
      expect(result.iva).toBe(42);
      expect(result.total).toBe(242);
    });

    it('should handle string quantities and prices safely with proper rounding', () => {
      const items: Service[] = [
        { id: '1', concept: 'Servicio Especial', quantity: '3', price: '33.33' },
      ];

      const result = calculateInvoiceTotals(items);

      expect(result.baseImponible).toBe(99.99);
      expect(result.iva).toBe(21.0);
      expect(result.total).toBe(120.99);
    });
  });

  describe('calculateIpcPriceIncrease', () => {
    it('should calculate IPC price rise correctly', () => {
      const updated = calculateIpcPriceIncrease(100, 5);
      expect(updated).toBe(105);
    });

    it('should handle decimals properly with 2 fixed decimal places', () => {
      const updated = calculateIpcPriceIncrease(71.07, 3.25);
      expect(updated).toBe(73.38);
    });

    it('should handle string input for price', () => {
      const updated = calculateIpcPriceIncrease('200', 10);
      expect(updated).toBe(220);
    });
  });
});
