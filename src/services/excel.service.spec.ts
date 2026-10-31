import fs from 'fs';
import path from 'path';
import { ExcelService } from './excel.service';
import { GeneratedInvoice } from '../models';

describe('ExcelService', () => {
  it('should generate an Excel file summary correctly', async () => {
    const invoices: GeneratedInvoice[] = [
      { id: 101, name: '2026F101_Client1.pdf' },
      { id: 102, name: '2026F102_Client2.pdf' },
    ];

    const filePath = await ExcelService.createSummary(invoices);
    expect(fs.existsSync(filePath)).toBe(true);
    expect(path.extname(filePath)).toBe('.xlsx');

    // Clean up created summary file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
});
