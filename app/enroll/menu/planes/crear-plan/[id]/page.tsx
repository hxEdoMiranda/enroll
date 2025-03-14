import { getEmpresa } from "@/actions/empresa";
import { getPlanId } from "@/actions/planes";
import { getServices } from "@/actions/services";
import { PlanManager } from "@/components/ms/enroll/plan-manager";
import { CompanyFullModel } from "@/modules/configuration/types/Company.type";

export default async function CreatePlanPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const planesData = await getPlanId(id);
	// console.log("planesData:", planesData);
	const servicesData = await getServices();
	// console.log("servicesData:", servicesData);
	const companyData = await getEmpresa(id) as CompanyFullModel;
	console.log("companyData:", companyData);

	return (
		<>
			<PlanManager planesData={planesData} companyData={companyData} servicesData={servicesData} />
			{/* <PlanesTableid companyId={id} /> */}
		</>
	);
}
