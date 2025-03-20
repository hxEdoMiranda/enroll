// "use client"
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgendaCalendar } from "@/components/agenda-admin/agenda-calendar";
import { fetchGetScheduleByIdPractitioner } from "@/app/actions/admin-agenda/schedule";
import { fetchGetPractitionerById } from "@/app/actions/admin-agenda/practitioner";
import { CleanedSchedule } from "@/types/agenda-admin/schedule";
import Link from "next/link";


export default async function AgendaEditPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const startDateTime = new Date().toISOString();
  const [practitionerResponse, scheduleResponse] = await Promise.all([
    fetchGetPractitionerById(id),
    fetchGetScheduleByIdPractitioner(id, startDateTime)
  ]);

  if (!('data' in practitionerResponse)) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/admin-agenda/agenda" className="inline-flex items-center mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          Error: {practitionerResponse.message || 'No se pudo cargar el profesional'}
        </div>
      </div>
    );
  }

  const practitioner = practitionerResponse.data
  let schedule: CleanedSchedule[] = [];
  if ('data' in scheduleResponse) {
    schedule = scheduleResponse.data.map(item => ({
      id: item.id,
      specialty: item.specialty,
      start: item.start,
      end: item.end,
      active: item.active
    }));
  }
  console.log(schedule)
  const fullName = `${practitioner.firstName || ''} ${practitioner.lastName || ''}`.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin-agenda/profesionales" className="inline-flex items-center">
            <Button variant="ghost" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <h1 className="text-xl font-medium">
            Agenda de citas - Dr(a). {fullName}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <AgendaCalendar 
          practitionerId={id}
          initialSchedule={schedule}
        />
      </div>
    </div>
  );
}
