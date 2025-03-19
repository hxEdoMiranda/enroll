"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditConvenioForm } from "@/components/agenda-admin/edit-convenio-form";
import { useRouter } from "next/navigation";

export default function EditConvenioPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold">Mantenedor de convenio</h1>
      </div>
      <EditConvenioForm id={params.id} />
    </div>
  );
}