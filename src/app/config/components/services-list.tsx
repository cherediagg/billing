import styles from './services-list.module.css';

import { useCallback } from 'react';
import { Button } from 'src/components';
import { Service } from 'src/models';
import { v4 as uuidv4 } from 'uuid';

interface ServicesListProps {
  services: Service[];
  updateServices: (services: Service[]) => void;
}

function ServicesList({ services, updateServices }: ServicesListProps) {
  const addService = useCallback(() => {
    updateServices([...services, { id: uuidv4(), concept: '', quantity: 0, price: 0 }]);
  }, [services, updateServices]);

  const updateService = useCallback(
    (id: string, field: keyof Service, value: string | number) => {
      const updatedServices = services.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      );
      updateServices(updatedServices);
    },
    [services, updateServices]
  );

  const removeService = useCallback(
    (id: string) => {
      updateServices(services.filter((service) => service.id !== id));
    },
    [services, updateServices]
  );

  return (
    <div className={styles["services-list"]}>
      {services.map((service) => (
        <div key={service.id} className={styles["service-item"]}>
          <input
            type="text"
            value={service.concept}
            onChange={(e) => updateService(service.id, 'concept', e.target.value)}
            placeholder="Concepto"
            aria-label="Concepto del servicio"
          />
          <input
            type="number"
            value={service.quantity}
            onChange={(e) => updateService(service.id, 'quantity', parseFloat(e.target.value))}
            placeholder="Cantidad"
            aria-label="Cantidad del servicio"
          />
          <input
            type="number"
            value={service.price}
            onChange={(e) => updateService(service.id, 'price', parseFloat(e.target.value))}
            placeholder="Precio"
            aria-label="Precio del servicio"
          />
          <Button onClick={() => removeService(service.id)} ariaLabel="Eliminar servicio" variant='error'>🗑</Button>
        </div>
      ))}
      <Button onClick={addService} ariaLabel="Añadir servicio">Añadir Servicio</Button>
    </div>
  );
}

export default ServicesList;
