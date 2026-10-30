import { NextResponse } from 'next/server';
import { PdfService, ExcelService } from '../../../services';

export async function GET() {
  try {
    const { summary, error } = PdfService.getBillingSummary();

    if (error || !summary) {
      return NextResponse.json({ error: error || 'No se encontraron facturas' }, { status: 404 });
    }

    return NextResponse.json(summary);
  } catch (err: any) {
    console.error('Error en GET /api/billing:', err);
    return NextResponse.json(
      { error: err?.message || 'Error interno al obtener datos de facturación' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const billNumber = Number(body?.billNumber);

    if (isNaN(billNumber) || billNumber <= 0) {
      return NextResponse.json(
        { error: 'El número de factura debe ser un número positivo válido.' },
        { status: 400 }
      );
    }

    const data = await PdfService.generateInvoices(billNumber);
    await ExcelService.createSummary(data);

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Error en POST /api/billing:', err);
    return NextResponse.json(
      { error: err?.message || 'Error al generar las facturas y el resumen.' },
      { status: 500 }
    );
  }
}
