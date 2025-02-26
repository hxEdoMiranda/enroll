import {
	MasiveDownUserIcon,
	MasiveUpUserIcon,
	UpUserIcon,
	UsersIcon,
} from "@/modules/icons";
import { Button } from "@/components/ui/button";
import UserTable from "@/modules/users/users-table";
import { getAllUsers } from "@/modules/configuration/actions/fetch-user";
import { PatientMailForm } from "@/components/ms/enroll/form-envio-correo-individual";
import { ListButtonBanner } from "@/components/ms/list-button-banner";

export default async function EmpresasPage() {
	const users = await getAllUsers();
	console.log("Users >>>", users.data);

	const actionsButtons = [
		{
			trigger: (
				<Button
					variant="ghost"
					className="flex flex-row gap-2 shadow-lg text-white bg-white/20 hover:bg-white/70  items-center rounded-full border border-white"
				>
					<UpUserIcon fill="currentColor" />
					CARGA INDIVIDUAL
				</Button>
			),
			content: <PatientMailForm />,
			title: "Carga Individual",
			description: "Carga un usuario individualmente",
			className: "w-[1010px] p-8",
		},
		{
			trigger: (
				<Button
					variant="ghost"
					className="flex flex-row gap-2 shadow-lg text-white bg-white/20 hover:bg-white/70  items-center rounded-full border border-white"
					disabled={true}
				>
					<MasiveUpUserIcon fill="currentColor" />
					CARGA MASIVA
				</Button>
			),
			content: <PatientMailForm />,
			title: "Carga Masiva",
			description: "Carga usuarios en masa",
		},
		{
			trigger: (
				<Button
					variant="ghost"
					className="flex flex-row gap-2 shadow-lg text-white bg-white/20 hover:bg-white/70  items-center rounded-full border border-white"
					disabled={true}
				>
					<MasiveDownUserIcon fill="currentColor" />
					BAJA MASIVA
				</Button>
			),
			content: <PatientMailForm />,
			title: "Baja Masiva",
			description: "Baja usuarios en masa",
		},
	];

	return (
		<main className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 w-full">
			<div className="bg-[url('/img/shared/background-banner.png')] bg-cover bg-center bg-no-repeat relative h-24 rounded-xl mb-4 flex flex-row gap-1 items-center justify-between px-8">
				<div className="flex flex-col gap-2">
					<div className="flex flex-row gap-2 items-center">
						<UsersIcon className="size-10 text-white mr-2" />
						<h1 className="text-white font-bold text-3xl">
							Gestión Usuarios
						</h1>
					</div>
					<p className="text-lg font-medium text-white">
						Encuentra, modifica y elimina usuarios existente, o crea
						nuevos usuarios.
					</p>
				</div>
				<ListButtonBanner buttons={actionsButtons} />
			</div>
			<UserTable users={users.data} />
		</main>
	);
}
