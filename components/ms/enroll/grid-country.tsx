"use client";
import { useState, useEffect } from "react";
import { getPaises } from "@/actions/pais"; // Nueva función para obtener todos los países
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IPais } from "@/actions/pais";
import { ButtonBanner } from "@/components/ms/button-banner";
import { EditUserIcon } from "@/modules/icons";
import CountryForm from '@/components/ms/enroll/form-pais';
import {Switch} from "@/components/ui/switch";

const PaisesTable = () => {
  const [paises, setPaises] = useState<IPais[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Estado para el término de búsqueda
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPaises = async () => {
      setLoading(true);
      setError(null);
      try {
        const paisesData: IPais[] = await getPaises(); // Obtiene todos los países
        setPaises(paisesData);
      } catch (error) {
        setError("Error al obtener los países");
        console.error("Error fetching paises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaises();
  }, []);

  // Filtrar los países basados en el término de búsqueda
  const filteredPaises = paises.filter((pais) =>
    pais.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pais.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredPaises.length / itemsPerPage);
  const currentData = filteredPaises.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
          placeholder="Buscar país por nombre o código"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el término de búsqueda
          className="border px-3 py-2 rounded-md"
        />
      </div>

      {filteredPaises.length === 0 ? (
        <p className="text-center text-gray-500">No hay países disponibles que coincidan con tu búsqueda.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Código de Teléfono</TableHead>
                <TableHead>Editar</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((pais) => (
                <TableRow key={pais.uid}>
                  <TableCell>{pais.code}</TableCell>
                  <TableCell>{pais.name}</TableCell>
                  <TableCell>{pais.code_phone}</TableCell>
                                  <TableCell>
                                                    <ButtonBanner
                                                      trigger={
                                                        <Button
                                                          variant="ghost"
                                                          className="flex font-semibold flex-row gap-2 shadow-sm text-[#414651] bg-white hover:bg-primary hover:text-white hover:border-primary  items-center rounded-full border border-[#D5D7DA]"
                                                        >
                                                          <EditUserIcon fill="currentColor" />
                                                          Editar
                                                        </Button>
                                                      }
                                                      content={
                                                        < CountryForm/>
                                                      }
                                                      title="Editar Paciente"
                                                      description="Edita los datos del paciente"
                                                      className="w-[1010px] p-8"
                                                    />
                                                  </TableCell>
                                                  <TableCell>
                <Switch
                  color="primary"
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

export default PaisesTable;
