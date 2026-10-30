import { NextResponse } from 'next/server';
import { defaultEmailService } from '../../../services';
import { EmailRecipient } from '../../../models';

export async function GET() {
  try {
    const emailsToSend = await defaultEmailService.getPendingEmails();
    return NextResponse.json(emailsToSend);
  } catch (err: unknown) {
    console.error('Error en GET /api/emailing:', err);
    return NextResponse.json(
      { error: 'Error al obtener la lista de correos pendientes.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const emails: EmailRecipient[] = body?.emails || [];

    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'No se especificaron destinatarios para el envío.' },
        { status: 400 }
      );
    }

    const result = await defaultEmailService.sendInvoices(emails);

    if (result.failedEmails && result.failedEmails.length > 0) {
      return NextResponse.json(
        {
          failedEmails: result.failedEmails,
          reason: result.reason || 'Error en el envío de uno o más correos.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: result.message || `${emails.length} emails enviados correctamente`,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Error interno al procesar el envío de correos.';
    console.error('Error en POST /api/emailing:', err);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
