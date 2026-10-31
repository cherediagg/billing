/**
 * @jest-environment node
 */
import fs from 'fs';
import path from 'path';
import { PdfService } from './pdf.service';
import { PDFDocument } from 'pdf-lib';

describe('PdfService', () => {
  describe('getLastInvoiceId', () => {
    it('should return 0 when files list is empty', () => {
      expect(PdfService.getLastInvoiceId([])).toBe(0);
    });

    it('should return the maximum invoice ID regardless of array sorting', () => {
      const files = [
        '2025F1000_Comprop_A.pdf',
        '2025F65_Comprop_B.pdf',
        '2025F1050_Comprop_C.pdf',
        '2025F99_Comprop_D.pdf',
      ];
      expect(PdfService.getLastInvoiceId(files)).toBe(1050);
    });

    it('should ignore filenames that do not match the expected invoice pattern', () => {
      const files = ['random_file.pdf', 'summary.xlsx', 'test.pdf'];
      expect(PdfService.getLastInvoiceId(files)).toBe(0);
    });
  });

  describe('getSourceFiles', () => {
    it('should return empty array if directory does not exist', () => {
      expect(PdfService.getSourceFiles('/non/existent/path')).toEqual([]);
    });

    it('should filter only .pdf files and sort them numerically', () => {
      const testDir = path.join(process.cwd(), 'tmp_test_dir');
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
      fs.writeFileSync(path.join(testDir, '2025F10_test.pdf'), 'content');
      fs.writeFileSync(path.join(testDir, '2025F2_test.pdf'), 'content');
      fs.writeFileSync(path.join(testDir, 'ignored.txt'), 'content');

      const files = PdfService.getSourceFiles(testDir);
      expect(files).toEqual(['2025F2_test.pdf', '2025F10_test.pdf']);

      // Cleanup
      fs.rmSync(testDir, { recursive: true, force: true });
    });
  });

  describe('getSourceDirectory', () => {
    it('should return an object with dirPath and month', () => {
      const result = PdfService.getSourceDirectory();
      expect(result).toHaveProperty('dirPath');
      expect(result).toHaveProperty('month');
      expect(typeof result.dirPath).toBe('string');
      expect(typeof result.month).toBe('string');
    });
  });

  describe('getBillingSummary', () => {
    it('should return summary or error based on existing pdfs', () => {
      const result = PdfService.getBillingSummary();
      expect(result).toBeDefined();
      if (result.summary) {
        expect(result.summary).toHaveProperty('lastBill');
        expect(result.summary).toHaveProperty('total');
        expect(result.summary).toHaveProperty('nextId');
      } else {
        expect(typeof result.error).toBe('string');
      }
    });
  });

  describe('generateInvoices', () => {
    it('should generate invoices concurrently with correct next IDs', async () => {
      // Create a dummy valid PDF file in a mock source directory
      const testBaseDir = path.join(process.cwd(), 'tmp_pdf_test');
      const testSourceDir = path.join(testBaseDir, 'test_month');
      fs.mkdirSync(testSourceDir, { recursive: true });

      const pdfDoc = await PDFDocument.create();
      pdfDoc.addPage([200, 200]);
      const pdfBytes = await pdfDoc.save();
      const samplePdfPath = path.join(testSourceDir, '2024F100_ClientA.pdf');
      fs.writeFileSync(samplePdfPath, pdfBytes);

      jest.spyOn(PdfService as any, 'getSourceDirectory').mockReturnValue({
        dirPath: testSourceDir,
        month: 'test_month',
      });
      jest.spyOn(PdfService as any, 'getPdfsBaseDir').mockReturnValue(testBaseDir);

      const generated = await PdfService.generateInvoices(500, 2);

      expect(generated.length).toBe(1);
      expect(generated[0].id).toBe(500);
      expect(generated[0].name).toMatch(/F500_ClientA\.pdf$/);

      // Cleanup
      fs.rmSync(testBaseDir, { recursive: true, force: true });
      jest.restoreAllMocks();
    });
  });
});
