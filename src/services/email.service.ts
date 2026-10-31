import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { APP_CONFIG } from '../lib/config';
import { getMonthYear, getSpanishMonthName } from '../lib/dates';
import { ClientService } from './client.service';
import { EmailRecipient, FailedEmail, EmailSendingResult } from '../models';

export class EmailService {
  private static getTransporter() {
    return nodemailer.createTransport({
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
    });
  }

  public static async getPendingEmails(): Promise<EmailRecipient[]> {
    const { month } = getMonthYear();
    const folderPath = path.join(process.cwd(), 'pdfs', month);

    if (!fs.existsSync(folderPath)) {
      return [];
    }

    const files = (await fs.promises.readdir(folderPath)).filter((file) =>
      file.toLowerCase().endsWith('.pdf')
    );

    if (files.length === 0) {
      return [];
    }

    const clients = await ClientService.getClients();
    const emailsToSend: EmailRecipient[] = [];

    const preparedClients = clients
      .filter((client) => client.name && client.email)
      .map((client) => ({
        email: client.email,
        trimmedLowerName: client.name.toLowerCase().trim(),
      }));

    for (const file of files) {
      const normalizedFileName = file.toLowerCase();
      const matchedClient = preparedClients.find((client) =>
        normalizedFileName.includes(client.trimmedLowerName)
      );

      if (matchedClient) {
        emailsToSend.push({
          email: matchedClient.email,
          file,
        });
      }
    }

    return emailsToSend;
  }

  public static async sendInvoices(
    recipients: EmailRecipient[]
  ): Promise<EmailSendingResult> {
    const { month } = getMonthYear();
    const folderPath = path.join(process.cwd(), 'pdfs', month);
    const transporter = this.getTransporter();
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
      const reason = failedEmails[0]?.error
        ? String(failedEmails[0].error)
        : 'Error durante el envío de algunos correos.';
      return {
        failedEmails,
        reason,
      };
    }

    return {
      message: `${recipients.length} emails enviados correctamente`,
    };
  }
}
