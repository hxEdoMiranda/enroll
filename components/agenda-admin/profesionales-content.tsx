"use client";

import { ProfesionalesFilters } from "@/components/agenda-admin/profesionales-filters";
import { ProfesionalesTable } from "@/components/agenda-admin/profesionales-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProfesionalesContentProps } from "@/types/agenda-admin/agenda-admin";
import { useProfesionalesStore } from "@/store/agenda-admin/profesionalesStore";

export function ProfesionalesContent({ data }: ProfesionalesContentProps) {
  const router = useRouter();
  const { setFilteredData } = useProfesionalesStore();

  useEffect(() => {
    setFilteredData(data);
  }, [data, setFilteredData]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mantenedor profesionales</h1>
        <Button 
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => router.push("/admin-agenda/profesionales/nuevo")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo profesional
        </Button>
      </div>

      <h2 className="text-lg text-gray-600">Ver profesionales</h2>

      <ProfesionalesFilters data={data} />
      <ProfesionalesTable />
    </div>
  );
}