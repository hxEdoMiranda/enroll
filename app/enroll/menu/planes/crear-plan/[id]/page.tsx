import CompanyForm from '@/components/ms/enroll/form-empresa';
import PlanesTableid from '@/components/ms/enroll/grid-plan-id'
import PlanForm from '@/components/ms/enroll/form-plan'


export default async function CreatePlanPage({ params }: { params: { id: string } }) {
	
  // Esperar a que los parámetros estén disponibles
  const resolvedParams = await params;
  const { id } = resolvedParams;
	
	return (
		<main className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 w-full">
		{/* 	<div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
		
				<PlanesTableid companyId={id} />
		
				<div className="lg:col-span-2">
					<PlanForm company={id} />
				</div>
			</div>*/}
			<PlanesTableid companyId={id} />
		</main>
	);
};