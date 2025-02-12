import { isActionError } from "@/lib/utils";
import { fetchConfigByCompanyId } from "@/modules/configuration/actions";
import { NOM035ConfigurationForm } from "@/modules/configuration/nom035/components/nom035-configuration-form";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import PuestoForm from "@/components/ms/enroll/form-nom035puesto";
import AreaForm from "@/components/ms/enroll/form-nom035area";

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
      <div className="bg-[url('/img/shared/background-banner.png')] bg-cover bg-center bg-no-repeat relative h-24 rounded-xl mb-4 flex flex-col gap-1 items-start justify-center px-8">
        <div className="flex gap-2 items-center">
          <Building2 className="size-10 text-white mr-2" />
          <h1 className="text-white font-bold text-3xl">Gestión Nom035</h1>
        </div>
        <div className="flex gap-2 mt-2 justify-end ml-auto mb-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Agregar Área</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Área</DialogTitle>
                <DialogDescription>Complete los siguientes campos para agregar un área.</DialogDescription>
              </DialogHeader>
          
                  <AreaForm></AreaForm>

            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Agregar Puesto</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Puesto</DialogTitle>
                <DialogDescription>Complete los siguientes campos para agregar un puesto.</DialogDescription>
              </DialogHeader>
                <PuestoForm></PuestoForm>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
