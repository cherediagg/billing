'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export interface MenuItem {
  name: string;
  href: string;
}

interface NavbarProps {
  menuItems?: MenuItem[];
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { name: 'Generador', href: '/' },
  { name: 'Emails', href: '/emailing' },
  { name: 'Configuración', href: '/config' },
  { name: 'Facturas', href: '/invoice' },
  { name: 'IPC', href: '/ipc' },
];

export function Navbar({ menuItems = DEFAULT_MENU_ITEMS }: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const items = menuItems && menuItems.length > 0 ? menuItems : DEFAULT_MENU_ITEMS;

  return (
    <nav className="border-b border-emerald-500/20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            eBilling
          </span>
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-slate-500 rounded-lg md:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 dark:focus:ring-slate-700"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Abrir menú principal</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-slate-100 rounded-xl bg-slate-50 md:flex-row md:space-x-2 md:mt-0 md:border-0 md:bg-transparent dark:bg-slate-800/80 md:dark:bg-transparent dark:border-slate-700">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-2 px-3.5 rounded-lg text-sm transition-all duration-150 ${
                      isActive
                        ? 'text-white bg-emerald-600 font-semibold shadow-sm shadow-emerald-600/30'
                        : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
