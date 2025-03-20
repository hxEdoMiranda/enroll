import { fetchGetPractitionerById } from "@/app/actions/admin-agenda/practitioner";
import { EditProfesionalForm } from "@/components/agenda-admin/edit-profesional-form";

export default async function EditProfesionalPage({ params }: { params: { id: string } }) {
  const { id } =  await params;
  const infoDoctor = await fetchGetPractitionerById(id);

  if ('error' in infoDoctor) {
    return <div>Error: {infoDoctor.message}</div>;
  }

  return (
    <div className="space-y-6">
      <EditProfesionalForm id={id} initialData={infoDoctor.data} />
    </div>
  );
}