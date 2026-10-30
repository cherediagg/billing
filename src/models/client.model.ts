import { Service } from "./service.model"

export interface Client {
    id: string;
    name: string;
    email: string;
    taxId: string;
    address: string;
    city: string;
    servicios: Service[];
  }
