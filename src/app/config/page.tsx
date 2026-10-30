'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './page.module.css';
import { useGetConfig } from './hooks/useGetConfig';
import { useSaveToFile } from './hooks/useSaveToFile';
import { Client, Service } from 'src/models';
import { v4 as uuidv4 } from 'uuid';
import CompanyTable from './components/company-table';
import { Button, Error as ErrorAlert, Loading, SearchInput, Title, Toast } from 'src/components';

export default function ConfigPage() {
  const { clients, loading, error } = useGetConfig();
  const [companies, setCompanies] = useState<Client[]>([]);
  const [filterText, setFilterText] = useState('');
  const [showToast, setToast] = useState(false);

  const { saveToFile, isSaving, successMsg, errorMsg } = useSaveToFile(companies);

  useEffect(() => {
    if (successMsg) setToast(true);
  }, [successMsg]);

  useEffect(() => {
    if (clients && clients.length > 0) {
      setCompanies(clients);
    }
  }, [clients]);

  const addCompany = useCallback(() => {
    setCompanies((prevCompanies) => [
      {
        id: uuidv4(),
        name: '',
        email: '',
        taxId: '',
        address: '',
        city: '',
        servicios: [
          { id: uuidv4(), concept: 'Servicio de limpieza', quantity: 1, price: 224 },
        ],
      },
      ...prevCompanies,
    ]);
  }, []);

  const updateCompany = useCallback(
    (id: string, field: keyof Client, value: string | Service[]) => {
      setCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.id === id ? { ...company, [field]: value } : company
        )
      );
    },
    []
  );

  const deleteCompany = useCallback((id: string) => {
    setCompanies((prevCompanies) => prevCompanies.filter((company) => company.id !== id));
  }, []);

  const filteredCompanies = useMemo(() => {
    if (!filterText.trim()) {
      return companies;
    }
    const lower = filterText.toLowerCase();
    return companies.filter(
      (company) =>
        company.address.toLowerCase().includes(lower) ||
        company.name.toLowerCase().includes(lower) ||
        company.email.toLowerCase().includes(lower)
    );
  }, [companies, filterText]);

  const renderResult = companies.length > 0 && (
    <div className="space-y-4 mt-4">
      <SearchInput
        onSearch={(value) => setFilterText(value)}
        placeholder="Filtrar por nombre, dirección o correo..."
        className="max-w-md"
      />

      <div className={styles['button-container']}>
        <Button onClick={addCompany} ariaLabel="Añadir nueva empresa" variant="secondary">
          ➕ Añadir Empresa
        </Button>
        <Button onClick={saveToFile} ariaLabel="Guardar datos" isDisabled={isSaving}>
          {isSaving ? 'Guardando...' : '💾 Guardar Cambios'}
        </Button>
      </div>

      <CompanyTable
        companies={filteredCompanies}
        updateCompany={updateCompany}
        deleteCompany={deleteCompany}
      />
    </div>
  );

  return (
    <section className={styles.page}>
      <Title>Administrar Empresas y Correos</Title>
      
      <Loading loading={loading} />
      
      <ErrorAlert message={error || errorMsg}>
        {error || errorMsg}
      </ErrorAlert>

      {renderResult}

      {showToast && <Toast message={successMsg} />}
    </section>
  );
}
