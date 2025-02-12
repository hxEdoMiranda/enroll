"use client";

// import EmpresasTable from "@/components/ms/enroll/grid-empresa";
// import Image from "next/image";
// import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CompanyTable } from "@/modules/companies/company-table";
import EmpresaForm from "@/components/ms/enroll/form-empresa";

const EmpresaPage = () => {
  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 w-full">
      <div className="bg-[url('/img/shared/background-banner.png')] bg-cover bg-center bg-no-repeat relative h-24 rounded-xl mb-4 flex flex-col gap-1 items-start justify-center px-8">
        <div className="flex gap-2 items-center">
          <Building2 className="size-10 text-white mr-2" />
          <h1 className="text-white font-bold text-3xl">Gestión Empresas</h1>
        </div>
        <div className="flex gap-2 mt-2 justify-end ml-auto mb-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Agregar empresa</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Pais</DialogTitle>
                <DialogDescription>
                  Complete los siguientes campos para agregar una empresa.
                </DialogDescription>
              </DialogHeader>
              <form>
                {/* agregar formularios */}
                <EmpresaForm></EmpresaForm>
                <Button type="submit" variant="secondary">
                  Guardar
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <CompanyTable></CompanyTable>
    </main>
  );
};

export default EmpresaPage;
