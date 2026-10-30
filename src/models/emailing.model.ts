export interface EmailRecipient {
  email: string;
  file: string;
}

export interface FailedEmail {
  email: string;
  file: string;
  error?: unknown;
}

export interface EmailSendingResult {
  message?: string;
  failedEmails?: FailedEmail[];
  reason?: string;
}
