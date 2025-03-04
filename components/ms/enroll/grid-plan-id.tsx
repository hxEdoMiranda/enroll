"use client";
import { useState, useEffect } from "react";
import { getPlanId } from "@/actions/planes";  // Asegúrate de que getPlanId esté correctamente importada
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlanModel } from "@/modules/configuration/types/Plan.type";

interface PlanesTableidProps {
  companyId: string;
}

const PlanesTableid = ({ companyId }: PlanesTableidProps) => {
  const [planes, setPlanes] = useState<PlanModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPlanes = async () => {
      setLoading(true);
      setError(null);
      try {
        // Usa companyId directamente aquí
        const planesData = await getPlanId(companyId );

        if (!Array.isArray(planesData)) {
          throw new Error("La respuesta de getPlanId no es un array");
        }

        setPlanes(planesData);
      } catch (error: any) {
        setError("Error al obtener los planes: " + (error.message || error));
        console.error("Error fetching planes:", error);
        setPlanes([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchPlanes();
  }, [companyId]);

  const filteredPlanes = planes.filter((plan) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlanes.length / itemsPerPage);
  const currentData = filteredPlanes.slice(
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
          placeholder="Buscar plan por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="border px-3 py-2 rounded-md"
        />
      </div>

      {filteredPlanes.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay planes disponibles que coincidan con tu búsqueda.
        </p>
      ) : (
        <>
          <Table className="min-w-full border border-white rounded-lg overflow-hidden shadow-sm bg-light-blue">
            <TableHeader className="bg-secondary text-secondary-foreground border-b border-white">
              <TableRow>
                <TableHead className="py-2 px-4 text-left font-semibold label-margin">Nombre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((plan, index) => (
                <TableRow
                  key={plan.uid}
                  className={`border-b border-white ${
                    index % 2 === 0 ? "bg-white" : "bg-secondary"
                  } hover:bg-primary-opacity transition-colors`}
                >
                  <TableCell className="py-2 px-4 text-foreground">{plan.name}</TableCell>
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
            <p>
              Página {currentPage} de {totalPages}
            </p>
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

export default PlanesTableid;
