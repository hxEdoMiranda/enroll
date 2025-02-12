import {
	MasiveDownUserIcon,
	MasiveUpUserIcon,
	UpUserIcon,
	UsersIcon,
} from "@/modules/icons";
import { Button } from "@/components/ui/button";
import UserTable from "@/modules/users/users-table";
import { getAllUsers } from "@/modules/configuration/actions/fetch-user";
import { ButtonBanner } from "@/components/ms/button-banner";
import { PatientForm } from "@/components/ms/enroll/form-carga-paciente-individual";

export default async function EmpresasPage() {
	const users = await getAllUsers();
	console.log("Users >>>", users.data);

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

				<div className="flex flex-row gap-2 items-center">
					<ButtonBanner
						trigger={
							<Button
								variant="ghost"
								className="flex flex-row gap-2 shadow-lg text-white bg-white/20 hover:bg-white/70  items-center rounded-full border border-white"
							>
								<UpUserIcon fill="currentColor" />
								CARGA INDIVIDUAL
							</Button>
						}
						content={<PatientForm />}
						title="Carga Individual"
						description="Carga un usuario individualmente"
					/>

					<ButtonBanner
						trigger={
							<Button
								variant="ghost"
								className="flex flex-row gap-2 shadow-lg text-white bg-white/20 hover:bg-white/70  items-center rounded-full border border-white"
							>
								<MasiveUpUserIcon fill="currentColor" />
								CARGA MASIVA
							</Button>
						}
						content={<PatientForm />}
						title="Carga Masiva"
						description="Carga usuarios en masa"
					/>

					<ButtonBanner
						trigger={
							<Button
								variant="ghost"
								className="flex flex-row gap-2 shadow-lg text-white bg-white/20 hover:bg-white/70  items-center rounded-full border border-white"
							>
								<MasiveDownUserIcon fill="currentColor" />
								BAJA MASIVA
							</Button>
						}
						content={<PatientForm />}
						title="Baja Masiva"
						description="Baja usuarios en masa"
					/>
				</div>
			</div>
			<UserTable users={users.data} />
		</main>
	);
}
