import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { getMonthYear } from '../lib/dates';
import { GeneratedInvoice } from '../models';

export class ExcelService {
  public static async createSummary(data: GeneratedInvoice[]): Promise<string> {
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

    const outputDir = path.join(process.cwd(), 'pdfs', month);
    if (!fs.existsSync(outputDir)) {
      await fs.promises.mkdir(outputDir, { recursive: true });
    }

    const excelFilePath = path.join(outputDir, `${month}_Invoice_Summary.xlsx`);
    await workbook.xlsx.writeFile(excelFilePath);

    return excelFilePath;
  }
}
