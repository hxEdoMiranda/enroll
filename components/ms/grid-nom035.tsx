import { useState, useEffect } from "react";
import { getNom035Config } from "@/app/actions/config-nom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Definir un tipo para la respuesta de la API
interface ConfigResponse {
  message: string;
  data: Nom035Data[]; // Suponiendo que 'data' es un array de 'Nom035Data'
}

interface Nom035Data {
  company_id: string;
  nom035?: {
    RFC?: string;
    employee_count?: number;
    trade_name?: string;
  };
}

const EmpresasNom035Table = () => {
  const [empresas, setEmpresas] = useState<Nom035Data[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmpresas = async () => {
      setLoading(true);
      try {
        const response = await getNom035Config();
        console.log("Respuesta de la API:", response);

        // Asegúrate de que la respuesta tiene la propiedad 'data'
        const empresasArray = Array.isArray((response as unknown as ConfigResponse)?.data)
          ? (response as unknown as ConfigResponse).data
          : [];

        setEmpresas(empresasArray);
      } catch (error) {
        console.error("Error fetching NOM-035 data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmpresas();
  }, []);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company ID</TableHead>
            <TableHead>RFC</TableHead>
            <TableHead>Número de Empleados</TableHead>
            <TableHead>Nombre Comercial</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {empresas.map((empresa, index) => (
            <TableRow key={empresa.company_id || index}>
              <TableCell>{empresa.company_id}</TableCell>
              <TableCell>{empresa.nom035?.RFC || "N/A"}</TableCell>
              <TableCell>{empresa.nom035?.employee_count || "N/A"}</TableCell>
              <TableCell>{empresa.nom035?.trade_name || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmpresasNom035Table;
