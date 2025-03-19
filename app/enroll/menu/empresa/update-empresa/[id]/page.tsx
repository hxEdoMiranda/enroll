import CompanyUpdateForm from '@/components/ms/enroll/form-empresa-update';
// import EmpresaConfig from '@/components/ms/enroll/form-configuracion';
import Stepper from '@/components/ms/enroll/stepper';
import { CompanyFullModel as IEmpresa } from "@/modules/configuration/types/Company.type";
import { getEmpresa } from "@/app/actions/empresa";

export default async function EmpresaUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const empresa = await getEmpresa(id) as IEmpresa;
  //const Paises:IPais = await getPaises() as IPais;
  //console.log("ID:", id);
  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Columna izquierda */}
        <div className="lg:col-span-1">
          <Stepper />
        </div>
        {/* Columna derecha */}
        <div className="lg:col-span-2">
          <CompanyUpdateForm id={id} emp={empresa} /*lstPaises={Paises}*/ />
        </div>
      </div>
    </main>
  );
}

