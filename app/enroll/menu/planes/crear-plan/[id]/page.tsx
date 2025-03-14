import { getEmpresa } from "@/actions/empresa";
import { getPlanId } from "@/actions/planes";
import { getServices } from "@/actions/services";
import { PlanManager } from "@/components/ms/enroll/plan-manager";
import { CompanyFullModel } from "@/modules/configuration/types/Company.type";

export default async function CreatePlanPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = params;
	const planesData = await getPlanId(id);
	// console.log("planesData:", planesData);
	const servicesData = await getServices();
	// console.log("servicesData:", servicesData);
	const companyData = await getEmpresa(id) as CompanyFullModel;

	return (
		<>
			<PlanManager planesData={planesData} companyData={companyData} servicesData={servicesData} />
			{/* <PlanesTableid companyId={id} /> */}
		</>
	);
}
