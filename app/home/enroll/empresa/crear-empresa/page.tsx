import EmpresaForm from '@/components/ms/enroll/form-empresa'
import EmpresaConfig from '@/components/ms/enroll/form-configuracion'
import Stepper from '@/components/ms/enroll/stepper';


const EmpresaPage = () => {

  return (
    <div className="p-4 md:p-8 bg-white bg-opacity-50 mr-6 mt-14 mb-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Columna izquierda */}
        <Stepper />

        {/* Columna derecha */}
       
        <div className="lg:col-span-2">
      <EmpresaForm />
    </div>

      </div>
    </div>
  );
};

export default EmpresaPage;
