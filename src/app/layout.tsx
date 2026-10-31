import type { Metadata, Viewport } from 'next';
import Navbar from 'src/components/nav/navbar';
import './global.css';

export const metadata: Metadata = {
  title: 'eBilling - Sistema de Facturación y Clientes',
  description: 'Gestión automatizada de facturas, generación de PDF, envío de correos y actualización por IPC',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const menuItems = [
  { name: 'Generador', href: '/' },
  { name: 'Emails', href: '/emailing' },
  { name: 'Configuración', href: '/config' },
  { name: 'Facturas', href: '/invoice' },
  { name: 'IPC', href: '/ipc' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 antialiased">
        <Navbar menuItems={menuItems} />
        <main className="main-container max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
