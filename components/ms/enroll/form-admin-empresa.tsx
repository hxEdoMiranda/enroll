"use client";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Link from "next/link"; // Importar Link de Next.js

const PermissionsTable = () => {
  const [data] = useState([
    { name: "Usuario 1", permissions: "Admin", data: "Datos de usuario 1", state: true },
    { name: "Usuario 2", permissions: "Editor", data: "Datos de usuario 2", state: false },
    { name: "Usuario 3", permissions: "Viewer", data: "Datos de usuario 3", state: true },
    // Agregar más datos aquí
  ]);

  return (
    <div className="space-y-6">
      {/* Título y bajada de título */}
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-black">Agrega usuarios administrativos</h1>
        <p className="text-base text-gray-600">Estos usuarios serán los encargados de administrar los datos e información de la empresa. </p>
      </div>

      {/* Botón Agregar Usuario */}
      <div className="flex justify-end">
        <Button variant="secondary">Agregar Usuario</Button>
      </div>

      {/* Tabla */}
      <Table className="rounded-lg overflow-hidden border">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Permisos</TableHead>
            <TableHead>Datos</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.permissions}</TableCell>
              <TableCell>{item.data}</TableCell>
              <TableCell>
                <Switch color="primary" checked={item.state} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Botón con Link para redirigir a /enroll/menu/empresa */}
      <div className="flex justify-end mt-4">
        <Link href="/enroll/menu/empresa">
          <Button variant="secondary">Ir a Empresa</Button>
        </Link>
      </div>
    </div>
  );
};

export default PermissionsTable;
