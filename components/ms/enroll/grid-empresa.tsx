import { useState, useEffect } from "react";
import { getEmpresas } from "@/actions/empresa";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IEmpresa } from "@/actions/empresa";

interface EmpresasTableProps {
  searchTerm: string;
}

const EmpresasTable = ({ searchTerm }: EmpresasTableProps) => {
  const [empresas, setEmpresas] = useState<IEmpresa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEmpresas = async () => {
      setLoading(true);
      try {
        const data = await getEmpresas(); // Asegúrate de que getEmpresas devuelve el array
        setEmpresas(data);
      } catch (error) {
        console.error("Error fetching empresas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  // Filtrar empresas según el término de búsqueda
  const filteredEmpresas = empresas.filter((empresa) => 
    empresa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.identifier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmpresas.length / itemsPerPage);
  const currentData = filteredEmpresas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Identificador</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Industria</TableHead>
            <TableHead>Tipo de Negocio</TableHead>
            <TableHead>País</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((empresa) => (
            <TableRow key={empresa.uid}>
              <TableCell>{empresa.identifier}</TableCell>
              <TableCell>{empresa.name}</TableCell>
              <TableCell>{empresa.industry_type}</TableCell>
              <TableCell>{empresa.business_type}</TableCell>
              <TableCell>{empresa.country.nombre}</TableCell> {/* Acceso correcto a 'nombre' */}
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
    </div>
  );
};

export default EmpresasTable;
