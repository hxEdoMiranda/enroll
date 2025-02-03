import { CompanyTable } from "@/modules/companies/company-table";
import { Building2 } from "lucide-react";

export default async function EmpresasPage() {
  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 w-full">
      <div className="bg-[url('/img/shared/background-banner.png')] bg-cover bg-center bg-no-repeat relative h-24 rounded-xl mb-4 flex flex-col gap-1 items-start justify-center px-8">
        <div className="flex gap-2 items-center">
          <Building2 className="size-10 text-white mr-2" />
          <h1 className="text-white font-bold text-3xl">Gestión empresas</h1>
        </div>
        <p className="text-lg font-medium text-white">
          {" "}
          Encuentra las empresas existentes y crea empresas.
        </p>
      </div>
      <CompanyTable />
    </main>
  );
}
