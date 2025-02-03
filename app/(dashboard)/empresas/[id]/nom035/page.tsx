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
          <NOM035ConfigurationForm />
        </div>
      </div>
    </main>
  );
}
