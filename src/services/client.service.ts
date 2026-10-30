import fs from 'fs';
import path from 'path';
import { Client } from '../models';
import { IClientRepository } from './interfaces';

export const DEFAULT_CLIENTS_FILE_PATH = path.join(process.cwd(), 'src/data/clients.json');

const DEFAULT_CLIENTS: Client[] = [
  {
    id: 'd0b347cd-01db-4285-bdae-4bdcb1f06c9b',
    name: 'juan_valera_69',
    email: 'c.heredia87@gmail.com',
    taxId: '654541',
    address: 'jkhkjh',
    city: 'badalona',
    servicios: [
      {
        id: '23aae6a0-ae58-44bb-aaaf-1434975958bd',
        concept: 'Servicio de limpieza',
        quantity: 1,
        price: 71.07,
      },
    ],
  },
  {
    id: '41997de8-8252-422b-8471-b2f64e809158',
    name: 'Marti_Julia_72-74',
    email: 'c.heredia.naranjo@gmail.com',
    taxId: 'H62564430',
    address: 'Martí Julià, 72-74',
    city: '12 Badalona, Barcelona, España',
    servicios: [
      {
        id: 'c8d76fe1-850d-4a67-972d-9da620329b54',
        concept: 'Servicio de limpieza',
        quantity: 1,
        price: 231.70744,
      },
    ],
  },
  {
    id: '2394askdlasj',
    name: 'General_Weyler_154',
    email: 'companya@example.com',
    taxId: 'H60895570',
    address: 'General Weyler, 154',
    city: '08912 Badalona, Barcelona, España',
    servicios: [
      {
        id: '3089247aslkdnasd',
        concept: 'Servicio de limpieza',
        quantity: 1,
        price: 150.89925,
      },
    ],
  },
  {
    id: '23490as8dashdzdasd',
    name: 'Company B',
    email: 'companyb@example.com',
    taxId: 'B12345678',
    address: 'Calle Ejemplo, 123',
    city: '08001 Barcelona, España',
    servicios: [
      {
        id: 'e26ae88e-ffc7-491a-bd2a-a2e611283ee1',
        concept: 'limpieza',
        quantity: 1,
        price: 252.35,
      },
    ],
  },
];

/**
 * File-system based implementation of IClientRepository (DIP & SRP).
 * Supports dependency injection of the file path for testability and flexibility.
 */
export class ClientRepository implements IClientRepository {
  constructor(private readonly filePath: string = DEFAULT_CLIENTS_FILE_PATH) {}

  public async getClients(): Promise<Client[]> {
    try {
      if (!fs.existsSync(this.filePath)) {
        await this.saveClients(DEFAULT_CLIENTS);
        return DEFAULT_CLIENTS;
      }
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : DEFAULT_CLIENTS;
    } catch (error) {
      console.error('Error reading clients configuration:', error);
      return DEFAULT_CLIENTS;
    }
  }

  public async saveClients(clients: Client[]): Promise<void> {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fs.promises.writeFile(
      this.filePath,
      JSON.stringify(clients, null, 2),
      'utf-8'
    );
  }
}

export const defaultClientRepository = new ClientRepository();

/**
 * ClientService facade maintaining backwards compatibility while allowing DIP.
 */
export class ClientService {
  private static repository: IClientRepository = defaultClientRepository;

  public static setRepository(repo: IClientRepository): void {
    this.repository = repo;
  }

  public static async getClients(): Promise<Client[]> {
    return this.repository.getClients();
  }

  public static async saveClients(clients: Client[]): Promise<void> {
    return this.repository.saveClients(clients);
  }
}
