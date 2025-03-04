import CompanyForm from '@/components/ms/enroll/form-empresa';
// import EmpresaConfig from '@/components/ms/enroll/form-configuracion';
import PlanesTableid from '@/components/ms/enroll/grid-plan-id'
import PlanForm from '@/components/ms/enroll/form-plan'

interface Props{params:{id:string}}

const CreatePlanPage = ({params}:Props) => {
  const {id}=params;
  console.log("0000000000000000", id)
  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Columna izquierda */}
          <PlanesTableid companyId={id} />
          {/* Columna derecha */}
          <div className="lg:col-span-2">
            <PlanForm />
          </div>
        </div>
    </main>
  );
};

export default CreatePlanPage;
