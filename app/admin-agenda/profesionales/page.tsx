
import { fetchGetPractitioner } from "@/app/actions/admin-agenda/practitioner";
import { ProfesionalesContent } from "@/components/agenda-admin/profesionales-content";
import moment from 'moment-timezone';



export default async function ProfesionalesPage() {
  const response = await fetchGetPractitioner();

 const getTimeZones = () => {
    const timeZones = moment.tz.names().map((tz) => {
      const [country, city] = tz.split('/');
      return {
        country: country.replace('_', ' '),
        city: city ? city.replace('_', ' ') : '',
        timeZone: tz,
      };
    });
    return timeZones;
  };

  getTimeZones();


  if ('data' in response) {
    console.log(response.data);
    return <ProfesionalesContent data={response.data} />;
  } else {
    console.error(response);
    return <div>Error loading practitioners</div>;
  }
}