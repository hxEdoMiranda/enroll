"use client";
import { useState, useEffect } from "react";
import { getPlans } from "@/actions/planes";
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
import { ButtonBanner } from "@/components/ms/button-banner";
import { EditUserIcon } from "@/modules/icons";
import PlanForm from "@/components/ms/enroll/form-plan";
import { Switch } from "@/components/ui/switch";

const PlanesTable = () => {
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
        const planesData = await getPlans();

        if (!Array.isArray(planesData)) {
          throw new Error("La respuesta de getPlans no es un array");
        }
        
        setPlanes(planesData);
      } catch (error: unknown) {
        setError("Error al obtener los planes: " + (error instanceof Error ? error.message : String(error)));
        console.error("Error fetching planes:", error);
        setPlanes([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchPlanes();
  }, []);

  const filteredPlanes = planes.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.identifier.toLowerCase().includes(searchTerm.toLowerCase())
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
          placeholder="Buscar plan por nombre o identificador"
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identificador</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Inicio</TableHead>
                <TableHead>Fecha de Fin</TableHead>
                <TableHead>Editar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((plan) => (
                <TableRow key={plan.uid}>
                  <TableCell>{plan.identifier}</TableCell>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={plan.state}
                      onCheckedChange={() => console.log(`Cambiar estado del plan con UID: ${plan.uid}`)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>{new Date(plan.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(plan.end_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <ButtonBanner
                      trigger={
                        <Button
                          variant="ghost"
                          className="flex font-semibold flex-row gap-2 shadow-sm text-[#414651] bg-white hover:bg-primary hover:text-white hover:border-primary items-center rounded-full border border-[#D5D7DA]"
                        >
                          <EditUserIcon fill="currentColor" />
                          Editar
                        </Button>
                      }
                      content={<PlanForm />}
                      title="Editar Plan"
                      description="Edita los datos del plan"
                      className="w-[1010px] p-8"
                    />
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

export default PlanesTable;
