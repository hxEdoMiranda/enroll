"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";

const mockData = [
  {
    id: 1,
    nombre: "PRUEBAS 11",
    modeloAtencion: "Suscripción",
    fechaInicio: "05/08/2020",
    fechaTermino: "08/08/2022",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "ABCDOC",
    modeloAtencion: "Suscripción",
    fechaInicio: "21/10/2020",
    fechaTermino: "31/12/2021",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Convenio Salud BOLIVIANA - UBC",
    modeloAtencion: "Suscripción",
    fechaInicio: "04/12/2020",
    fechaTermino: "31/03/2022",
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "CONSALUD CAPTADO",
    modeloAtencion: "Suscripción",
    fechaInicio: "11/12/2020",
    fechaTermino: "31/12/2050",
    estado: "Activo",
  },
  {
    id: 5,
    nombre: "CONSALUD SPOT 2 - BONO MLE$",
    modeloAtencion: "Suscripción",
    fechaInicio: "11/12/2020",
    fechaTermino: "31/12/2050",
    estado: "Activo",
  },
];

export function ConveniosTable() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]"></TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Modelo Atención</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Fecha Término</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((convenio) => (
              <TableRow key={convenio.id}>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => router.push(`/convenios/${convenio.id}`)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{convenio.nombre}</TableCell>
                <TableCell>{convenio.modeloAtencion}</TableCell>
                <TableCell>{convenio.fechaInicio}</TableCell>
                <TableCell>{convenio.fechaTermino}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {convenio.estado}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing 1 - 10 of 50 results
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}