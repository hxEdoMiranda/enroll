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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PlanSchema } from "@/modules/configuration/schemas/plan.model";
import { PlanModel as Plan } from "@/modules/configuration/types/Plan.type";
import { toast } from "sonner";
import { postCreatePlan } from "@/actions/planes";
import React, { useState } from "react";
import NameServicesTable from "@/components/ms/enroll/grid-name-services";

const PlanForm = () => {
	const [message, setMessage] = useState("");
	const form = useForm<Plan>({
	  resolver: zodResolver(PlanSchema),
	  defaultValues: {
		uid: '',
		identifier: '',
		name: '',
		state: true,
		start_date: '',
		end_date: '',
		max_number_of_holders: 0,
		self_managed_load: false,
		max_number_of_loads: 0,
		custom_plan_id: '',
		company: '',
		service: []  // Campo de servicios inicialmente vacío
	  },
	});
  
	// Esta función maneja la actualización de los servicios seleccionados
	const handleSelectServices = (selectedIds: string[]) => {
	  form.setValue("service", selectedIds); // Actualiza el campo 'service' en el formulario
	};
	const selectedServiceIds = form.watch("service"); // Obtener los valores actuales del formulario

    
  const handleSubmit = async (values: Plan) => {
    console.log("Formulario enviado con los siguientes valores:", values);
    try {
      const mappedValues = {
        uid: values.uid,
        identifier: values.identifier,
        name: values.name,
        state: values.state,
        start_date: values.start_date,
        end_date: values.end_date,
        max_number_of_holders: values.max_number_of_holders,
        self_managed_load: values.self_managed_load,
        max_number_of_loads: values.max_number_of_loads,
        custom_plan_id: values.custom_plan_id,
        company: values.company,
        service: values.service,  // Los IDs de los servicios seleccionados
      };

      const result = await postCreatePlan(mappedValues);
      console.log("Resultado de la API:", result);
      setMessage("Plan creado exitosamente.");
      toast.success("Plan creado exitosamente");
      form.reset();
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setMessage("Error al crear el plan. Por favor, inténtalo de nuevo.");
      toast.error("Error al crear el plan");
    }
  };

  return (
    <div className="w-full mt-6">
      <h2 className="text-xl font-bold text-primary mb-6">Crear Plan</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-12 gap-4">
          
          {/* Campo Identifier */}
          <FormField control={form.control} name="identifier" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Identifier *</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Identificador único del plan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Campo Name */}
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Nombre del Plan *</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Plan Básico" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Campo Estado */}
          <FormField control={form.control} name="state" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Estado *</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange(value === "active")} value={field.value ? "active" : "inactive"}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Campo Fecha de inicio */}
          <FormField control={form.control} name="start_date" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Fecha de inicio *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Campo Fecha de fin */}
          <FormField control={form.control} name="end_date" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Fecha de fin *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Campo Maximo de holders */}
          <FormField control={form.control} name="max_number_of_holders" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Número máximo de holders *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ej: 100" 
                  {...field} 
                  value={field.value || ''} // Aseguramos que el valor siempre sea un string o vacío
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)} // Convertimos el valor a número
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Campo Self Managed Load */}
          <FormField control={form.control} name="self_managed_load" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Self Managed Load *</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value ? "yes" : "no"}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar opción" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">Sí</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Campo Maximo de cargas */}
          <FormField control={form.control} name="max_number_of_loads" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Número máximo de cargas *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ej: 10" 
                  {...field} 
                  value={field.value || ''} // Aseguramos que el valor siempre sea un string o vacío
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)} // Convertimos el valor a número
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Componente NameServicesTable */}
		  <div className="col-span-12 w-full">
            <NameServicesTable
              onSelectServices={handleSelectServices}
              selectedServiceIds={selectedServiceIds} // Pasamos los servicios seleccionados
            />
          </div>
          {/* Botón de enviar */}
          <div className="col-span-12 flex justify-end mt-6">
            <Button type="submit" className="bg-primary rounded-full text-white font-bold text-base">
              {form.formState.isSubmitting ? "PROCESANDO..." : "CREAR PLAN"}
            </Button>
          </div>
        </form>
      </Form>
      {message && <div className="mt-4 text-center text-sm text-gray-500">{message}</div>}
    </div>
  );
};

export default PlanForm;
