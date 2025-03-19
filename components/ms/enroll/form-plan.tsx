"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PlanSchema, Plan } from "@/modules/configuration/schemas/plan.model";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { postCreatePlan } from "@/app/actions/planes";

interface PlanFormProps {
	company?: string;
	onPlanCreated?: () => void;
}

const PlanForm = ({ company, onPlanCreated }: PlanFormProps) => {
	const params = useParams();
	const companyId = company || params?.id as string;
	console.log("ID de la empresa:", companyId);

	const form = useForm<Plan>({
		resolver: zodResolver(PlanSchema),
		defaultValues: {
			identifier: "",
			name: "",
			state: false,
			start_date: "",
			end_date: "",
			max_number_of_holders: 0,
			self_managed_load: false,
			max_number_of_loads: 0,
			custom_plan_id: "6781197f090c7577fa400c10",
			company: companyId ?? "",
		},
		mode: "onChange",
	});

	console.log("form", form.getValues());

	const [message, setMessage] = useState("");

	const handleSubmit = async (values: Plan) => {
		console.log("Formulario enviado con los siguientes valores:", values);
		try {
			const result = await postCreatePlan(values);
			console.log("Resultado de la API:", result);

			setMessage("Plan creado exitosamente.");
			toast.success("Plan creado exitosamente");

			// Llama al callback si existe
			if (onPlanCreated) {
				onPlanCreated();
			} else {
				form.reset();
				window.location.reload();
			}
		} catch (error) {
			console.error("Error al enviar los datos:", error);
			setMessage(
				"Error al crear el plan. Por favor, inténtalo de nuevo."
			);
			toast.error("Error al crear el plan");
		}
	};

	return (
		<div className="w-full mt-6">
			<h2 className="text-2xl font-semibold mb-6">Agregar Plan</h2>
			<p className="text-xl font-bold mb-6">
				Información básica del plan.
			</p>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="grid grid-cols-12 gap-4"
				>
					{/* Campo Identifier */}
					<FormField
						control={form.control}
						name="identifier"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
									Identificador del Plan{" "}
									<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: Identificador único del plan"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Campo Name */}
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
									Nombre del Plan{" "}
									<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: Plan Básico"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Campo Fecha de inicio */}
					<FormField
						control={form.control}
						name="start_date"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
									Fecha Inicio{" "}
									<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input type="date" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Campo Fecha de fin */}
					<FormField
						control={form.control}
						name="end_date"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
									Fecha Termino{" "}
									<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input type="date" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Campo Estado */}
					<FormField
						control={form.control}
						name="state"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
									Estado{" "}
									<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) =>
											field.onChange(value === "active")
										}
										value={
											field.value ? "active" : "inactive"
										}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Seleccionar Estado" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="active">
												Activo
											</SelectItem>
											<SelectItem value="inactive">
												Inactivo
											</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Campo Self Managed Load */}
					<FormField
						control={form.control}
						name="self_managed_load"
						render={({ field }) => (
							<FormItem className="col-span-6 flex flex-row items-center gap-2">
								<div className="space-y-0">
									<FormLabel className="items-center">
										Cargas Autoadministrables{" "}
										<span className="text-red-500">*</span>
									</FormLabel>
								</div>
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
										className="bg-primary mt-0"
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					{/* Campo Maximo de holders */}
					<FormField
						control={form.control}
						name="max_number_of_holders"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
									Cantidad Máxima Titulares{" "}
									<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="Ej: 100"
										{...field}
										value={field.value || ""} // Aseguramos que el valor siempre sea un string o vacío
										onChange={(e) =>
											field.onChange(
												Number(e.target.value) || 0
											)
										} // Convertimos el valor a número
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Campo Maximo de cargas */}
					<FormField
						control={form.control}
						name="max_number_of_loads"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
									Cantidad Máxima Cargas{" "}
									<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="Ej: 10"
										{...field}
										value={field.value || ""} // Aseguramos que el valor siempre sea un string o vacío
										onChange={(e) =>
											field.onChange(
												Number(e.target.value) || 0
											)
										} // Convertimos el valor a número
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Botón de enviar */}
					<div className="col-span-12 flex justify-end mt-6">
						<Button
							type="submit"
							className="bg-primary rounded-full text-white font-bold text-base"
						>
							{form.formState.isSubmitting
								? "PROCESANDO..."
								: "CREAR PLAN"}
						</Button>
					</div>
				</form>
			</Form>
			{message && (
				<div className="mt-4 text-center text-sm text-gray-500">
					{message}
				</div>
			)}
		</div>
	);
};

export default PlanForm;
