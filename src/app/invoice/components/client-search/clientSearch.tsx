'use client';

import { Client } from 'src/models';
import styles from './clientSearch.module.css';
import { useState, useEffect, useRef, useMemo } from 'react';
import SearchInput from 'src/components/search-input/search-input';

export interface ClientSearchProps {
  clients?: Client[];
  onSelectClient?: (client: Client) => void;
  selectedClient?: Client | null;
}

const EMPTY_CLIENTS: Client[] = [];

export function ClientSearch({
  clients = EMPTY_CLIENTS,
  onSelectClient,
  selectedClient,
}: ClientSearchProps) {
  const [searchTerm, setSearchTerm] = useState(selectedClient?.name || '');
  const [isDismissed, setIsDismissed] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedClient?.name) {
      setSearchTerm(selectedClient.name);
      setIsDismissed(false);
    }
  }, [selectedClient?.name]);

  const filteredClients = useMemo(() => {
    if (searchTerm.length <= 1 || !clients || clients.length === 0) {
      return EMPTY_CLIENTS;
    }
    const lowerQuery = searchTerm.toLowerCase();
    return clients.filter(
      (client) =>
        Boolean(
          (client.name && client.name.toLowerCase().includes(lowerQuery)) ||
          (client.taxId && client.taxId.toLowerCase().includes(lowerQuery)) ||
          (client.address && client.address.toLowerCase().includes(lowerQuery))
        )
    );
  }, [clients, searchTerm]);

  const isOpen = !isDismissed && filteredClients.length > 0 && searchTerm !== selectedClient?.name;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDismissed(true);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectClient = (client: Client) => {
    if (onSelectClient) {
      onSelectClient(client);
    }
    setSearchTerm(client.name);
    setIsDismissed(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setIsDismissed(false);
  };

  return (
    <div className={`${styles.clientSearch} relative w-full max-w-md`} ref={searchRef}>
      <SearchInput
        value={searchTerm}
        onSearch={handleSearchChange}
        placeholder="Buscar cliente por nombre o NIF..."
      />

      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-h-60 overflow-auto divide-y divide-slate-100 dark:divide-slate-700">
          {filteredClients.map((client) => (
            <li
              key={client.id || client.name}
              onClick={() => handleSelectClient(client)}
              className="p-3 hover:bg-emerald-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <div className="font-semibold text-slate-800 dark:text-white text-sm">
                {client.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {client.taxId} • {client.address}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ClientSearch;
