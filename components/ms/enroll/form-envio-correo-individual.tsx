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
} from "@/modules/configuration/schemas/user-patient.schema";
import {
	Select,
	SelectItem,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createMailUser } from "@/modules/configuration/actions/mail-user";
import { toast } from "sonner";

interface PatientFormProps {
	onSuccess?: () => void;
}

export function PatientMailForm({ onSuccess }: PatientFormProps) {
	const form = useForm<UserData>({
		resolver: zodResolver(UserDataSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			emailAddress: "",
			urlRedirect: "https://medismart-3-0-front.vercel.app/sign-in?redirect_url=https%3A%2F%2Fmedismart-3-0-front.vercel.app%2F",
			role: "patient",
			plans: [],
		},
	});

	const handleSubmit = async (data: UserData) => {
		try {
			const response = await createMailUser(data);
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
				<form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-12 gap-4">
					<FormField control={form.control} name="firstName" render={({ field }) => (
						<FormItem className="col-span-6">
							<FormLabel>Nombre *</FormLabel>
							<FormControl>
								<Input placeholder="Ej: John" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)} />

					<FormField control={form.control} name="lastName" render={({ field }) => (
						<FormItem className="col-span-6">
							<FormLabel>Apellido *</FormLabel>
							<FormControl>
								<Input placeholder="Ej: Doe" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)} />

					<FormField control={form.control} name="emailAddress" render={({ field }) => (
						<FormItem className="col-span-12">
							<FormLabel>Email *</FormLabel>
							<FormControl>
								<Input placeholder="Ej: john.doe@dominio.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)} />

					<FormField control={form.control} name="role" render={({ field }) => (
						<FormItem className="col-span-6">
							<FormLabel>Rol *</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Seleccionar rol" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="admin">Admin</SelectItem>
									<SelectItem value="patient">Paciente</SelectItem>
									<SelectItem value="superadmin">Superadmin</SelectItem>
									<SelectItem value="doctor">Doctor</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)} />

					<div className="col-span-12 flex justify-end mt-6">
						<Button type="submit" className="bg-primary rounded-full text-white font-bold text-base">
							{form.formState.isSubmitting ? "PROCESANDO..." : "AGREGAR PACIENTE"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
