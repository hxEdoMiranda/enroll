"use client";

import EmpresasTable from "@/components/ms/enroll/grid-empresa";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';


const EmpresaPage = () => {
  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 w-full">
      <div className="bg-[url('/img/shared/background-banner.png')] bg-cover bg-center bg-no-repeat relative h-24 rounded-xl mb-4 flex items-center px-8 w-full">
        {/* Contenedor flexible para mantener el título a la izquierda y el botón a la derecha */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Building2 className="size-10 text-white" />
            <h1 className="text-white font-bold text-3xl">Gestión Empresas</h1>
          </div>
          <Link href="/enroll/menu/empresa/crear-empresa">
            <Button variant="secondary">
              Agregar empresa
            </Button>
          </Link>
        </div>
      </div>

      <EmpresasTable searchTerm="" />
    </main>
  );
};

export default EmpresaPage;
