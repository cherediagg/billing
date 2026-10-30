'use client';

import { Client } from 'src/models';
import styles from './clientSearch.module.css';
import { useState, useEffect, useRef } from 'react';
import { SearchInput } from 'src/components';

export interface ClientSearchProps {
  clients?: Client[];
  onSelectClient?: (client: Client) => void;
  selectedClient?: Client | null;
}

export function ClientSearch({
  clients = [],
  onSelectClient,
  selectedClient,
}: ClientSearchProps) {
  const [searchTerm, setSearchTerm] = useState(selectedClient?.name || '');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedClient?.name) {
      setSearchTerm(selectedClient.name);
    }
  }, [selectedClient?.name]);

  useEffect(() => {
    if (searchTerm.length > 1 && clients.length > 0) {
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.taxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
      setIsOpen(filtered.length > 0 && searchTerm !== selectedClient?.name);
    } else {
      setFilteredClients([]);
      setIsOpen(false);
    }
  }, [searchTerm, clients, selectedClient?.name]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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
    setIsOpen(false);
  };

  return (
    <div className={`${styles.clientSearch} relative w-full max-w-md`} ref={searchRef}>
      <SearchInput
        value={searchTerm}
        onSearch={(value) => setSearchTerm(value)}
        placeholder="Buscar cliente por nombre o NIF..."
      />

      {isOpen && filteredClients.length > 0 && (
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
