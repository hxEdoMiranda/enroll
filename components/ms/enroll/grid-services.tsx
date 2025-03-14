"use client";
import { useState, useEffect } from "react";
import { getServices } from "@/actions/services"; // Nueva función para obtener los servicios
import { ServiceModel as IService} from "@/modules/configuration/types/Service.type";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditUserIcon } from "@/modules/icons";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";


const ServicesTable = () => {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Estado para el término de búsqueda
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const servicesData: IService[] = await getServices(); // Obtiene todos los servicios
        console.log("Datos obtenidos de getServices:", servicesData); // <--- Agrega este console.log
        setServices(servicesData);
      } catch (error) {
        setError("Error al obtener los servicios");
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);



  // Filtrar los servicios basados en el término de búsqueda
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const currentData = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando datos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar servicio por nombre o código"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md"
        />
      </div>
  
      {filteredServices.length === 0 ? (
        <p className="text-center text-gray-500">No hay servicios disponibles que coincidan con tu búsqueda.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
               <TableHead>Nombre</TableHead><TableHead>Descripción</TableHead><TableHead>Editar</TableHead><TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((service, index) => (
                <TableRow key={service.uid || index}>
                  <TableCell>{service.name}</TableCell><TableCell>{service.description}</TableCell>
                  <TableCell>
                    <Link href={`/enroll/menu/servicios/${service.uid}`} >
                        <Button
                          variant="ghost"
                          className="flex font-semibold flex-row gap-2 shadow-sm text-[#414651] bg-white hover:bg-primary hover:text-white hover:border-primary items-center rounded-full border border-[#D5D7DA]"
                        >
                          <EditUserIcon fill="currentColor" />
                          Editar
                        </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
  <Switch color="primary" checked={service.state} />
</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
  
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <p>Página {currentPage} de {totalPages}</p>
            <Button
              variant="outline"
              onClick={handleNextPage}
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

export default ServicesTable;
