"use client";

import { PlanModel } from "@/modules/configuration/types/Plan.type";
import { BannerPlanManager } from "./banner-plan-manager";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
	Form,
	FormMessage,
	FormLabel,
	FormItem,
	FormControl,
	FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	UpdatePlanSchema,
	UpdatePlan,
} from "@/modules/configuration/schemas/plan.model";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { CompanyFullModel } from "@/modules/configuration/types/Company.type";
import { updatePlanInfo } from "@/actions/planes";
import { ServiceModel } from "@/modules/configuration/types/Service.type";

interface PlanManagerProps {
	planesData: PlanModel[];
	companyData: CompanyFullModel;
  servicesData: ServiceModel[];
}

export function PlanManager({ planesData, companyData, servicesData }: PlanManagerProps) {
	const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
	const [message, setMessage] = useState("");

	console.log("companyData", companyData);

	// Función para formatear fechas al formato YYYY-MM-DD
	const formatDate = (dateString: string) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toISOString().split("T")[0];
	};

	// Establecer el primer plan como seleccionado por defecto
	useEffect(() => {
		if (!selectedPlanId && planesData.length > 0) {
			setSelectedPlanId(planesData[0].uid);
		}
	}, []);

	const selectedPlan = selectedPlanId
		? planesData.find((plan) => plan.uid === selectedPlanId)
		: null;

	const defaultValues = {
		uid: selectedPlan ? selectedPlan.uid : "",
		identifier: selectedPlan ? selectedPlan.identifier : "",
		name: selectedPlan ? selectedPlan.name : "",
		state: selectedPlan ? selectedPlan.state : false,
		start_date: selectedPlan ? formatDate(selectedPlan.start_date) : "",
		end_date: selectedPlan ? formatDate(selectedPlan.end_date) : "",
		max_number_of_holders: selectedPlan
			? selectedPlan.max_number_of_holders
			: 0,
		self_managed_load: selectedPlan
			? selectedPlan.self_managed_load
			: false,
		max_number_of_loads: selectedPlan
			? selectedPlan.max_number_of_loads
			: 0,
		custom_plan_id: "6781197f090c7577fa400c10",
		company: companyData.id,
	};

	console.log("defaultValues", defaultValues);

	const form = useForm<UpdatePlan>({
		resolver: zodResolver(UpdatePlanSchema),
		defaultValues,
	});

	// Actualizar el formulario cuando cambie el plan seleccionado
	useEffect(() => {
		if (selectedPlan) {
			const updatedValues = {
				...defaultValues,
			};
			form.reset(updatedValues);
		}
	}, [selectedPlanId, selectedPlan]);

	const handleSubmit = async (values: UpdatePlan) => {
		try {
			console.log("Iniciando envío del formulario");
			console.log("editando usuario con estos valores", values);
			setMessage(
				"Editando usuario con estos valores: " +
					JSON.stringify(values, null, 2)
			);
			const result = await updatePlanInfo({
				...values,
				service: selectedPlan?.service,
			});
			console.log("resultado de la actualizacion", result);
			setMessage("Plan actualizado correctamente");
		} catch (error) {
			console.error("Error al enviar el formulario:", error);
			setMessage("Error al enviar el formulario");
		}
	};

	return (
		<div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 w-full">
			<BannerPlanManager
				planesData={planesData}
				selectedPlanId={selectedPlanId}
				onPlanSelect={setSelectedPlanId}
			/>
			<div className="h-full rounded-md px-8 py-5">
				<div className="flex flex-row justify-between mb-8">
					<div className="flex flex-col">
						<h2 className="text-3xl font-medium">
							{`${selectedPlan?.name} -  Información y Servicios`}
						</h2>
						<p className="text-lg font-medium">
							Agregue o edite la información básica del plan,
							junto a los servicios que este contendra.
						</p>{" "}
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							className="flex items-center gap-2 rounded-full border-primary text-primary hover:bg-primary hover:text-white"
						>
							PREVIZUALIZACIÓN
							<EyeIcon />
						</Button>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-8">
					<div className="col-span-1 border border-primary rounded-md p-4">
						<h3 className="text-xl font-medium">
							Información del Plan
						</h3>
						<Separator className="my-8" />
						<div className="flex flex-col gap-4">
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
													<span className="text-red-500">
														*
													</span>
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
													<span className="text-red-500">
														*
													</span>
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
													<span className="text-red-500">
														*
													</span>
												</FormLabel>
												<FormControl>
													<Input
														type="date"
														{...field}
													/>
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
													<span className="text-red-500">
														*
													</span>
												</FormLabel>
												<FormControl>
													<Input
														type="date"
														{...field}
													/>
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
													<span className="text-red-500">
														*
													</span>
												</FormLabel>
												<FormControl>
													<Select
														onValueChange={(
															value
														) =>
															field.onChange(
																value ===
																	"active"
															)
														}
														value={
															field.value
																? "active"
																: "inactive"
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
														Cargas
														Autoadministrables{" "}
														<span className="text-red-500">
															*
														</span>
													</FormLabel>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={
															field.onChange
														}
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
													<span className="text-red-500">
														*
													</span>
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														placeholder="Ej: 100"
														{...field}
														value={
															field.value || ""
														} // Aseguramos que el valor siempre sea un string o vacío
														onChange={(e) =>
															field.onChange(
																Number(
																	e.target
																		.value
																) || 0
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
													<span className="text-red-500">
														*
													</span>
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														placeholder="Ej: 10"
														{...field}
														value={
															field.value || ""
														} // Aseguramos que el valor siempre sea un string o vacío
														onChange={(e) =>
															field.onChange(
																Number(
																	e.target
																		.value
																) || 0
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
												: "EDITAR PLAN"}
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
					</div>
					<div className="col-span-1 border border-primary rounded-md p-4">
						<h3 className="text-xl font-medium">Servicios</h3>
						<Tabs defaultValue="account" className="w-full">
							<TabsList>
								<TabsTrigger value="account">Todo</TabsTrigger>
								<TabsTrigger value="password">
									Macroservicios
								</TabsTrigger>
							</TabsList>
							<TabsContent value="account">
								<Accordion
									type="single"
									collapsible
									className="w-full"
								>
									<AccordionItem value="item-1">
										<AccordionTrigger
											arrowPosition="left"
											className="justify-start"
										>
											Macroservicio 1
										</AccordionTrigger>
										<AccordionContent className="flex flex-col">
											{servicesData.map((service) => (
												<div className="flex items-center space-x-3 px-8 py-4" key={service.uid}>
													<Checkbox id="terms" />
													<label
													htmlFor="terms"
													className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
												>
													{service.name}
												</label>
											</div>
											))}
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							</TabsContent>
							<TabsContent value="password">
								Change your password here.
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
}
