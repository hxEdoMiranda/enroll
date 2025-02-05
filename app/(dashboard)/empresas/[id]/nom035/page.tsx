import { isActionError } from "@/lib/utils";
import { fetchConfigByCompanyId } from "@/modules/configuration/actions";
import { NOM035ConfigurationForm } from "@/modules/configuration/nom035/components/nom035-configuration-form";

export default async function ConfiguracionNOM035Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //companyId
  const companyId = (await params).id;

  const configuration = await fetchConfigByCompanyId({
    companyId,
  });

  if (isActionError(configuration)) {
    throw new Error("Error al recuperar la configuración");
  }

  console.log(configuration.data);
  const configurationdata = configuration.data[0];
  return (
    <main className="w-full min-h-screen bg-white p-10">
      <div className="flex w-full gap-4 h-full">
        <div className="bg-[#FBFBFB] flex flex-col gap-4 rounded-lg p-4 w-1/3 sticky top-[1rem] h-fit">
          <h1 className="text-primary font-bold text-2xl">NOM035</h1>
          <p className="text-base text-[#262626]">
            Configuración NOM035 Empresa...
          </p>
        </div>

        <div className="bg-[#FBFBFB] w-2/3 p-4 flex flex-col gap-4 rounded-lg h-full">
          <NOM035ConfigurationForm
            defaultValues={{
              company_id: companyId,
              nom035: {
                RFC: configurationdata.nom035.RFC,
                comment_data: configurationdata.nom035.comment_data,
                comment_status: configurationdata.nom035.comment_status,
                employee_count: configurationdata.nom035.employee_count,
                periods: configurationdata.nom035.periods,
                postal_code: configurationdata.nom035.postal_code,
                trade_name: configurationdata.nom035.trade_name,
                configuration_data:
                  configurationdata.nom035.configuration_data.map(
                    ({ area, puesto }) => ({ area: area._id, puestos:puesto.map(({_id}) => (_id)) })
                  ),
                configuration_status:configurationdata.nom035.comment_status  
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
