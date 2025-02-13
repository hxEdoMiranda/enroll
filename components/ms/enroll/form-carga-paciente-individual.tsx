"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	UserDataSchema,
	type UserData,
} from "@/modules/configuration/schemas/user-data.schema";
import {
	Select,
	SelectItem,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createUser } from "@/modules/configuration/actions/fetch-user";
import { toast } from "sonner";
import { splitAddress } from "@/modules/configuration/schemas/user-data.schema";
import { Label } from "@/components/ui/label";

interface PatientFormProps {
	onSuccess?: () => void;
}

export function PatientForm({ onSuccess }: PatientFormProps) {
	const form = useForm<UserData>({
		resolver: zodResolver(UserDataSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			emailAddress: "",
			document: "",
			documentType: "DNI",
			birthDate: "",
			address: "",
			gender: "MALE",
			maritalStatus: "S",
			plans: ["67570b2f2c29920a4107a919"],
			roles: ["patient"],
			country: "CL",
			countryResidence: "CL",
		},
	});

	const handleSubmit = async (data: UserData) => {
		const formattedAddress = splitAddress(data.address);
		const formattedData = {
			...data,
			address: formattedAddress,
		};
		try {
			const response = await createUser(formattedData);
			if (response.ok) {
				toast.success("Paciente agregado exitosamente");
				form.reset();
				onSuccess?.();
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			console.error("Error al agregar el paciente:", error);
			toast.error("Error al agregar el paciente");
		}
	};

	return (
		<div className="w-full mt-6">
			<h2 className="text-xl font-bold text-primary mb-6">
				Datos Personales
			</h2>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="grid grid-cols-12 gap-4"
				>
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem className="col-span-5">
								<FormLabel>
									Nombre{" "}
									<span className="text-primary">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: Marina"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem className="col-span-5">
								<FormLabel>
									Apellido{" "}
									<span className="text-primary">*</span>
								</FormLabel>
								<FormControl>
									<Input placeholder="Ej: Perez" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="document"
						render={({ field }) => (
							<FormItem className="col-span-2">
								<FormLabel>
									N° Documento{" "}
									<span className="text-primary">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: 18565653-6"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="birthDate"
						render={({ field }) => (
							<FormItem className="col-span-4">
								<FormLabel>
									Fecha de Nacimiento{" "}
									<span className="text-primary">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: 2024-10-15"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid w-full items-center col-span-4">
						<Label htmlFor="phone1">Teléfono Contacto 1</Label>
						<Input
							className="mt-1"
							type="tel"
							id="phone1"
							placeholder="Teléfono"
							disabled
						/>
					</div>

					<div className="grid w-full items-center col-span-4">
						<Label htmlFor="phone2">Teléfono Contacto 2</Label>
						<Input
							className="mt-1"
							type="tel"
							id="phone2"
							placeholder="Teléfono"
							disabled
						/>
					</div>

					<FormField
						control={form.control}
						name="emailAddress"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
									Email{" "}
									<span className="text-primary">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: marina.perez@dominio.com"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>Dirección Particular</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: Calle 123, Ciudad, Región"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid w-full items-center col-span-6">
						<Label htmlFor="company">
							Empresa <span className="text-primary">*</span>
						</Label>
						<Input
							className="mt-1"
							type="text"
							id="company"
							placeholder="Compañía"
							disabled
						/>
					</div>

					<div className="grid w-full items-center col-span-6">
						<Label htmlFor="plans">Planes</Label>
						<Input
							className="mt-1"
							type="text"
							id="plans"
							placeholder="Plan"
							disabled
						/>
					</div>

					<div className="grid w-full items-center col-span-6">
						<Select>
							<Label>Tipo de Paciente</Label>
							<SelectTrigger className="w-full" disabled>
								<SelectValue placeholder="Seleccionar tipo de paciente" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="titular">Titular</SelectItem>
								<SelectItem value="carga">Carga</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="grid w-full items-center col-span-6">
						<Select>
							<Label>Previsión</Label>
							<SelectTrigger className="w-full" disabled>
								<SelectValue placeholder="Seleccionar previsión" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1">Previsión 1</SelectItem>
								<SelectItem value="2">Previsión 2</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<FormField
						control={form.control}
						name="gender"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>Género *</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Seleccionar Género" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="MALE">
											Masculino
										</SelectItem>
										<SelectItem value="FEMALE">
											Femenino
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="maritalStatus"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>Estado Civil *</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Seleccionar Estado Civil" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="S">
											Soltero
										</SelectItem>
										<SelectItem value="C">
											Casado
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

				</form>
			</Form>

			<div className="flex w-[270px] justify-self-end mt-6">
				<Button
					onClick={form.handleSubmit(handleSubmit)}
					className="w-full bg-primary rounded-full text-white font-bold text-base"
					disabled={form.formState.isSubmitting}
				>
					{form.formState.isSubmitting
						? "PROCESANDO..."
						: "AGREGAR PACIENTE"}
				</Button>
			</div>
		</div>
	);
}
