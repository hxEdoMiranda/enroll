"use client";
import { useState, useEffect } from "react";
import { getServices } from "@/actions/services";
import { ServiceModel as IService } from "@/modules/configuration/types/Service.type";

type NameServicesTableProps = {
  onSelectServices: (selectedIds: string[]) => void; // Prop para enviar los IDs seleccionados
  selectedServiceIds: string[]; // Recibimos el estado de los servicios seleccionados
};

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox"; // Importamos el componente de checkbox
import { Button } from "@/components/ui/button"; // Importamos el componente de botón

const NameServicesTable: React.FC<NameServicesTableProps> = ({ onSelectServices, selectedServiceIds }) => {
    const [services, setServices] = useState<IService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesData = await getServices();
                setServices(servicesData);
            } catch (err) {
                setError("Error al obtener los servicios");
                console.error("Error fetching services:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedServices = filteredServices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

    // Manejo del cambio en el checkbox
    const handleCheckboxChange = (serviceId: string) => {
        const updatedIds = selectedServiceIds.includes(serviceId)
            ? selectedServiceIds.filter((id) => id !== serviceId)
            : [...selectedServiceIds, serviceId];

        onSelectServices(updatedIds); // Llamamos al callback para actualizar el estado en el formulario
    };

    return (
        <div>
            {/* Campo de búsqueda */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar servicio..."
                className="border p-2 mb-4"
            />
            {/* Tabla de servicios */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Seleccionar</TableHead>
                        <TableHead>Nombre del Servicio</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={2}>Cargando...</TableCell>
                        </TableRow>
                    ) : (
                        paginatedServices.map((service) => (
                            <TableRow key={service._id || service.code}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedServiceIds.includes(service._id || service.code)} // Marca el checkbox si está seleccionado
                                        onChange={() => handleCheckboxChange(service._id || service.code)} // Llama al handler cuando el checkbox cambia
                                    />
                                </TableCell>
                                <TableCell>{service.name}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Paginación */}
            <div className="mt-4">
                <Button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Anterior
                </Button>
                <span className="mx-4">{currentPage} de {totalPages}</span>
                <Button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </Button>
            </div>
        </div>
    );
};

export default NameServicesTable;
