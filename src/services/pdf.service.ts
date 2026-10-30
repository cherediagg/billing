import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import { getLastMonthYear, getMonthYear } from '../lib/dates';
import { BillingSummary, GeneratedInvoice } from '../models';

export class PdfService {
  private static getPdfsBaseDir(): string {
    return path.join(process.cwd(), 'pdfs');
  }

  public static getSourceDirectory(): { dirPath: string; month: string } {
    const { month } = getLastMonthYear();
    const sourceDir = path.join(this.getPdfsBaseDir(), month);

    if (fs.existsSync(sourceDir)) {
      return { dirPath: sourceDir, month };
    }

    // Fallback: search any existing directory in pdfs/ if default last month is missing
    const baseDir = this.getPdfsBaseDir();
    if (fs.existsSync(baseDir)) {
      const subdirs = fs
        .readdirSync(baseDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

      if (subdirs.length > 0) {
        return { dirPath: path.join(baseDir, subdirs[0]), month: subdirs[0] };
      }
    }

    return { dirPath: sourceDir, month };
  }

  public static getSourceFiles(dirPath: string): string[] {
    if (!fs.existsSync(dirPath)) {
      return [];
    }

    return fs
      .readdirSync(dirPath)
      .filter((file) => file.endsWith('.pdf'))
      .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
  }

  public static getLastInvoiceId(files: string[]): number {
    if (files.length === 0) return 0;
    const regex = /\d{4}F(\d+)/i;
    const filename = files[files.length - 1];
    const match = filename.match(regex);
    return match ? parseInt(match[1], 10) : 0;
  }

  public static getBillingSummary(): { summary: BillingSummary | null; error?: string } {
    const { dirPath, month } = this.getSourceDirectory();

    if (!fs.existsSync(dirPath)) {
      return {
        summary: null,
        error: `Carpeta del mes ${month} no encontrada en pdfs/${month}. Por favor créala con las facturas base.`,
      };
    }

    const files = this.getSourceFiles(dirPath);
    if (files.length === 0) {
      return {
        summary: null,
        error: `No se encontraron archivos .pdf en la carpeta pdfs/${month}.`,
      };
    }

    const lastId = this.getLastInvoiceId(files);

    return {
      summary: {
        lastBill: files[files.length - 1],
        total: files.length,
        nextId: lastId + 1,
      },
    };
  }

  public static async generateInvoices(startingBillNumber: number): Promise<GeneratedInvoice[]> {
    const { dirPath } = this.getSourceDirectory();
    const files = this.getSourceFiles(dirPath);

    if (files.length === 0) {
      throw new Error('No se encontraron archivos PDF de origen para procesar.');
    }

    const currentMonthYear = getMonthYear();
    const outputDir = path.join(this.getPdfsBaseDir(), currentMonthYear.month);

    if (!fs.existsSync(outputDir)) {
      await fs.promises.mkdir(outputDir, { recursive: true });
    }

    let id = startingBillNumber;
    const generated: GeneratedInvoice[] = [];

    for (const file of files) {
      const sourceFilePath = path.join(dirPath, file);
      const newFileName = file.replace(/^(\d{4})F\d+_/i, `${currentMonthYear.year}F${id}_`);
      const targetFilePath = path.join(outputDir, newFileName);

      await this.updatePdfFile(sourceFilePath, targetFilePath, id, currentMonthYear);

      generated.push({ name: newFileName, id });
      id += 1;
    }

    return generated;
  }

  private static async updatePdfFile(
    sourcePath: string,
    targetPath: string,
    invoiceNumber: number,
    currentMonthYear: { month: string; year: number }
  ): Promise<void> {
    const { month, year } = currentMonthYear;
    const pdfBuffer = await fs.promises.readFile(sourcePath);
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();

      // Número de factura
      page.drawRectangle({
        x: width - 100,
        y: height - 178,
        width: 100,
        height: 19,
        color: rgb(1, 1, 1),
      });

      page.drawText(`${year}F${invoiceNumber}`, {
        x: width - 100,
        y: height - 178,
        size: 12,
        color: rgb(0, 0, 0),
      });

      // Fecha de emisión
      page.drawRectangle({
        x: width - 100,
        y: height - 198,
        width: 80,
        height: 19,
        color: rgb(1, 1, 1),
      });

      page.drawText(`20/${month}/${year}`, {
        x: width - 100,
        y: height - 198,
        size: 11,
        color: rgb(0, 0, 0),
      });

      // Fecha de vencimiento
      page.drawRectangle({
        x: width - 100,
        y: height - 218,
        width: 80,
        height: 19,
        color: rgb(1, 1, 1),
      });

      page.drawText(`28/${month}/${year}`, {
        x: width - 100,
        y: height - 218,
        size: 11,
        color: rgb(0, 0, 0),
      });
    }

    const updatedPdfBytes = await pdfDoc.save();
    await fs.promises.writeFile(targetPath, updatedPdfBytes);
  }
}
