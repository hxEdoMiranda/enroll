

import { EditProfesionalForm } from "@/components/agenda-admin/edit-profesional-form";

export default function NewProfesionalPage() {
  return (
    <div className="space-y-6">
      <EditProfesionalForm isNew={true} />
    </div>
  );
}