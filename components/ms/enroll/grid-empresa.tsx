import { useState, useEffect } from "react";
import { getEmpresasFull } from "@/app/actions/empresa";
import { CompanyFullModel as IEmpresa } from "@/modules/configuration/types/Company.type"; // Asegúrate de ajustar la ruta
//import { CountryModel as IPais } from "@/modules/configuration/types/Country.type";
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
import Link from "next/link";

interface EmpresasTableProps {
  searchTerm: string;
}

const EmpresasTable = ({ searchTerm }: EmpresasTableProps) => {
  const [empresas, setEmpresas] = useState<IEmpresa[]>([]);
  //const [paises, setPaises] = useState<IPais[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEmpresas = async () => {
      setLoading(true);
      try {
        const data = await getEmpresasFull();
        setEmpresas(data);
      } catch (error) {
        console.error("Error fetching empresas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  /* useEffect(() => {
    const fetchPaises = async () => {
      //setLoading(true);
      try {
        const data = await getPaises();
        console.log("data Paises:", data);
        setPaises(data);
      } catch (error) {
        console.error("Error fetching empresas:", error);
      } finally {
        //setLoading(false);
      }
    };

    fetchPaises();
  }, []);
  */
  const handleToggle = (id: string) => {
    setEmpresas(
      empresas.map((empresa) =>
        empresa._id === id ? { ...empresa, enabled: !empresa.state } : empresa
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
  console.log("Empresas:", empresas);
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
            <TableRow key={empresa.id}>
              <TableCell>{empresa.name}</TableCell>
              <TableCell>{empresa.industry_type || "N/A"}</TableCell>
              <TableCell>{empresa.employee_count || "N/A"}</TableCell>
              <TableCell>{empresa.country.name || "N/A"}</TableCell>
              <TableCell>
                    <Link
                      href={`/enroll/menu/empresa/update-empresa/${empresa.id}`}
                    >
                      <Button
                        variant="ghost"
                        className="flex font-semibold flex-row gap-2 shadow-sm text-[#414651] bg-white hover:bg-primary hover:text-white hover:border-primary  items-center rounded-full border border-[#D5D7DA]"
                      >
                        <EditUserIcon fill="currentColor" />
                        Ver Detalles
                      </Button>
                    </Link>

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
              <Link href={`/enroll/menu/planes/crear-plan/${empresa.id}`}>
              <Button
                    variant="ghost"
                    className="flex font-semibold flex-row gap-2 shadow-sm text-[#414651] bg-white hover:bg-primary hover:text-white hover:border-primary  items-center rounded-full border border-[#D5D7DA]"
                  >
                    <EditUserIcon fill="currentColor" />
                    Planes
                  </Button>
                </Link>
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
                  checked={empresa.state}
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
