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
    const baseDir = this.getPdfsBaseDir();
    const paddedMonth = month.padStart(2, '0');
    const unpaddedMonth = String(parseInt(month, 10));

    // Try canonical month format, padded or unpadded
    const candidateDirs = [month, paddedMonth, unpaddedMonth];
    for (const candidate of candidateDirs) {
      const sourceDir = path.join(baseDir, candidate);
      if (fs.existsSync(sourceDir)) {
        return { dirPath: sourceDir, month: candidate };
      }
    }

    // Fallback: search existing directories in pdfs/ ordered descending by month number
    if (fs.existsSync(baseDir)) {
      const subdirs = fs
        .readdirSync(baseDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort((a, b) => {
          const numA = parseInt(a, 10);
          const numB = parseInt(b, 10);
          if (!isNaN(numA) && !isNaN(numB)) {
            return numB - numA;
          }
          return b.localeCompare(a, 'es', { numeric: true });
        });

      if (subdirs.length > 0) {
        return { dirPath: path.join(baseDir, subdirs[0]), month: subdirs[0] };
      }
    }

    return { dirPath: path.join(baseDir, month), month };
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
    if (!files || files.length === 0) return 0;
    const regex = /\d{4}F(\d+)/i;
    let maxId = 0;

    for (const filename of files) {
      const match = filename.match(regex);
      if (match) {
        const id = parseInt(match[1], 10);
        if (!isNaN(id) && id > maxId) {
          maxId = id;
        }
      }
    }

    return maxId;
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

  public static async generateInvoices(
    startingBillNumber: number,
    concurrency = 5
  ): Promise<GeneratedInvoice[]> {
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

    // Precalculate file mapping to guarantee deterministic numbering
    const invoiceItems = files.map((file, index) => {
      const id = startingBillNumber + index;
      const newFileName = file.replace(/^(\d{4})F\d+_/i, `${currentMonthYear.year}F${id}_`);
      const sourceFilePath = path.join(dirPath, file);
      const targetFilePath = path.join(outputDir, newFileName);
      return {
        id,
        name: newFileName,
        sourceFilePath,
        targetFilePath,
      };
    });

    // Process concurrently in chunks to optimize I/O and CPU without overloading memory
    const chunkSize = Math.max(1, concurrency);
    for (let i = 0; i < invoiceItems.length; i += chunkSize) {
      const chunk = invoiceItems.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map((item) =>
          this.updatePdfFile(item.sourceFilePath, item.targetFilePath, item.id, currentMonthYear)
        )
      );
    }

    return invoiceItems.map((item) => ({ name: item.name, id: item.id }));
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
