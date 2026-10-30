import { Client, BillingSummary, GeneratedInvoice, EmailRecipient, EmailSendingResult } from '../../models';

export interface IClientRepository {
  getClients(): Promise<Client[]>;
  saveClients(clients: Client[]): Promise<void>;
}

export interface IPdfService {
  getSourceDirectory(): { dirPath: string; month: string };
  getSourceFiles(dirPath: string): string[];
  getLastInvoiceId(files: string[]): number;
  getBillingSummary(): { summary: BillingSummary | null; error?: string };
  generateInvoices(startingBillNumber: number): Promise<GeneratedInvoice[]>;
}

export interface IExcelService {
  createSummary(data: GeneratedInvoice[]): Promise<string>;
}

export interface IEmailService {
  getPendingEmails(): Promise<EmailRecipient[]>;
  sendInvoices(recipients: EmailRecipient[]): Promise<EmailSendingResult>;
}
