import { fetchGetPractitioner } from "@/actions/admin-agenda/practitioner";
import { AgendaContent } from "@/components/agenda-admin/agenda-content";

export default async function AgendaPage() {
 const response = await fetchGetPractitioner();

    if ('data' in response) {
      console.log(response.data);
      return <AgendaContent data={response.data} />;
    } else {
      console.error(response);
      return <div>Error loading practitioners</div>;
    }
}