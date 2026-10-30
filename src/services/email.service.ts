import fs from 'fs';
import path from 'path';
import nodemailer, { Transporter } from 'nodemailer';
import { APP_CONFIG } from '../lib/config';
import { getMonthYear, getSpanishMonthName } from '../lib/dates';
import { EmailRecipient, FailedEmail, EmailSendingResult } from '../models';
import { IEmailService, IClientRepository } from './interfaces';
import { defaultClientRepository } from './client.service';

/**
 * Implementation of IEmailService (SRP & DIP).
 * Allows custom transporter provider, client repo, and directory injection.
 */
export class EmailServiceImpl implements IEmailService {
  constructor(
    private readonly clientRepo: IClientRepository = defaultClientRepository,
    private readonly getTransporterFn: () => Transporter = () =>
      nodemailer.createTransport({
        host: APP_CONFIG.smtp.host,
        port: APP_CONFIG.smtp.port,
        secure: APP_CONFIG.smtp.secure,
        auth: {
          user: APP_CONFIG.smtp.user,
          pass: APP_CONFIG.smtp.pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      }),
    private readonly baseDir: string = path.join(process.cwd(), 'pdfs')
  ) {}

  public async getPendingEmails(): Promise<EmailRecipient[]> {
    const { month } = getMonthYear();
    const folderPath = path.join(this.baseDir, month);

    if (!fs.existsSync(folderPath)) {
      return [];
    }

    const files = (await fs.promises.readdir(folderPath)).filter((file) =>
      file.toLowerCase().endsWith('.pdf')
    );

    if (files.length === 0) {
      return [];
    }

    const clients = await this.clientRepo.getClients();
    const emailsToSend: EmailRecipient[] = [];

    for (const file of files) {
      const normalizedFileName = file.toLowerCase();
      const matchedClient = clients.find((client) =>
        normalizedFileName.includes(client.name.toLowerCase().trim())
      );

      if (matchedClient && matchedClient.email) {
        emailsToSend.push({
          email: matchedClient.email,
          file,
        });
      }
    }

    return emailsToSend;
  }

  public async sendInvoices(recipients: EmailRecipient[]): Promise<EmailSendingResult> {
    const { month } = getMonthYear();
    const folderPath = path.join(this.baseDir, month);
    const transporter = this.getTransporterFn();
    const failedEmails: FailedEmail[] = [];
    const currentMonthName = getSpanishMonthName();

    for (const { email, file } of recipients) {
      const filePath = path.join(folderPath, file);

      if (!fs.existsSync(filePath)) {
        failedEmails.push({
          email,
          file,
          error: `El archivo ${file} no existe en el directorio de salida.`,
        });
        continue;
      }

      const mailOptions = {
        from: APP_CONFIG.smtp.from,
        to: email,
        subject: `Factura de ${currentMonthName} - ${APP_CONFIG.company.name}`,
        text: `Hola, le adjuntamos la factura correspondiente al mes de ${currentMonthName}. Un saludo cordial.`,
        attachments: [
          {
            filename: path.basename(filePath),
            path: filePath,
          },
        ],
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido al enviar el correo.';
        console.error(`Error enviando correo a ${email} (${file}):`, error);
        failedEmails.push({
          email,
          file,
          error: errorMsg,
        });
      }
    }

    if (failedEmails.length > 0) {
      return {
        failedEmails,
        reason: `${failedEmails.length} de ${recipients.length} correos no se pudieron enviar.`,
      };
    }

    return {
      message: `${recipients.length} emails enviados correctamente`,
    };
  }
}

export const defaultEmailService = new EmailServiceImpl();

/**
 * EmailService facade for backward compatibility.
 */
export class EmailService {
  private static instance: IEmailService = defaultEmailService;

  public static setInstance(service: IEmailService): void {
    this.instance = service;
  }

  public static async getPendingEmails(): Promise<EmailRecipient[]> {
    return this.instance.getPendingEmails();
  }

  public static async sendInvoices(recipients: EmailRecipient[]): Promise<EmailSendingResult> {
    return this.instance.sendInvoices(recipients);
  }
}
