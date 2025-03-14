import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchGetPractitionerById } from "@/actions/admin-agenda/practitioner";
import { fetchGetScheduleByIdPractitioner } from "@/actions/admin-agenda/schedule";
import { AvailabilityCalendar } from "@/components/agenda-admin/availability-calendar";

export default async function DisponibilidadEditPage({ params }: { params: { id: string } }) {
  const practitionerResponse = await fetchGetPractitionerById(params.id);
  const scheduleResponse = await fetchGetScheduleByIdPractitioner(params.id);
  
  if ('error' in practitionerResponse) {
    return <div>Error: {practitionerResponse.message || 'Profesional no encontrado'}</div>;
  }
  
  const practitioner = practitionerResponse.data;
  const schedule = 'data' in scheduleResponse ? scheduleResponse.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-xl font-medium">
            Disponibilidad de horarios - Dr(a). {practitioner.firstName} {practitioner.lastName}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="destructive">
            Eliminar Disponibilidad
          </Button>
          <Button variant="outline" className="bg-[#00D084] text-white hover:bg-[#00B371]">
            Crear Disponibilidad
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <AvailabilityCalendar
          practitionerId={params.id}
          initialSchedule={schedule}
        />
      </div>
    </div>
  );
}