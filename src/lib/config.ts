export const APP_CONFIG = {
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || 'c.heredia87@gmail.com',
    pass: process.env.SMTP_PASS || 'lajt eerw uzjt lybq',
    from: process.env.SMTP_FROM || '"Fernet Limpiezas" <jdiego@limpiezasfernet.com>',
  },
  company: {
    name: 'Fernet Balona 10 S.L',
    taxId: 'B65220428',
    address: 'Av. Alfonso XIII 107-109',
    city: '08912 Badalona, Barcelona, España',
    phone: '647825663',
    bankAccount: 'ES52 0081 0048 0900 0109 4112',
    defaultTaxRate: 21,
  },
};
