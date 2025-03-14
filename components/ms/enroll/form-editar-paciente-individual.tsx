"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
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
	UpdateDataUserSchema,
	type UpdateDataUser,
} from "@/modules/configuration/schemas/user-data.schema";
import {
	Select,
	SelectItem,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { updateUserById } from "@/modules/configuration/actions/fetch-user";
import { toast } from "sonner";
import { splitAddress } from "@/modules/configuration/schemas/user-data.schema";
import { Data } from "@/modules/configuration/types/user-data.type";
import { getUserById } from "@/modules/configuration/actions/fetch-user";
import { UserType } from "@/modules/configuration/types/user.type";

interface EditPatientFormProps {
	user: UserType;
	setOpen?: (open: boolean) => void;
}

export function EditPatientForm({ user, setOpen }: EditPatientFormProps) {
	const [userData, setUserData] = useState<Data | null>(null);

	const form = useForm<UpdateDataUser>({
		resolver: zodResolver(UpdateDataUserSchema),
		defaultValues: {
			firstName: user.clerk.firstName || "",
			lastName: user.clerk.lastName || "",
			emailAddress: user.clerk.emailAddresses[0].emailAddress || "",
			birthDate: userData?.fhir.birthDate || "",
			address:
				`${userData?.fhir.address[0].line[0]}, ${userData?.fhir.address[0].city}, ${userData?.fhir.address[0].state}` ||
				"",
			gender: userData?.fhir.gender || "OTHER",
			maritalStatus: userData?.fhir.maritalStatus.coding[0].code || "S",
			country: "CL",
		},
	});

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await getUserById(user.clerk.id);
				console.log(response.data);
				setUserData(response.data);
				form.reset({
					...form.getValues(),
					birthDate: response.data?.fhir.birthDate,
					address: `${response.data.fhir.address[0].line[0]}, ${response.data.fhir.address[0].city}, ${response.data.fhir.address[0].state}`,
					gender:
						response.data?.fhir.gender?.toUpperCase() || "OTHER",
					maritalStatus:
						response.data?.fhir.maritalStatus?.coding[0]?.code,
				});
			} catch (error) {
				console.error("Error al obtener datos del usuario:", error);
				toast.error("Error al obtener datos del usuario");
			}
		};

		fetchUserData();
	}, [user.clerk.id]);

	const handleSubmit = async (data: UpdateDataUser) => {
		console.log("Data >>>", data);
		const formattedAddress = splitAddress(data.address || "");
		const formattedData = {
			...data,
			address: formattedAddress,
		};
		console.log("Formatted Data >>>", formattedData);
		try {
			const response = await updateUserById(user.clerk.id, formattedData);
			if (response.ok) {
				toast.success("Paciente actualizado exitosamente");
				console.log("Paciente actualizado exitosamente >>>", response);
				form.reset();
				setOpen?.(false);
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
				Editar Datos Personales
			</h2>
			{userData ? (
				<>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="grid grid-cols-12 gap-4"
						>
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem className="col-span-6">
										<FormLabel>Nombre *</FormLabel>
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
									<FormItem className="col-span-6">
										<FormLabel>Apellido *</FormLabel>
										<FormControl>
											<Input
												placeholder="Ej: Perez"
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
									<FormItem className="col-span-6">
										<FormLabel>
											Fecha de Nacimiento *
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
							<FormField
								control={form.control}
								name="emailAddress"
								render={({ field }) => (
									<FormItem className="col-span-6">
										<FormLabel>Email *</FormLabel>
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
							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem className="col-span-6">
										<FormLabel>Dirección *</FormLabel>
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
								: "ACTUALIZAR PACIENTE"}
						</Button>
					</div>
				</>
			) : (
				"Cargando"
			)}
		</div>
	);
}
