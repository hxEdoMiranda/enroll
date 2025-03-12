"use client";

import { useRouter } from "next/navigation";
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
	Select,
	SelectItem,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
	Service,
	ServiceSchema,
} from "@/modules/configuration/schemas/service.model";
import { useState } from "react";

import { updateService } from "@/modules/configuration/actions/services";
import { CountryModel as Country } from "@/modules/configuration/types/Country.type";


interface ServiceFormProps {
	id:string;
	servicio: Service;
	paises:Country[];
}

export function ServiceUpdateForm({ id, servicio, paises }: ServiceFormProps) {
	const router = useRouter();
	console.log("ServiceUpdateForm-servicio:", servicio)
	//const [countries, setCountries] = useState<Country[]>([]);
	const countries:Country[] = paises;
	const [loading, setLoading] = useState(false);
	const [selectedCountries, setSelectedCountries] = useState<string[]>(servicio.country);

	const form = useForm<Service>({
		resolver: zodResolver(ServiceSchema),
		defaultValues: {
			code: servicio.code,
			name: servicio.name,
			description: servicio.description,
			country: servicio.country,
			price_2b: servicio.price_2b,
			discount_2b: servicio.discount_2b,
			price_2c: servicio.price_2c,
			discount_2c: servicio.discount_2c,
			responsible_name: servicio.responsible_name,
			responsible_mail: servicio.responsible_mail,
			state: true,
		}
	});

	const handleSubmit = async (data: Service) => {
		try {
			//console.log("handleSubmit::::::::::::::::::::::::::",data);
			//console.log("handleSubmit-id::::::::::::::::::::::::::",id);
			const response = await updateService(id, data);
			//console.log(":::::::::::::response:::::::::::::", response);
			if (response.ok) {
				toast.success("Servicio creado exitosamente");
				form.reset();
			} else {
				toast.error(response.message);
			}
			router.push("/enroll/menu/servicios");
		} catch (error) {
			console.error("Error al crear el servicio:", error);
			toast.error("Error al crear el servicio");
		}
	};

	return (
		<div className="w-full mt-6">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="grid grid-cols-12 gap-4"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
									Nombre del servicio
									<span className="text-primary">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: SERVICIO DE SALUD"
										{...field}
										onChange={(e) =>
											field.onChange(
												e.target.value.toUpperCase()
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="code"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
									Código{" "}
									<span className="text-primary">*</span>
								</FormLabel>
								<FormControl>
									<Input placeholder="Ej: SRV00" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="col-span-12">
								<FormLabel>
									Descripción{" "}
									<span className="text-primary">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: Asesoramiento en ..."
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="price_2b"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
								price_2b
									<span className="text-primary">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: 5000"
										{...field}
										onChange={(e) =>
											field.onChange(
												e.target.value.toUpperCase()
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					

					<FormField
						control={form.control}
						name="discount_2b"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
								discount_2b
									<span className="text-primary">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: 500"
										{...field}
										onChange={(e) =>
											field.onChange(
												e.target.value.toUpperCase()
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					


					<FormField
						control={form.control}
						name="price_2c"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
								price_2c
									<span className="text-primary">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: 5000"
										{...field}
										onChange={(e) =>
											field.onChange(
												e.target.value.toUpperCase()
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="discount_2c"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
								discount_2c
									<span className="text-primary">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: 500"
										{...field}
										onChange={(e) =>
											field.onChange(
												e.target.value.toUpperCase()
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="responsible_name"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
								responsible_name
									<span className="text-primary">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: jhon smith"
										{...field}
										onChange={(e) =>
											field.onChange(
												e.target.value.toUpperCase()
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					
					<FormField
						control={form.control}
						name="responsible_mail"
						render={({ field }) => (
							<FormItem className="col-span-6">
								<FormLabel>
								responsible_name
									<span className="text-primary">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: jhon.smith@correo.com"
										{...field}
										onChange={(e) =>
											field.onChange(
												e.target.value.toUpperCase()
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid w-full items-center col-span-6">
						<Select
							onValueChange={(value) => {
								setSelectedCountries([
									...selectedCountries,
									value,
								]);
								const currentCountries =
									form.getValues("country") || [];
								form.setValue("country", [
									...currentCountries,
									value,
								]);
							}}
							disabled={loading || countries.length === 0}
						>
							<Label htmlFor="country">País *</Label>
							<SelectTrigger className="w-full">
								<SelectValue
									placeholder={
										loading
											? "Cargando países..."
											: "Seleccionar País"
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{loading ? (
									<SelectItem disabled value="loading">
										Cargando países...
									</SelectItem>
								) : countries.length > 0 ? (
									countries
										.filter(
											(country) =>
												!selectedCountries.includes(
													country.uid || ""
												)
										)
										.map((country) => (
											<SelectItem
												key={country.code}
												value={country.uid || ""}
											>
												{country.name}
											</SelectItem>
										))
								) : (
									<SelectItem
										disabled
										value="no-countries-available"
									>
										No hay países disponibles
									</SelectItem>
								)}
							</SelectContent>
						</Select>
					</div>

					<div className="grid w-full items-center col-span-6">
						<h3 className="text-sm font-medium mb-2">
							Países seleccionados:
						</h3>
						{selectedCountries.length > 0 ? (
							<div className="flex flex-wrap gap-2">
								{selectedCountries.map((countryId, index) => {
									console.log("countryId:",countryId)
									const country = countries.find(
										(c) => c.uid === countryId
									);
									return (
										<div
											key={index}
											className="flex items-center bg-muted rounded-md p-2"
										>
											<span className="text-sm">
												{country?.name || countryId}
											</span>
											<Button
												type="button"
												variant="ghost"
												className="h-6 w-6 p-0 ml-2"
												onClick={() => {
													const newSelectedCountries =
														[...selectedCountries];
													newSelectedCountries.splice(
														index,
														1
													);
													setSelectedCountries(
														newSelectedCountries
													);
													form.setValue(
														"country",
														newSelectedCountries
													);
												}}
											>
												✕
											</Button>
										</div>
									);
								})}
							</div>
						) : (
							<p className="text-sm text-muted-foreground">
								No hay países seleccionados
							</p>
						)}
					</div>
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
						: "ACTUALIZAR SERVICIO"}
				</Button>
			</div>
		</div>
	);
}
