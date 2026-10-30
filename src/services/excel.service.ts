import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { getMonthYear } from '../lib/dates';
import { GeneratedInvoice } from '../models';
import { IExcelService } from './interfaces';

/**
 * Excel reporting service adhering to IExcelService (SRP & DIP).
 */
export class ExcelServiceImpl implements IExcelService {
  constructor(private readonly baseDir: string = path.join(process.cwd(), 'pdfs')) {}

  public async createSummary(data: GeneratedInvoice[]): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Resumen Facturas');
    const { month, year } = getMonthYear();

    worksheet.columns = [
      { header: 'Comunidad', key: 'community', width: 50 },
      { header: 'Numeración', key: 'numeration', width: 20 },
      { header: 'Enviado', key: 'enviado', width: 15 },
    ];

    data.forEach((item) => {
      worksheet.addRow({
        community: item.name,
        numeration: `${year}F${item.id}`,
        enviado: 'No',
      });
    });

    const outputDir = path.join(this.baseDir, month);
    if (!fs.existsSync(outputDir)) {
      await fs.promises.mkdir(outputDir, { recursive: true });
    }

    const excelFilePath = path.join(outputDir, `${month}_Invoice_Summary.xlsx`);
    await workbook.xlsx.writeFile(excelFilePath);

    return excelFilePath;
  }
}

export const defaultExcelService = new ExcelServiceImpl();

/**
 * ExcelService facade for backward compatibility.
 */
export class ExcelService {
  private static instance: IExcelService = defaultExcelService;

  public static setInstance(service: IExcelService): void {
    this.instance = service;
  }

  public static async createSummary(data: GeneratedInvoice[]): Promise<string> {
    return this.instance.createSummary(data);
  }
}
