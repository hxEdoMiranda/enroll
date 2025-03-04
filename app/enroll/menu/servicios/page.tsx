import { GripHorizontal, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServicesTable from "@/components/ms/enroll/grid-services";
import { ListButtonBanner } from "@/components/ms/list-button-banner";
import { ServiceForm } from "@/components/ms/enroll/form-carga-servicio";

const CountryPage = () => {

	const actionsButtons = [
		{
			trigger: (
				<Button
					variant="ghost"
					className="flex flex-row gap-2 shadow-lg text-white bg-white/20 hover:bg-white/70  items-center rounded-full border border-white"
				>
					<SquarePlus />
					AGREGAR SERVICIO
				</Button>
			),
			content: <ServiceForm />,
			title: "Agregar Servicio",
			description:
				"Llene la información relevante al nuevo servicio que creara.",
			className: "w-[1010px] p-8",
			titleClassName: "font-semibold text-2xl text-[#101828]",
			descriptionClassName: "font-normal text-[#262626]",
		},
	];

	return (
		<main className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 w-full">
			<div className="bg-[url('/img/shared/background-banner.png')] bg-cover bg-center bg-no-repeat relative h-24 rounded-xl mb-4 flex flex-row gap-1 items-center justify-between px-8">
				<div className="flex flex-col gap-2">
					<div className="flex flex-row gap-2 items-center">
						<GripHorizontal className="size-10 text-white mr-2" />
						<h1 className="text-white font-bold text-3xl">
							Servicios
						</h1>
					</div>
					<p className="text-lg font-medium text-white">
						Visualiza todos los servicios existentes en Medismart.
					</p>
				</div>
				<ListButtonBanner buttons={actionsButtons} />
			</div>
			<ServicesTable />
		</main>
	);
};

export default CountryPage;
