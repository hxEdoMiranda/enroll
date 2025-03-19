// "use client"
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgendaCalendar } from "@/components/agenda-admin/agenda-calendar";
import { fetchGetScheduleByIdPractitioner } from "@/app/actions/admin-agenda/schedule";
import { fetchGetPractitionerById } from "@/app/actions/admin-agenda/practitioner";
import { CleanedSchedule } from "@/types/agenda-admin/schedule";
import Link from "next/link";


export default async function AgendaEditPage({ params }: { params: { id: string } }) {
  const {id} = await params 
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


// export default function AgendaEditPage({ params }: { params: { id: string } }) {
//   const router = useRouter();
//   const [practitioner, setPractitioner] = useState<CleanedPractitioner | null>(null);
//   const [schedule, setSchedule] = useState<CleanedSchedule[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [practitionerResponse, scheduleResponse] = await Promise.all([
//           fetchGetPractitionerById(params.id),
//           fetchGetScheduleByIdPractitioner(params.id)
//         ]);

//         if ('data' in practitionerResponse) {
//           setPractitioner(practitionerResponse.data);
//         } else {
//           setError(practitionerResponse.message);
//         }

//         if ('data' in scheduleResponse) {
//           const cleanedSchedules: CleanedSchedule[] = scheduleResponse.data.map(schedule => ({
//             id: schedule.id,
//             specialty: schedule.specialty[0]?.coding[0]?.display || 'Sin especialidad',
//             start: schedule.planningHorizon.start,
//             end: schedule.planningHorizon.end,
//             active: schedule.active
//           }));
//           setSchedule(cleanedSchedules);
//         }
//       } catch (err) {
//         setError('Error al cargar los datos');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [params.id]);

//   if (loading) {
//     return <div>Cargando...</div>;
//   }

//   if (error || !practitioner) {
//     return <div>Error: {error || 'Profesional no encontrado'}</div>;
//   }

//   const fullName = `${practitioner.firstName || ''} ${practitioner.lastName || ''}`.trim();

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center space-x-4">
//           <Button
//             variant="ghost"
//             onClick={() => router.back()}
//             className="flex items-center"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Volver
//           </Button>
//           <h1 className="text-xl font-medium">
//             Agenda de citas - Dr(a). {fullName}
//           </h1>
//         </div>
//         <div className="flex items-center space-x-4">
//           <Button variant="destructive">
//             Eliminar Agenda
//           </Button>
//           <Button variant="outline" className="bg-[#00D084] text-white hover:bg-[#00B371]">
//             Crear Agenda
//           </Button>
//           <Button className="bg-[#00B8D4] hover:bg-[#0095B0] text-white">
//             Enviar Agenda
//           </Button>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <AgendaCalendar 
//           practitionerId={params.id}
//           initialSchedule={schedule || []}
//         />
//       </div>
//     </div>
//   );
// }