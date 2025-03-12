import CompanyUpdateForm from '@/components/ms/enroll/form-empresa-update';
// import EmpresaConfig from '@/components/ms/enroll/form-configuracion';
import Stepper from '@/components/ms/enroll/stepper';
import { GetServerSideProps } from 'next';
import { CompanyFullModel as IEmpresa } from "@/modules/configuration/types/Company.type";
import { getEmpresa, getEmpresas, postCreateEmpresa, updateEmpresa } from "@/actions/empresa";
import { getPaises } from "@/actions/pais";
import { CountryModel as IPais } from "@/modules/configuration/types/Country.type";
import { ServiceUpdateForm } from '@/components/ms/enroll/form-editar-servicio';
import { getServices } from '@/actions/services';
import { ServiceModel as IService} from "@/modules/configuration/types/Service.type";


interface Props{
    params: {
        id: string;
    };
}

const EmpresaUpdatePage = async ({params }:Props) => {
    const { id } = params;
    const Serv:IService[] = (await getServices(undefined, undefined,id)) as IService[];
    //console.log(".:::1.-Servicios:::.", Serv)
    const Servicio:IService = Array.isArray(Serv) ? Serv[0]: Serv;
    //console.log(".:::2.-Servicios:::.", Servicio)
    const Paises:IPais[] = await getPaises();
    //console.log("ID:", id);
  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Columna izquierda */}
          
          {/* Columna derecha */}
          <div className="lg:col-span-2">
            <ServiceUpdateForm id={id} servicio={Servicio} paises={Paises} /*lstPaises={Paises}*/  />
          </div>
        </div>
    </main>
  );
};



export default EmpresaUpdatePage;

