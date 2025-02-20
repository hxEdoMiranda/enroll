import CompanyForm from '@/components/ms/enroll/form-empresa';
// import EmpresaConfig from '@/components/ms/enroll/form-configuracion';
import Stepper from '@/components/ms/enroll/stepper';

const EmpresaPage = () => {
  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Columna izquierda */}
          <Stepper />
          {/* Columna derecha */}
          <div className="lg:col-span-2">
            <CompanyForm />
          </div>
        </div>
    </main>
  );
};

export default EmpresaPage;
