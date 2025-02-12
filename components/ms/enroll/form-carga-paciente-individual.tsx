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

interface PatientFormProps {
	setOpen?: (open: boolean) => void;
}

export function PatientForm({ setOpen }: PatientFormProps) {

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
		console.log("Data >>>", data);
    const formattedAddress = splitAddress(data.address);
    const formattedData = {
      ...data,
      address: formattedAddress,
    };
    console.log("Formatted Data >>>", formattedData);
		try {
			const response = await createUser(formattedData);
			if (response.ok) {
				toast.success("Paciente agregado exitosamente");
				console.log("Paciente agregado exitosamente >>>", response);
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
		<div className="w-full mx-auto p-6">
			<h2 className="text-2xl font-semibold text-primary mb-6">
				Datos Personales
			</h2>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="space-y-6 grid grid-cols-3 gap-4"
				>
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
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
							<FormItem>
								<FormLabel>Apellido *</FormLabel>
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
							<FormItem>
								<FormLabel>N° Documento *</FormLabel>
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
							<FormItem>
								<FormLabel>Fecha de Nacimiento *</FormLabel>
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
							<FormItem>
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
							<FormItem>
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
							<FormItem>
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

					{/* //! TODO: Agregar los planes con Ids de Mongo */}
					{/* <FormField
						control={form.control}
						name="plans"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Plan *</FormLabel>
								<Select
									onValueChange={(value) =>
										field.onChange([value])
									}
									value={field.value?.[0] || ""}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Seleccionar Plan" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="cronico">
											Crónico
										</SelectItem>
										<SelectItem value="premium">
											Premium
										</SelectItem>
										<SelectItem value="basico">
											Básico
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/> */}

					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem>
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

					<Button
						type="submit"
						className="w-full bg-blue-500 hover:bg-blue-600"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting
							? "PROCESANDO..."
							: "AGREGAR PACIENTE"}
					</Button>
				</form>
			</Form>
		</div>
	);
}
