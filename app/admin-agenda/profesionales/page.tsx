// import { fetchIPData } from "@/actions/admin-agenda/ipquery";
import { fetchGetPractitioner } from "@/actions/admin-agenda/practitioner";
import { searchSpecialties } from "@/actions/admin-agenda/specialty";
import { ProfesionalesContent } from "@/components/agenda-admin/profesionales-content";
import { get } from "http";
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