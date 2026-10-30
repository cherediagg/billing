import { Client, Service } from 'src/models';
import styles from './company-table.module.css';
import ServicesList from './services-list';
import { useState } from 'react';
import { Button, TextInput } from 'src/components';

interface CompanyListProps {
  companies: Client[];
  updateCompany: (id: string, field: keyof Client, value: string | Service[]) => void;
  deleteCompany: (id: string) => void;
}

export function CompanyList({ companies, updateCompany, deleteCompany }: CompanyListProps) {
  const [visibleCompanies, setVisibleCompanies] = useState<Set<string>>(new Set());

  const toggleVisibility = (id: string) => {
    setVisibleCompanies((prevVisibleCompanies) => {
      const newVisibleCompanies = new Set(prevVisibleCompanies);
      if (newVisibleCompanies.has(id)) {
        newVisibleCompanies.delete(id);
      } else {
        newVisibleCompanies.add(id);
      }
      return newVisibleCompanies;
    });
  };

  return (
    <div className={styles['company-list']}>
      {companies.map((company) => {
        const isVisible = visibleCompanies.has(company.id);
        return (
          <div key={company.id} className={styles['company-card']}>
            <div className={styles['company-header']}>
              <input
                type="text"
                value={company.name}
                onChange={(e) => updateCompany(company.id, 'name', e.target.value)}
                placeholder="Nombre de la Empresa"
                aria-label="Nombre de la Empresa"
                className={styles['name-input']}
              />
              <button
                onClick={() => toggleVisibility(company.id)}
                className={styles['toggle-button']}
                aria-expanded={isVisible}
                aria-controls={`details-${company.id}`}
              >
                {isVisible ? '▲' : '▼'}
              </button>
            </div>

            {isVisible && (
              <div
                id={`details-${company.id}`}
                className={styles['company-details']}
              >
                <TextInput
                  type="email"
                  label="Correo Electrónico"
                  id={`${company.id}-email`}
                  placeholder="Correo Electrónico"
                  onChange={(e) => updateCompany(company.id, 'email', e.target.value)}
                  value={company.email}
                  required
                />

                <TextInput
                  type="text"
                  label="NIF/CIF"
                  id={`${company.id}-taxId`}
                  placeholder="NIF/CIF"
                  onChange={(e) => updateCompany(company.id, 'taxId', e.target.value)}
                  value={company.taxId}
                  required
                />

                <TextInput
                  type="text"
                  label="Dirección"
                  id={`${company.id}-address`}
                  placeholder="Dirección"
                  onChange={(e) => updateCompany(company.id, 'address', e.target.value)}
                  value={company.address}
                  required
                />

                <TextInput
                  type="text"
                  label="Ciudad"
                  id={`${company.id}-city`}
                  placeholder="Ciudad"
                  onChange={(e) => updateCompany(company.id, 'city', e.target.value)}
                  value={company.city}
                  required
                />

                <div className={styles['detail']}>
                  <label>Servicios:</label>
                  <ServicesList
                    services={company.servicios}
                    updateServices={(services) => updateCompany(company.id, 'servicios', services)}
                  />
                </div>
                <div className={styles['actions']}>
                  <Button
                    onClick={() => deleteCompany(company.id)}
                    ariaLabel="Eliminar empresa"
                    variant="error"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CompanyList;
