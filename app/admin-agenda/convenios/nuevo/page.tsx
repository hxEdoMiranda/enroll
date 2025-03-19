"use client";

import { EditConvenioForm } from "@/components/agenda-admin/edit-convenio-form";

export default function NewConvenioPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nuevo Convenio</h1>
      <EditConvenioForm isNew={true} />
    </div>
  );
}