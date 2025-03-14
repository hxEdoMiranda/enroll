import PermissionsTable from '@/components/ms/enroll/form-admin-empresa';
// import EmpresaConfig from '@/components/ms/enroll/form-configuracion';
import Stepper2 from '@/components/ms/enroll/stepper2';

const EmpresaPage = () => {
  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Columna izquierda */}
          <Stepper2 />
          {/* Columna derecha */}
          <div className="lg:col-span-2">
            <PermissionsTable />
          </div>
        </div>
    </main>
  );
};

export default EmpresaPage;
