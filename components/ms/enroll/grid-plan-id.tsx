"use client";
import { useState, useEffect, useMemo } from "react";
import { getPlanId } from "@/actions/planes";
import { Button } from "@/components/ui/button";
import { PlanModel } from "@/modules/configuration/types/Plan.type";
import PlanForm from "@/components/ms/enroll/form-plan";
import PlanFormUpdate from "@/components/ms/enroll/form-plan-update";

interface PlanesTableidProps {
  companyId: string;
}

const PlanesTableid = ({ companyId }: PlanesTableidProps) => {
  const [planes, setPlanes] = useState<PlanModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false); 
  const [planToUpdate, setPlanToUpdate] = useState<PlanModel | null>(null); 
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPlanes = async () => {
      setLoading(true);
      setError(null);
      try {
        const planesData = await getPlanId(companyId);

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
  }, [companyId, refresh]);

  const handlePlanCreated = () => {
    setRefresh((prev) => !prev); // Cambia el estado para forzar la actualización
    closeForm(); // Cierra el formulario después de la acción
  };

  const handlePlanUpdate = (plan: PlanModel) => {
    setPlanToUpdate(plan); // Establece el plan a actualizar
    setShowForm(true); // Muestra el formulario
  };

  const closeForm = () => {
    setShowForm(false); // Oculta el formulario
    setPlanToUpdate(null); // Limpia el estado del plan a actualizar
  };

  const filteredPlanes = useMemo(() => 
    planes.filter((plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [planes, searchTerm]
  );

  const totalPages = useMemo(() => 
    Math.ceil(filteredPlanes.length / itemsPerPage),
    [filteredPlanes]
  );

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
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Buscar plan por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-md w-full"
          />
        </div>

        {filteredPlanes.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay planes disponibles que coincidan con tu búsqueda.
          </p>
        ) : (
          <>
            <div className="space-y-2">
              {currentData.map((plan) => (
                <Button
                  key={plan.uid}
                  variant="outline"
                  className="w-full bg-white text-black hover:bg-gray-100 border border-gray-300"
                  onClick={() => handlePlanUpdate(plan)} // Al hacer click, actualizar el plan
                >
                  {plan.name}
                </Button>
              ))}
            </div>

            {/* Botón Agregar Plan */}
            <Button
              variant="outline"
              onClick={() => {
                setPlanToUpdate(null); // Limpia cualquier plan a actualizar
                setShowForm(true); // Muestra el formulario de creación
              }}
              className="w-full bg-blue-500 text-white hover:bg-blue-400 mt-4"
            >
              Agregar Plan
            </Button>

            <div className="flex justify-between items-center mt-4">
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

      <div className="col-span-2">
        {/* Mostrar formulario dependiendo de si es creación o actualización */}
        {showForm && planToUpdate ? (
          <PlanFormUpdate
            key={planToUpdate.uid} // Clave dinámica para forzar el rerenderizado
            company={companyId}
            plan={planToUpdate} // Pasa el plan a actualizar
            onPlanCreated={handlePlanCreated} // Callback para manejar la actualización
          />
        ) : (
          showForm && (
            <PlanForm
              company={companyId}
              onPlanCreated={handlePlanCreated} // Callback para manejar la creación
            />
          )
        )}
      </div>
    </div>
  );
};

export default PlanesTableid;
