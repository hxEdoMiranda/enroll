import { useState, useEffect } from "react";
import { getEmpresas, IEmpresa } from "@/actions/enroll/empresa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ButtonBanner } from "@/components/ms/button-banner";
import { EditUserIcon } from "@/modules/icons";

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
        const data = await getEmpresas();
        setEmpresas(data);
      } catch (error) {
        console.error("Error fetching empresas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  const handleToggle = (id: string) => {
    setEmpresas(
      empresas.map((empresa) =>
        empresa._id === id ? { ...empresa, enabled: !empresa.enabled } : empresa
      )
    );
  };

  const filteredEmpresas = empresas.filter(
    (empresa) =>
      empresa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.identifier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmpresas.length / itemsPerPage);
  const currentData = filteredEmpresas.slice(
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
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Industria</TableHead>
            <TableHead>Número de Empleados</TableHead>
            <TableHead>País</TableHead>
            <TableHead>Habilitado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((empresa) => (
            <TableRow key={empresa._id}>
              <TableCell>{empresa.name}</TableCell>
              <TableCell>{empresa.industry_type || "N/A"}</TableCell>
              <TableCell>{empresa.employee_count || "N/A"}</TableCell>
              <TableCell>{empresa.country.name || "N/A"}</TableCell>
              <TableCell>
                <ButtonBanner
                  trigger={
                    <Button
                      variant="ghost"
                      className="flex font-semibold flex-row gap-2 shadow-sm text-[#414651] bg-white hover:bg-primary hover:text-white hover:border-primary  items-center rounded-full border border-[#D5D7DA]"
                    >
                      <EditUserIcon fill="currentColor" />
                      Ver Detalles
                    </Button>
                  }
                  content={<Button></Button>}
                  title="Editar Paciente"
                  description="Edita los datos del paciente"
                  className="w-[1010px] p-8"
                />
              </TableCell>
              <TableCell>
                <ButtonBanner
                  trigger={
                    <Button
                      variant="ghost"
                      className="flex font-semibold flex-row gap-2 shadow-sm text-[#414651] bg-white hover:bg-primary hover:text-white hover:border-primary  items-center rounded-full border border-[#D5D7DA]"
                    >
                      <EditUserIcon fill="currentColor" />
                      General
                    </Button>
                  }
                  content={<Button></Button>}
                  title="Editar Paciente"
                  description="Edita los datos del paciente"
                  className="w-[1010px] p-8"
                />
              </TableCell>
              <TableCell>
                <ButtonBanner
                  trigger={
                    <Button
                      variant="ghost"
                      className="flex font-semibold flex-row gap-2 shadow-sm text-[#414651] bg-white hover:bg-primary hover:text-white hover:border-primary  items-center rounded-full border border-[#D5D7DA]"
                    >
                      <EditUserIcon fill="currentColor" />
                      Planes
                    </Button>
                  }
                  content={<Button></Button>}
                  title="Editar Paciente"
                  description="Edita los datos del paciente"
                  className="w-[1010px] p-8"
                />
              </TableCell>
              <TableCell>
                <ButtonBanner
                  trigger={
                    <Button
                      variant="ghost"
                      className="flex font-semibold flex-row gap-2 shadow-sm text-[#414651] bg-white hover:bg-primary hover:text-white hover:border-primary  items-center rounded-full border border-[#D5D7DA]"
                    >
                      <EditUserIcon fill="currentColor" />
                      Customizar
                    </Button>
                  }
                  content={<Button></Button>}
                  title="Editar Paciente"
                  description="Edita los datos del paciente"
                  className="w-[1010px] p-8"
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={empresa.enabled}
                  onChange={() => handleToggle(empresa._id!)}
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
    </div>
  );
};

export default EmpresasTable;
