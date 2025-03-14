"use client";
import { useState, useEffect } from "react";
import { getServices } from "@/actions/services";
import { ServiceModel as IService } from "@/modules/configuration/types/Service.type";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const NameServicesTable: React.FC<{ 
  onServicesChange?: (services: IService[]) => void; 
  initialUid?: string; // Prop opcional para el UID inicial
}> = ({ onServicesChange, initialUid }) => {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedServices, setSelectedServices] = useState<IService[]>([]);

  const itemsPerPage = 10;

  // Carga los servicios al montar el componente
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await getServices();
        setServices(servicesData);

        // Si `initialUid` es proporcionado, seleccionamos ese servicio automáticamente
        if (initialUid) {
          const initialService = servicesData.find(service => service.uid === initialUid);
          if (initialService) {
            setSelectedServices([initialService]);
            if (onServicesChange) {
              onServicesChange([initialService]);
            }
          }
        }
      } catch (err) {
        setErrorMessage("Error al obtener los servicios");
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [initialUid, onServicesChange]); // Dependemos de `initialUid`

  // Filtra los servicios según el término de búsqueda
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagina los servicios según la página actual
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calcula el número total de páginas
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  // Manejo del cambio en el checkbox
  const handleCheckboxChange = (service: IService, checked: boolean) => {
    const updatedSelection = checked
      ? [...selectedServices, service] // Agregar el objeto completo
      : selectedServices.filter(s => s.uid !== service.uid); // Filtrar por uid para quitarlo

    setSelectedServices(updatedSelection);
    
    // Notificar al componente padre sobre el cambio
    if (onServicesChange) {
      onServicesChange(updatedSelection);
    }
  };

  return (
    <div>
      {/* Mostrar indicador de carga */}
      {loading ? (
        <div className="text-center py-4">Cargando servicios...</div>
      ) : (
        <>
          {/* Mostrar mensaje de error si existe */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          {/* Campo de búsqueda */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar servicio..."
            className="border p-2 mb-4"
          />

          <div className="flex flex-col">
            {paginatedServices.map((service) => (
              <div key={service.uid} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={service.uid}
                  checked={selectedServices.some(s => s.uid === service.uid)}
                  onCheckedChange={(checked) => {
                    handleCheckboxChange(service, checked === true);
                  }}
                />
                <label
                  htmlFor={service.uid}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {service.name}
                </label>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="mt-4">
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="mx-4">
              {currentPage} de {totalPages}
            </span>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default NameServicesTable;
