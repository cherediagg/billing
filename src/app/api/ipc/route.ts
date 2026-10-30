import { NextResponse } from 'next/server';
import { ClientService } from '../../../services';
import { Client } from '../../../models';

export async function GET() {
  try {
    const clients = await ClientService.getClients();
    return NextResponse.json(clients);
  } catch (err: any) {
    console.error('Error en GET /api/ipc:', err);
    return NextResponse.json(
      { error: 'Error al obtener la lista de clientes para IPC' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!Array.isArray(content)) {
      return NextResponse.json(
        { error: 'El contenido debe ser una lista de clientes con precios actualizados.' },
        { status: 400 }
      );
    }

    await ClientService.saveClients(content as Client[]);
    return NextResponse.json({ message: 'Precios de IPC guardados correctamente' });
  } catch (err: any) {
    console.error('Error en POST /api/ipc:', err);
    return NextResponse.json(
      { error: 'Error al guardar los precios actualizados por IPC.' },
      { status: 500 }
    );
  }
}
