import { NextResponse } from 'next/server';
import { defaultClientRepository } from '../../../services';
import { Client } from '../../../models';

export async function GET() {
  try {
    const clients = await defaultClientRepository.getClients();
    return NextResponse.json(clients);
  } catch (err: unknown) {
    console.error('Error en GET /api/config:', err);
    return NextResponse.json(
      { error: 'Error al obtener la lista de clientes' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!Array.isArray(content)) {
      return NextResponse.json(
        { error: 'El contenido debe ser una lista de clientes válida.' },
        { status: 400 }
      );
    }

    await defaultClientRepository.saveClients(content as Client[]);
    return NextResponse.json({ message: 'Todo guardado correctamente' });
  } catch (err: unknown) {
    console.error('Error en POST /api/config:', err);
    return NextResponse.json(
      { error: 'Error al guardar la configuración de clientes.' },
      { status: 500 }
    );
  }
}
